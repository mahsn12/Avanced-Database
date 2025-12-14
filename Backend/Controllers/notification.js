import Notification from "../Models/Notification.js";
import ActivityLog from "../Models/ActivityLog.js";

/* ======================================================
   1) Get My Notifications
   Scenario:
   - User views notifications
====================================================== */
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userID: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   2) Mark Notification as Read
   Scenario:
   - User opens notification
====================================================== */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationID);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (String(notification.userID) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    notification.read = true;
    await notification.save();

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "READ_NOTIFICATION",
      targetID: notification._id,
      detail: "Notification marked as read"
    });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   3) Delete Notification
   Scenario:
   - User clears notification
====================================================== */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationID);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (String(notification.userID) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await notification.deleteOne();

    await ActivityLog.create({
      userID: req.user.id,
      actionType: "DELETE_NOTIFICATION",
      targetID: req.params.notificationID,
      detail: "Notification deleted"
    });

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   4) Get Unread Count (optional but useful)
====================================================== */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userID: req.user.id,
      read: false
    });

    res.json({ unread: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
