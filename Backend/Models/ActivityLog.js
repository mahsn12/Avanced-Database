import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    _id: {
        type: String, // "AL12001"
        required: true,
    },
    userID: {
        type: String, // "U1001"
        required: true,
    },
    actionType: {
        type: String,
        required: true,
    },
    targetID: {
        type: String, // "C200", "Q5001", etc.
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

export default mongoose.models.activity_logs ||
  mongoose.model("activity_logs", ActivityLogSchema);
