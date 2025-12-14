import Report from "../Models/Report.js";
import ActivityLog from "../Models/ActivityLog.js";

/* ======================================================
   1) Create Report
   Scenario:
   - User reports inappropriate content
====================================================== */
export const createReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { targetID, targetType, reason } = req.body;

    const report = await Report.create({
      reporterID: req.user.id,
      targetID,
      targetType,
      reason
    });

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "CREATE_REPORT",
      targetID: report._id,
      detail: "User reported content"
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
