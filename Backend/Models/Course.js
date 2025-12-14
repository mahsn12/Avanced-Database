import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    _id: {
        type: String, // "C200"
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    description: String,
    instructorIds: {
        type: [String], // ["U1003"]
        required: true,
    },
    term: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    versionKey: false,
});

export default mongoose.model("courses", CourseSchema);