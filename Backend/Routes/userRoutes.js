import express from "express";

import {
  registerUser,
  loginUser,
  enrollInCourse,
  getMyCourses,
  followThread,
  unfollowThread,
  updateUserProfile
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =========================
   AUTH
========================= */

// Register (student / instructor)
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);


/* =========================
   USER ACTIONS (Protected)
========================= */

// Enroll in a course
router.post("/enroll", protect, enrollInCourse);

// Get my enrolled courses
router.get("/:userID/courses", protect, getMyCourses);

// Follow a thread
router.post("/follow-thread", protect, followThread);

// Unfollow a thread
router.post("/unfollow-thread", protect, unfollowThread);

// Update user profile
router.patch("/:userID", protect, updateUserProfile);

export default router;
