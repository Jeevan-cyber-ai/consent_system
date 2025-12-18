const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  action: { type: String },

  resource: { type: String },

  resourceId: { type: mongoose.Schema.Types.ObjectId },

  details: { type: mongoose.Schema.Types.Mixed },

  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
