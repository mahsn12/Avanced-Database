import Reply from "../Models/Reply.js";
import Question from "../Models/Question.js";
import ActivityLog from "../Models/ActivityLog.js";

/* ======================================================
   CREATE REPLY
====================================================== */
export const createReply = async (req, res) => {
  try {
    const { _id, questionId, authorId, content } = req.body;

    if (!_id || !questionId || !authorId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const question = await Question.findOne({ _id: questionId });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const reply = await Reply.create({
      _id,
      questionId,
      threadId: question.threadId,
      authorId,
      content,
      upvotes: 0,
      isBest: false,
      status: "active",
    });

    await ActivityLog.create({
      _id: `AL-${Date.now()}`,
      userID: authorId,
      actionType: "posted_reply",
      targetID: reply._id,
      detail: "User replied to question",
    });

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET REPLIES BY QUESTION
====================================================== */
export const getRepliesByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const replies = await Reply.find({
      questionId,
      status: "active",
    }).sort({ isBest: -1, createdAt: 1 });

    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   TOGGLE BEST ANSWER (INSTRUCTOR)
   Rules:
   - Only 1 best answer per question
   - Clicking same reply removes best
   - Clicking another reply switches best
====================================================== */
export const toggleBestReply = async (req, res) => {
  try {
    const { replyId, questionId } = req.body;

    if (!replyId || !questionId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const reply = await Reply.findOne({ _id: replyId });
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // 🔹 Check if this reply is already best
    if (reply.isBest) {
      // REMOVE best answer
      reply.isBest = false;
      await reply.save();

      await Question.updateOne(
        { _id: questionId },
        { $set: { bestAnswerId: null } }
      );

      return res.status(200).json({
        message: "Best answer removed",
        bestAnswerId: null,
      });
    }

    // 🔹 Otherwise: switch best answer
    await Reply.updateMany(
      { questionId },
      { $set: { isBest: false } }
    );

    await Reply.updateOne(
      { _id: replyId },
      { $set: { isBest: true } }
    );

    await Question.updateOne(
      { _id: questionId },
      { $set: { bestAnswerId: replyId } }
    );

    res.status(200).json({
      message: "Best answer updated",
      bestAnswerId: replyId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
