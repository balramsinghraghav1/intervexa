import OpenAI from "openai";
import { questionBlueprints } from "../data/fallbackQuestions.js";
import {
  buildRuleBasedFeedback,
  computeCoverageRatio,
  getRawWeight
} from "../utils/scoring.js";

const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

export const generateQuestions = async (subject) => {
  const fallback = questionBlueprints[subject] || questionBlueprints.DSA;
  const client = getClient();

  if (!client) {
    return fallback;
  }

  try {
    const prompt = `
Generate exactly 9 interview questions for the subject "${subject}".
Return JSON with an array called "questions".
The difficulty pattern must be: 3 easy, 4 medium, 2 hard.
Each question must have:
- prompt
- difficulty
- expectedPoints (2 to 4 short bullet ideas)
Keep the questions technical and student friendly.
`;

    const response = await client.responses.create({
      model,
      input: prompt
    });

    const text = response.output_text?.trim();
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed.questions) && parsed.questions.length === 9) {
      return parsed.questions;
    }
  } catch (error) {
    console.warn("AI question generation failed, using fallback:", error.message);
  }

  return fallback;
};

export const evaluateAnswers = async (questions, answers) => {
  const client = getClient();

  if (!client) {
    return questions.map((question, index) => {
      const answer = answers[index] || "";
      const ratio = computeCoverageRatio(answer, question.expectedPoints);
      return {
        answer,
        awardedRawScore: Number((ratio * getRawWeight(question.difficulty)).toFixed(2)),
        feedback: buildRuleBasedFeedback(question, answer, ratio)
      };
    });
  }

  try {
    const prompt = `
You are evaluating technical interview answers.
Return strict JSON with an array called "results".
Each result must contain:
- awardedRawScore
- feedback

Rules:
- Use the provided difficulty to score with a max raw weight of easy=1, medium=2, hard=3.
- Feedback should be 1-2 sentences and constructive.

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}
`;

    const response = await client.responses.create({
      model,
      input: prompt
    });

    const parsed = JSON.parse(response.output_text.trim());

    if (Array.isArray(parsed.results) && parsed.results.length === questions.length) {
      return parsed.results.map((result, index) => ({
        answer: answers[index] || "",
        awardedRawScore: Math.max(
          0,
          Math.min(getRawWeight(questions[index].difficulty), Number(result.awardedRawScore) || 0)
        ),
        feedback: result.feedback || "Feedback unavailable."
      }));
    }
  } catch (error) {
    console.warn("AI evaluation failed, using rule-based evaluation:", error.message);
  }

  return questions.map((question, index) => {
    const answer = answers[index] || "";
    const ratio = computeCoverageRatio(answer, question.expectedPoints);
    return {
      answer,
      awardedRawScore: Number((ratio * getRawWeight(question.difficulty)).toFixed(2)),
      feedback: buildRuleBasedFeedback(question, answer, ratio)
    };
  });
};
