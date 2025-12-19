const AuditLog = require("../models/auditLogModel");

exports.getLogs = async (req, res) => {
  const logs = await AuditLog.find().populate("user", "name email");
  res.json(logs);
};
exports.getMyLogs = async (req, res) => {
  const userId = req.user.id;
  // This will now find both "CONSENT_REQUESTED" and "CONSENT_GRANTED_TO_ME"
  const logs = await AuditLog.find({ user: userId }).sort({ timestamp: -1 });
  res.json(logs);
};