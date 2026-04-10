import { Router } from "express";
import multer from "multer";
import {
  getHistory,
  startInterview,
  submitAnswer
} from "../controllers/interviewController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);
router.post("/start", startInterview);
router.post("/:id/answer", upload.single("audio"), submitAnswer);
router.get("/history", getHistory);

export default router;
