import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    _id: {
        type: String, // "Q5001"
        required: true,
    },
    threadId: {
        type: String, // "T4001"
        required: true,
    },
    courseId: {
        type: String, // "C200"
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
    tags: {
        type: [String], // ["TAG5001"]
        default: [],
    },

  attachments: [
    {
      type: String,
      ref: "attachments",
    },
  ],
    bestAnswerId: {
        type: String, // "R6001"
        default: null,
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

export default mongoose.model("questions", QuestionSchema);