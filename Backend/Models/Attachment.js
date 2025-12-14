import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema({
    _id: {
        type: String, // "A9001"
        required: true,
    },
    ownerId: {
        type: String, // "U1003"
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    mime: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    versionKey: false,
});

export default mongoose.model("attachments", AttachmentSchema);