import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
    _id: {
        type: String, // "R6001"
        required: true,
    },
    questionId: {
        type: String, // "Q5001"
        required: true,
    },
    threadId: {
        type: String, // "T4001"
        required: true,
    },
    authorId: {
        type: String, // "U1003"
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    isBest: {
        type: Boolean,
        default: false,
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

export default mongoose.model("replies", ReplySchema);