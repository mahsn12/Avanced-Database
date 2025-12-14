import Thread from "../models/Thread.js";
import CourseEnrollment from "../Models/CourseEnrollment.js";
import Notification from "../Models/Notification.js";
import ActivityLog from "../Models/ActivityLog.js";
import User from "../Models/User.js";

/* ======================================================
   1) Create Thread (Instructor only)
   Scenario:
   - Instructor creates thread under course
   - Enrolled users get notified
====================================================== */
export const createThread = async (req, res) => {
  try {
    const { courseID, title, tags, creatorID } = req.body;
    const user = User.find(req.user.id);
    // Create thread
    if(!user.role == "instructor"||!user.role == "admin"){
        return res.status(403).json({ message: "Unauthorized" });
    }
    const thread = await Thread.create({
      courseID,
      title,
      creatorID,
      tags,
      lastActivityAt: new Date()
    });
   
    // Get enrolled users
    const enrollments = await CourseEnrollment.find({ courseID });

    // Notify all enrolled users
    const notifications = enrollments.map(e => ({
      userID: e.userID,
      type: "NEW_THREAD",
      payload: {
        threadID: thread._id,
        title: thread.title
      }
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Log activity
    await ActivityLog.create({
      userID: creatorID,
      actionType: "CREATE_THREAD",
      targetID: thread._id,
      detail: "Instructor created a thread"
    });

    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ======================================================
   2) Get Threads by Course
   Scenario:
   - Students view course-specific threads
====================================================== */
export const getThreadsByCourse = async (req, res) => {
  try {
    const threads = await Thread.find({
      courseID: req.params.courseID,
      status: "active"
    }).sort({ pinned: -1, lastActivityAt: -1 });

    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   3) Get Single Thread
====================================================== */
export const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadID);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   4) Pin / Unpin Thread (Instructor / Admin)
====================================================== */
export const togglePinThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadID);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    thread.pinned = !thread.pinned;
    await thread.save();

    await ActivityLog.create({
      userID: req.body.userID,
      actionType: "PIN_THREAD",
      targetID: thread._id,
      detail: `Thread ${thread.pinned ? "pinned" : "unpinned"}`
    });

    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadID);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    if (
      req.user.id !== String(thread.creatorID) &&
      !["admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    thread.title = req.body.title ?? thread.title;
    thread.tags = req.body.tags ?? thread.tags;
    await thread.save();

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "UPDATE_THREAD",
      targetID: thread._id,
      detail: "Thread updated"
    });

    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadID);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    if (
      req.user.id !== String(thread.creatorID) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    thread.status = "removed";
    await thread.save();

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "DELETE_THREAD",
      targetID: thread._id,
      detail: "Thread removed"
    });

    res.json({ message: "Thread removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
