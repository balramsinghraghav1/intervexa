import InterviewSession from "../models/InterviewSession.js";
import User from "../models/User.js";
import { evaluateAnswers, generateQuestions } from "../services/aiService.js";
import { getRawWeight, normalizeScore } from "../utils/scoring.js";

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

    return res.status(201).json({ session });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const submitInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const session = await InterviewSession.findOne({ _id: id, user: req.user._id });

    if (!session) {
      return res.status(404).json({ message: "Interview session not found" });
    }

    const evaluation = await evaluateAnswers(session.questions, answers || []);

    let earnedRaw = 0;
    let maxRaw = 0;

    session.questions = session.questions.map((question, index) => {
      const result = evaluation[index];
      const weight = getRawWeight(question.difficulty);
      maxRaw += weight;
      earnedRaw += result.awardedRawScore;

      return {
        ...question.toObject(),
        answer: result.answer,
        feedback: result.feedback,
        awardedRawScore: result.awardedRawScore
      };
    });

    session.totalScore = normalizeScore(earnedRaw, maxRaw);
    session.summary =
      session.totalScore >= 16
        ? "Excellent progress. You are handling interview concepts with strong confidence."
        : session.totalScore >= 11
          ? "Good effort. Your basics are visible, and a bit more depth will improve your interview performance."
          : "Keep practicing. Focus on core concepts and structured explanations for better scores.";
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    const streak = await updateStreak(req.user._id);

    return res.json({
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

