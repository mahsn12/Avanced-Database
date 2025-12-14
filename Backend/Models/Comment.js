import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    _id: {
        type: String, // "CM8001"
        required: true,
    },
    postId: {
        type: String, // "P7001"
        required: true,
    },
    authorId: {
        type: String, // "U1001"
        required: true,
    },
    content: {
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

export default mongoose.model("comments", CommentSchema);