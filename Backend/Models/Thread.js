import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    _id: {
        type: String, // "T4001"
        required: true,
    },
    courseId: {
        type: String, // "C200"
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    creatorId: {
        type: String, // "U1003"
        required: true,
    },
    tags: {
        type: [String], // ["TAG5001", "TAG5002"]
        default: [],
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    lastActivityAt: {
        type: Date,
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

export default mongoose.model("threads", ThreadSchema);