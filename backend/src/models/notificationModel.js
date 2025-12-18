const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  title: { type: String },

  message: { type: String },

  type: { type: String },

  read: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

// added: optional link to a related resource (e.g. consent request id)
notificationSchema.add({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Consent", required: false }
});


module.exports = mongoose.model("Notification", notificationSchema);
