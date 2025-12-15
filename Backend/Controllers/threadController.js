import Thread from "../Models/Thread.js";
import ActivityLog from "../Models/ActivityLog.js";

/* ======================================================
   CREATE THREAD
====================================================== */
export const createThread = async (req, res) => {
  try {
    const { _id, courseId, title, tags } = req.body;
    const creatorId = req.user?._id || req.body.creatorId;

    if (!_id || !courseId || !title || !creatorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const thread = await Thread.create({
      _id,
      courseId,
      title,
      creatorId,
      tags: tags || [],
      pinned: false,
      lastActivityAt: new Date(),
      status: "active",
    });

    await ActivityLog.create({
      _id: `AL-${Date.now()}`,
      userID: creatorId,   // NOW GUARANTEED
      actionType: "create_thread",
      targetID: _id,
      detail: "Thread created",
    });

    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ======================================================
   GET THREADS BY COURSE
====================================================== */
export const getThreadsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const threads = await Thread.find({
      courseId,
      status: "active",
    }).sort({ pinned: -1, lastActivityAt: -1 });

    res.status(200).json(threads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET SINGLE THREAD
====================================================== */
export const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findOne({ _id: req.params.threadId });
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.status(200).json(thread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   PIN / UNPIN THREAD
====================================================== */
export const togglePinThread = async (req, res) => {
  try {
    const thread = await Thread.findOne({ _id: req.params.threadId });
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    thread.pinned = !thread.pinned;
    await thread.save();

    await ActivityLog.create({
      _id: `AL-${Date.now()}`,
      userID: req.body.userId,
      actionType: "pin_thread",
      targetID: thread._id,
      detail: thread.pinned ? "Thread pinned" : "Thread unpinned",
    });

    res.status(200).json(thread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   DELETE THREAD (soft delete)
====================================================== */
export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findOne({ _id: req.params.threadId });
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    thread.status = "inactive";
    await thread.save();

    await ActivityLog.create({
      _id: `AL-${Date.now()}`,
      userID: req.body.userId,
      actionType: "delete_thread",
      targetID: thread._id,
      detail: "Thread marked inactive",
    });

    res.status(200).json({ message: "Thread deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
