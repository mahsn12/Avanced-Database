import Report from "../Models/Report.js";

/* =========================
   CREATE REPORT
========================= */
export const createReport = async(req, res) => {
    try {
        const report = await Report.create({
            _id: `RP-${Date.now()}`,
            reporterId: req.body.reporterId,
            targetId: req.body.targetId,
            targetType: req.body.targetType,
            reason: req.body.reason,
            status: "pending",
        });

        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* =========================
   GET REPORTED REPLIES
========================= */
export const getReportedReplies = async(req, res) => {
    try {
        const reports = await Report.find({ targetType: "reply" });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* =========================
   RESOLVE REPORT (ADMIN)
========================= */
export const resolveReport = async(req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.reportId, { status: "resolved" }, { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};