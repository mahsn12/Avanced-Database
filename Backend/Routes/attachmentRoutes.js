import express from "express";
import multer from "multer";
import Attachment from "../Models/Attachment.js";
import fs from "fs";
import path from "path";

const router = express.Router();

/* ======================================================
   MULTER CONFIG (INLINE – NOT MIDDLEWARE FILE)
====================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, "uploads/images");
    } else {
      cb(null, "uploads/pdfs");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only images and PDFs allowed"));
    }
    cb(null, true);
  },
});

/* ======================================================
   UPLOAD ATTACHMENT
   POST /api/attachments/upload
====================================================== */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const attachment = await Attachment.create({
      _id: `A-${Date.now()}`,
      ownerId: req.body.ownerId,
      filename: req.file.originalname,
      url: `/uploads/${
        req.file.mimetype.startsWith("image") ? "images" : "pdfs"
      }/${req.file.filename}`,
      mime: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json(attachment);
  } catch (err) {
    console.error("UPLOAD ATTACHMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ======================================================
   GET ATTACHMENT BY ID
   GET /api/attachments/:id
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }
    res.json(attachment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================================================
   DELETE ATTACHMENT
   DELETE /api/attachments/:id
====================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const filePath = path.join(process.cwd(), attachment.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await attachment.deleteOne();
    res.json({ message: "Attachment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
