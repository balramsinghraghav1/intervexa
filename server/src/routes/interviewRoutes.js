import { Router } from "express";
import {
  getHistory,
  startInterview,
  submitInterview
} from "../controllers/interviewController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.post("/start", startInterview);
router.post("/:id/submit", submitInterview);
router.get("/history", getHistory);

export default router;

