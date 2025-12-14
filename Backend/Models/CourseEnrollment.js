import mongoose from "mongoose";

const CourseEnrollmentSchema = new mongoose.Schema({
    _id: {
        type: String, // "E3001"
        required: true,
    },
    userId: {
        type: String, // "U1001"
        required: true,
    },
    courseId: {
        type: String, // "C200"
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    enrolledAt: {
        type: Date,
        required: true,
    },
}, {
    versionKey: false,
});

export default mongoose.model("course_enrollments", CourseEnrollmentSchema);