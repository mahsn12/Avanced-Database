import User from "../Models/User";
import CourseEnrollment from "../Models/CourseEnrollment.js";
import Course from "../Models/Course.js";
import ThreadSubscription from "../Models/ThreadSubscription.js";
import ActivityLog from "../Models/ActivityLog.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ======================================================
   1) Register User
   Scenario: A student registers on the platform
====================================================== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow student or instructor
    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    await ActivityLog.create({
      userID: user._id,
      actionType: "REGISTER",
      detail: "User registered"
    });

    res.status(201).json({
      message: "Registered successfully",
      userID: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   2) Enroll in Course
   Scenario: Student enrolls in Database Systems course
====================================================== */
export const enrollInCourse = async (req, res) => {
  try {
    const { userID, courseID } = req.body;

    const enrollment = await CourseEnrollment.create({
      userID,
      courseID
    });

    await ActivityLog.create({
      userID,
      actionType: "ENROLL_COURSE",
      targetID: courseID,
      detail: "User enrolled in course"
    });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await ActivityLog.create({
      userID: user._id,
      actionType: "LOGIN",
      detail: "User logged in"
    });

    res.json({
      message: "Login successful",
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ======================================================
   3) View Enrolled Courses
   Scenario: Student can view course-specific threads/posts
====================================================== */
export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await CourseEnrollment
      .find({ userID: req.params.userID })
      .populate("courseID");

    res.json(enrollments.map(e => e.courseID));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   4) Follow / Subscribe to Thread
   Scenario: Students follow threads for updates
====================================================== */
export const followThread = async (req, res) => {
  try {
    const { userID, threadID } = req.body;

    const sub = await ThreadSubscription.create({
      userID,
      threadID
    });

    await ActivityLog.create({
      userID,
      actionType: "FOLLOW_THREAD",
      targetID: threadID,
      detail: "User subscribed to thread"
    });

    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ======================================================
   5) Unfollow Thread (optional but realistic)
====================================================== */
export const unfollowThread = async (req, res) => {
  try {
    const { userID, threadID } = req.body;

    await ThreadSubscription.deleteOne({ userID, threadID });

    await ActivityLog.create({
      userID,
      actionType: "UNFOLLOW_THREAD",
      targetID: threadID,
      detail: "User unsubscribed from thread"
    });

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.userID) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userID,
      {
        displayName: req.body.displayName,
        avatar: req.body.avatar
      },
      { new: true }
    );

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "UPDATE_PROFILE",
      targetID: updatedUser._id,
      detail: "User updated profile"
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


