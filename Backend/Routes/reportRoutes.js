import express from "express";
import {
    createReport,
    getReportedReplies,
    resolveReport, // ✅ ADD
} from "../Controllers/report.js";

import Report from "../Models/Report.js";

const router = express.Router();

/* =========================
   ADMIN ROUTES
========================= */

// ✅ GET ALL REPORTS (Admin dashboard)
router.get("/", async(req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ RESOLVE REPORT (ADMIN)
router.patch("/:reportId/resolve", resolveReport);

/* =========================
   EXISTING ROUTES (UNCHANGED)
========================= */

// Create report (student)
router.post("/", createReport);

// Used by instructor moderation
router.get("/replies", getReportedReplies);

export default router;