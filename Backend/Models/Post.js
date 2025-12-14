import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    _id: {
        type: String, // "P7001"
        required: true,
    },
    courseId: {
        type: String, // "C200"
        required: true,
    },
    userId: {
        type: String, // "U1003"
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    attachments: {
        type: [String], // ["A9001"]
        default: [],
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

export default mongoose.model("posts", PostSchema);