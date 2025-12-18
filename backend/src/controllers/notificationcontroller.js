const Notification = require("../models/notificationModel");

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user.id
  }).sort({ createdAt: -1 });

  res.json(notifications);
};


exports.markAsRead = async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) return res.status(404).json({ message: 'Not found' });
  if (String(notif.user) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  notif.read = true;
  await notif.save();
  res.json({ message: 'Notification marked as read' });
};
