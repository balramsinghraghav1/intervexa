import Groq from "groq-sdk";
import { questionBlueprints } from "../data/fallbackQuestions.js";
import {
  clampAwardedScore,
  computeCoverageRatio,
  getRawWeight
} from "../utils/scoring.js";

const chatModel = process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile";
const transcriptionModel = process.env.GROQ_TRANSCRIPTION_MODEL || "whisper-large-v3-turbo";
const ttsModel = process.env.GROQ_TTS_MODEL || "canopylabs/orpheus-v1-english";
const ttsVoice = process.env.GROQ_TTS_VOICE || "hannah";

const shuffle = (items) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
};

const buildFallbackQuestions = (subject) => {
  const bank = questionBlueprints[subject] || questionBlueprints.DSA;
  const byDifficulty = {
    easy: bank.filter((question) => question.difficulty === "easy"),
    medium: bank.filter((question) => question.difficulty === "medium"),
    hard: bank.filter((question) => question.difficulty === "hard")
  };

  return [
    ...shuffle(byDifficulty.easy).slice(0, 3),
    ...shuffle(byDifficulty.medium).slice(0, 4),
    ...shuffle(byDifficulty.hard).slice(0, 3)
  ];
};

const extractJsonObject = (content) => {
  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch (_error) {
    const match = content.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
};

const getClient = () => {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const generateQuestions = async (subject) => {
  const fallback = buildFallbackQuestions(subject);
  const client = getClient();

  if (!client) {
    return fallback;
  }

  try {
    const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const completion = await client.chat.completions.create({
      model: chatModel,
      temperature: 1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Generate concise technical interview questions as strict JSON. Return an object with a questions array only."
        },
        {
          role: "user",
          content: `Generate exactly 10 interview questions for ${subject}. Difficulty pattern: 3 easy, 4 medium, 3 hard. Each question must include prompt, difficulty, and expectedPoints with 2 to 4 short bullets. Avoid repeating textbook wording and vary the topics, phrasing, and examples across sessions. Session seed: ${seed}.`
        }
      ]
    });

    const parsed = extractJsonObject(completion.choices[0]?.message?.content);

    if (Array.isArray(parsed.questions) && parsed.questions.length === 10) {
      return parsed.questions;
    }
  } catch (error) {
    console.warn("AI question generation failed, using fallback:", error.message);
  }

  return fallback;
};

export const transcribeAudio = async (file) => {
  const client = getClient();

  if (!client) {
    throw new Error("GROQ_API_KEY is required for voice interviews");
  }

  try {
    const transcription = await client.audio.transcriptions.create({
      file,
      model: transcriptionModel,
      response_format: "verbose_json"
    });

    return transcription.text?.trim() || "";
  } catch (error) {
    throw new Error(`Audio transcription failed: ${error.message}`);
  }
};

export const evaluateSingleAnswer = async (question, answer) => {
  const client = getClient();

  if (!answer?.trim()) {
    return {
      answer: "",
      awardedRawScore: 0
    };
  }

  if (!client) {
    const ratio = computeCoverageRatio(answer, question.expectedPoints);
    return {
      answer,
      awardedRawScore: clampAwardedScore(ratio * getRawWeight(question.difficulty), question.difficulty)
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: chatModel,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You evaluate interview answers strictly as JSON. Return only {\"awardedRawScore\": number}."
        },
        {
          role: "user",
          content: `Question: ${question.prompt}\nDifficulty: ${question.difficulty}\nExpected points: ${question.expectedPoints.join("; ")}\nStudent answer: ${answer}\nScore this answer from 0 to ${getRawWeight(question.difficulty)}.`
        }
      ]
    });

    const parsed = extractJsonObject(completion.choices[0]?.message?.content);

    return {
      answer,
      awardedRawScore: clampAwardedScore(parsed.awardedRawScore, question.difficulty)
    };
  } catch (error) {
    const ratio = computeCoverageRatio(answer, question.expectedPoints);
    return {
      answer,
      awardedRawScore: clampAwardedScore(ratio * getRawWeight(question.difficulty), question.difficulty)
    };
  }
};

export const synthesizeSpeech = async (text) => {
  const client = getClient();

  if (!client || !text) {
    return null;
  }

  try {
    const response = await client.audio.speech.create({
      model: ttsModel,
      voice: ttsVoice,
      input: text,
      response_format: "wav"
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString("base64");
  } catch (error) {
    console.warn("Speech synthesis failed:", error.message);
    return null;
  }
};
