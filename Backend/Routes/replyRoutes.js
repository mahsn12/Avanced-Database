import express from "express";
import {
  createReply,
  getRepliesByQuestion,
  toggleBestReply,
} from "../Controllers/ReplyController.js";

const router = express.Router();

router.post("/", createReply);
router.get("/question/:questionId", getRepliesByQuestion);
router.patch("/best", toggleBestReply);

export default router;
