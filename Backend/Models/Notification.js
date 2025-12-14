import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    _id: {
        type: String, // "N11001"
        required: true,
    },
    userId: {
        type: String, // "U1001"
        required: true,
    },
    type: {
        type: String, // "reply", "vote", etc.
        required: true,
    },
    payload: {
        type: String, // message text
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    versionKey: false,
});

export default mongoose.model("notifications", NotificationSchema);