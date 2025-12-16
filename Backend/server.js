import express from "express";
import cors from "cors";
import Database from "./Config/db.js";

/* AUTH & CORE */
import authRoutes from "./Routes/authRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import courseRouter from "./Routes/courseRoutes.js";
import threadRoutes from "./Routes/threadRoutes.js";
import questionRoutes from "./Routes/questionRoutes.js";
import replyRoutes from "./Routes/replyRoutes.js";
import voteRoutes from "./Routes/voteRoutes.js";
import enrollmentRoutes from "./Routes/enrollmentRoutes.js";
import threadSubscriptionRoutes from "./Routes/threadSubscriptionRoutes.js";
import announcementRoutes from "./Routes/announcementRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js";
import attachmentRoutes from "./Routes/attachmentRoutes.js";



/* ADMIN */
import adminRoutes from "./Routes/adminRoutes.js";
import adminCourseRoutes from "./Routes/adminCourseRoutes.js";

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5174"],
        credentials: true,
    })
);

// BODY PARSER
app.use(express.json({ limit: "10mb" }));

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/threads", threadRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/thread-subscriptions", threadSubscriptionRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

/* ADMIN ROUTES */
app.use("/api/admin", adminRoutes);
app.use("/api/admin/courses", adminCourseRoutes);


app.use("/api/attachments", attachmentRoutes);
app.use("/uploads", express.static("uploads"));

/* ======================
   START SERVER
====================== */
try {
    await Database();
    console.log("✅ MongoDB connected successfully");

    if (process.env.VERCEL !== "1") {
        app.listen(5200, () => {
            console.log("✅ Server running on http://localhost:5200");
        });
    }

} catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
}
export default app;