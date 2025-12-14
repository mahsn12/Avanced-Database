import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    _id: {
        type: String, // "TAG5001"
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    aliases: {
        type: [String],
        default: [],
    },
    parentTagId: {
        type: String, // null or "TAGxxxx"
        default: null,
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
    versionKey: false,
});

export default mongoose.model("tags", TagSchema);