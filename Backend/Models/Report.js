import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    _id: {
        type: String, // "RP14001"
        required: true,
    },
    reporterId: {
        type: String, // "U1002"
        required: true,
    },
    targetId: {
        type: String, // "R6001", "Qxxxx", "Pxxxx"
        required: true,
    },
    targetType: {
        type: String,
        enum: ["post", "reply", "question"],
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending",
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    versionKey: false,
});

export default mongoose.model("reports", ReportSchema);