import InterviewSession from "../models/InterviewSession.js";
import User from "../models/User.js";

export const getOverview = async (req, res) => {
  try {
    const [user, sessions] = await Promise.all([
      User.findById(req.user._id).select("-password"),
      InterviewSession.find({
        user: req.user._id,
        status: "completed"
      }).sort({ completedAt: 1 })
    ]);

    const totalSessions = sessions.length;
    const averageScore = totalSessions
      ? Math.round(sessions.reduce((sum, session) => sum + session.totalScore, 0) / totalSessions)
      : 0;
    const latestScore = totalSessions ? sessions[totalSessions - 1].totalScore : 0;

    const subjectBreakdown = ["DSA", "OS", "CN", "DBMS"].map((subject) => {
      const filtered = sessions.filter((session) => session.subject === subject);
      const avg = filtered.length
        ? Math.round(filtered.reduce((sum, session) => sum + session.totalScore, 0) / filtered.length)
        : 0;

      return {
        subject,
        sessions: filtered.length,
        averageScore: avg
      };
    });

    const activity = sessions.slice(-7).map((session) => ({
      date: new Date(session.completedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      }),
      score: session.totalScore
    }));

    return res.json({
      stats: {
        totalSessions,
        averageScore,
        latestScore,
        currentStreak: user?.streak?.current || 0,
        longestStreak: user?.streak?.longest || 0
      },
      subjectBreakdown,
      activity
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
