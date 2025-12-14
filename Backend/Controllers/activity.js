import ActivityLog from "../Models/ActivityLog.js";

/* ======================================================
   CREATE Activity Log
   (Normally auto-created, but CRUD requires endpoint)
====================================================== */
export const createActivity = async (req, res) => {
  try {
    const activity = await ActivityLog.create({
      userID: req.body.userID,
      actionType: req.body.actionType,
      targetID: req.body.targetID,
      detail: req.body.detail
    });

    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ======================================================
   READ all Activity Logs (Admin / Analytics)
====================================================== */
export const getAllActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   READ Activity Logs by User
====================================================== */
export const getActivitiesByUser = async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      userID: req.params.userID
    }).sort({ timestamp: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   UPDATE Activity Log
   (Admin correction only)
====================================================== */
export const updateActivity = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.activityID);
    if (!log) {
      return res.status(404).json({ message: "Activity not found" });
    }

    log.detail = req.body.detail ?? log.detail;
    log.actionType = req.body.actionType ?? log.actionType;
    await log.save();

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   DELETE Activity Log
   (Admin only – HARD delete allowed)
====================================================== */
export const deleteActivity = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.activityID);
    if (!log) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await log.deleteOne();
    res.json({ message: "Activity log deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await ActivityLog.aggregate([
      {
        $match: {
          actionType: { $in: ["CREATE_REPLY", "UPVOTE_REPLY"] }
        }
      },
      {
        $group: {
          _id: "$userID",
          score: { $sum: 1 }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};