import Question from "../models/Question.js";
import Thread from "../models/Thread.js";
import ActivityLog from "../Models/ActivityLog.js";

/* ======================================================
   1) Create Question (Student)
   Scenario:
   - Student posts a question inside a thread
   - Question linked to thread & course
====================================================== */
export const createQuestion = async (req, res) => {
  try {
    // Auth check
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can ask questions" });
    }

    const { threadID, content, tags } = req.body;

    // Validate thread
    const thread = await Thread.findById(threadID);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const question = await Question.create({
      threadID,
      courseID: thread.courseID,
      authorID: req.user.id,
      content,
      tags
    });

    // Update thread activity
    thread.lastActivityAt = new Date();
    await thread.save();

    // Log activity
    await ActivityLog.create({
      userID: req.user.id,
      actionType: "CREATE_QUESTION",
      targetID: question._id,
      detail: "Student asked a question"
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ======================================================
   2) Get Questions by Thread
   Scenario:
   - View questions inside a thread
====================================================== */
export const getQuestionsByThread = async (req, res) => {
  try {
    const questions = await Question.find({
      threadID: req.params.threadID,
      status: "open"
    }).sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   3) Get Single Question
====================================================== */
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionID);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionID);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (req.user.id !== String(question.authorID)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    question.content = req.body.content ?? question.content;
    question.tags = req.body.tags ?? question.tags;
    await question.save();

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "UPDATE_QUESTION",
      targetID: question._id,
      detail: "Question updated"
    });

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionID);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (
      req.user.id !== String(question.authorID) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    question.status = "removed";
    await question.save();

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "DELETE_QUESTION",
      targetID: question._id,
      detail: "Question removed"
    });

    res.json({ message: "Question removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
