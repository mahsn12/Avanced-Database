import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: {
        type: String, // "U1001"
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        required: true,
    },
    institutionId: {
        type: String, // "I100"
        required: true,
    },
    displayName: String,
    avatarUrl: String,
    passwordHash: String,
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

export default mongoose.model("users", UserSchema);