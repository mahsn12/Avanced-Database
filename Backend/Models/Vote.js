import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
    _id: {
        type: String, // "V10001"
        required: true,
    },
    userId: {
        type: String, // "U1002"
        required: true,
    },
    targetId: {
        type: String, // "R6001" or "Qxxxx"
        required: true,
    },
    targetType: {
        type: String,
        enum: ["question", "reply"],
        required: true,
    },
    voteType: {
        type: String,
        enum: ["upvote", "downvote"],
        required: true,
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    versionKey: false,
});

// Prevent duplicate voting
VoteSchema.index({ userId: 1, targetId: 1 }, { unique: true });

export default mongoose.model("votes", VoteSchema);