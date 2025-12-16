import Question from "../Models/Question.js";
import Thread from "../Models/Thread.js";
import ActivityLog from "../Models/ActivityLog.js";

/* ======================================================
   CREATE QUESTION (STUDENT)
   Scenario:
   - Student posts a question inside a thread
====================================================== */
export const createQuestion = async (req, res) => {
  try {
  const { _id, threadId, courseId, authorId, content, tags, attachments } = req.body;

    if (!_id || !threadId || !courseId || !authorId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // validate thread
    const thread = await Thread.findOne({ _id: threadId });
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const question = await Question.create({
      _id,
      threadId,
      courseId,
      authorId,
      content,
      tags: tags || [],
      attachments: attachments || [],
      status: "active",
    });

    // update thread activity
    thread.lastActivityAt = new Date();
    await thread.save();

    // activity log (FIXED FIELD NAMES)
    await ActivityLog.create({
      _id: `AL-${Date.now()}`,
      userID: authorId,
      actionType: "posted_question",
      targetID: _id,
      detail: "Student asked a question",
    });

    res.status(201).json(question);
  } catch (err) {
    console.error("CREATE QUESTION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET QUESTIONS BY THREAD (STUDENT VIEW)
====================================================== */
export const getQuestionsByThread = async (req, res) => {
  try {
    const { threadId } = req.params;

    const questions = await Question.find({
      threadId,
      status: "active",
    })
      .populate("attachments") 
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET QUESTIONS BY COURSE (INSTRUCTOR VIEW)
====================================================== */
export const getQuestionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const questions = await Question.find({
      courseId,
      status: "active",
    })
      .populate("attachments")
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
