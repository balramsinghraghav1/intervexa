const difficultyWeights = {
  easy: 1,
  medium: 2,
  hard: 3
};

export const getRawWeight = (difficulty) => difficultyWeights[difficulty] ?? 1;

export const normalizeScore = (earnedRaw, maxRaw) => {
  if (!maxRaw) {
    return 0;
  }

  return Math.round((earnedRaw / maxRaw) * 20);
};

export const computeCoverageRatio = (answer, expectedPoints) => {
  const normalizedAnswer = (answer || "").toLowerCase();

  if (!expectedPoints?.length) {
    return normalizedAnswer.length > 30 ? 0.7 : 0.3;
  }

  const hits = expectedPoints.filter((point) => {
    const words = point.toLowerCase().split(/\W+/).filter(Boolean);
    return words.some((word) => word.length > 3 && normalizedAnswer.includes(word));
  }).length;

  const ratio = hits / expectedPoints.length;

  if (normalizedAnswer.length > 180) {
    return Math.min(1, ratio + 0.15);
  }

  return ratio;
};

export const buildRuleBasedFeedback = (question, answer, ratio) => {
  if (!answer?.trim()) {
    return "No answer was submitted. Try explaining the concept in simple technical language and include at least one example or key point.";
  }

  if (ratio >= 0.8) {
    return `Strong answer. You covered most of the expected ideas for this ${question.difficulty} question and your explanation shows good interview readiness.`;
  }

  if (ratio >= 0.45) {
    return `Decent answer, but it needs more precision. Add missing ideas such as: ${question.expectedPoints.slice(0, 2).join(", ")}.`;
  }

  return `This answer is too shallow for interview standards. Focus on the core ideas: ${question.expectedPoints.slice(0, 3).join(", ")}.`;
};

