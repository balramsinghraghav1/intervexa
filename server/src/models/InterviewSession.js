import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    prompt: String,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"]
    },
    expectedPoints: [String],
    answer: {
      type: String,
      default: ""
    },
    feedback: {
      type: String,
      default: ""
    },
    awardedRawScore: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    questions: [questionSchema],
    totalScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 20
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress"
    },
    summary: {
      type: String,
      default: ""
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date
  },
  { timestamps: true }
);

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
