import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    _id: {
        type: String, // "AL12001"
        required: true,
    },
    userId: {
        type: String, // "U1001"
        required: true,
    },
    actionType: {
        type: String, // "posted_question", "replied", etc.
        required: true,
    },
    targetId: {
        type: String, // "Q5001", "R6001", etc.
        required: true,
    },
    detail: {
        type: String,
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    versionKey: false,
});

export default mongoose.model("activity_logs", ActivityLogSchema);