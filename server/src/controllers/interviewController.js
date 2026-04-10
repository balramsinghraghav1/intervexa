import InterviewSession from "../models/InterviewSession.js";
import User from "../models/User.js";
import {
  evaluateSingleAnswer,
  generateQuestions,
  synthesizeSpeech,
  transcribeAudio
} from "../services/aiService.js";
import { finalizeScore } from "../utils/scoring.js";

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getYesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};

const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  if (user.streak.lastPracticeDate === today) {
    return user.streak;
  }

  if (user.streak.lastPracticeDate === yesterday) {
    user.streak.current += 1;
  } else {
    user.streak.current = 1;
  }

  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastPracticeDate = today;
  await user.save();

  return user.streak;
};

export const startInterview = async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const questions = await generateQuestions(subject);
    const session = await InterviewSession.create({
      user: req.user._id,
      subject,
      questions
    });

    const firstQuestion = session.questions[0];
    const spokenText = `Starting your ${subject} interview. Question 1. ${firstQuestion.prompt}`;
    const audioBase64 = await synthesizeSpeech(spokenText);

    return res.status(201).json({
      sessionId: session._id,
      question: {
        index: 0,
        total: session.questions.length,
        difficulty: firstQuestion.difficulty,
        prompt: firstQuestion.prompt
      },
      spokenText,
      audioBase64
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await InterviewSession.findOne({ _id: id, user: req.user._id });

    if (!session) {
      return res.status(404).json({ message: "Interview session not found" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Interview already completed" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Audio answer is required" });
    }

    const currentIndex = session.currentQuestionIndex;
    const currentQuestion = session.questions[currentIndex];

    if (!currentQuestion) {
      return res.status(400).json({ message: "No pending question found" });
    }

    const file = new File([req.file.buffer], req.file.originalname || "answer.webm", {
      type: req.file.mimetype || "audio/webm"
    });

    const transcript = await transcribeAudio(file);
    const evaluation = await evaluateSingleAnswer(currentQuestion, transcript);

    session.questions[currentIndex].answer = evaluation.answer;
    session.questions[currentIndex].awardedRawScore = evaluation.awardedRawScore;
    session.currentQuestionIndex += 1;

    const earnedRaw = session.questions.reduce(
      (sum, question) => sum + (question.awardedRawScore || 0),
      0
    );

    const hasNextQuestion = session.currentQuestionIndex < session.questions.length;

    if (hasNextQuestion) {
      const nextQuestion = session.questions[session.currentQuestionIndex];
      const spokenText = `Ok, next question. Question ${session.currentQuestionIndex + 1}. ${nextQuestion.prompt}`;
      const audioBase64 = await synthesizeSpeech(spokenText);

      await session.save();

      return res.json({
        status: "in_progress",
        transcript,
        savedMarks: evaluation.awardedRawScore,
        totalScoreSoFar: finalizeScore(earnedRaw),
        question: {
          index: session.currentQuestionIndex,
          total: session.questions.length,
          difficulty: nextQuestion.difficulty,
          prompt: nextQuestion.prompt
        },
        spokenText,
        audioBase64
      });
    }

    session.totalScore = finalizeScore(earnedRaw);
    session.summary =
      session.totalScore >= 16
        ? "Excellent voice interview performance. You showed strong concept clarity."
        : session.totalScore >= 11
          ? "Good progress. Your answers are solid, and more detail will raise your score."
          : "Keep practicing. Focus on fundamentals and answering with clearer structure.";
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    const streak = await updateStreak(req.user._id);
    const spokenText = `Interview completed. Your final score is ${session.totalScore} out of 20.`;
    const audioBase64 = await synthesizeSpeech(spokenText);

    return res.json({
      status: "completed",
      transcript,
      savedMarks: evaluation.awardedRawScore,
      spokenText,
      audioBase64,
      session,
      streak
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      user: req.user._id,
      status: "completed"
    })
      .sort({ completedAt: -1 })
      .limit(20);

    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
