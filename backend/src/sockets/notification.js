const { getIO } = require("../utils/socket");

const sendNotification = (userId, data) => {
  const io = getIO();

  // include userId and resourceId in the payload so clients can filter/associate
  io.to(userId).emit("notification", {
    user: userId,
    title: data.title,
    message: data.message,
    type: data.type,
    resourceId: data.resourceId || null,
    time: new Date()
  });
};

const sendData = (userId, data) => {
  const io = getIO();
  io.to(userId).emit("data-delivery", data);
};


module.exports = { sendNotification, sendData };
