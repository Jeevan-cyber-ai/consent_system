const Notification = require("../models/notificationModel");
const { sendNotification } = require("../sockets/notification");

const createNotification = async (userId, data) => {
  const notification = await Notification.create({
    user: userId,
    title: data.title,
    message: data.message,
    type: data.type
  });

  // attach optional resourceId when present
  if (data.resourceId) {
    notification.resourceId = data.resourceId;
    await notification.save();
  }

  // include resourceId in socket payload so client can link actions
  sendNotification(userId, { ...data, resourceId: data.resourceId });

  return notification;
};

module.exports = { createNotification };


