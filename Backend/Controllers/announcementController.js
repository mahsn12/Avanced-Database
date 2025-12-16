import Notification from "../Models/Notification.js";
import Course from "../Models/Course.js";
import User from "../Models/User.js";

/* ======================================================
   POST ANNOUNCEMENT
====================================================== */
export const postAnnouncement = async(req, res) => {
    try {
        const { courseId, message } = req.body;

        if (!courseId || !message) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // get course
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // get students in same institution (simple & valid for Phase 1)
        const students = await User.find({
            role: "student",
            status: "active",
        });

        // create notification for each student
        const notifications = students.map(s => ({
            _id: `N-${Date.now()}-${s._id}`,
            userId: s._id,
            type: "announcement",
            payload: `[${course.title}] ${message}`,
        }));

        await Notification.insertMany(notifications);

        res.status(201).json({ message: "Announcement sent" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};