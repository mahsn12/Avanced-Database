import mongoose from "mongoose";

const ThreadSubscriptionSchema = new mongoose.Schema({
    _id: {
        type: String, // "TS13001"
        required: true,
    },
    userId: {
        type: String, // "U1001"
        required: true,
    },
    threadId: {
        type: String, // "T4001"
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

// Prevent duplicate subscriptions
ThreadSubscriptionSchema.index({ userId: 1, threadId: 1 }, { unique: true });

export default mongoose.model("thread_subscriptions", ThreadSubscriptionSchema);