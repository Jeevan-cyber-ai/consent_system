const AuditLog = require("../models/auditLogModel");

const logAction = async (user, action, resource, opts = {}) => {
  const doc = {
    user,
    action,
    resource,
    resourceId: opts.resourceId,
    details: opts.details
  };

  return await AuditLog.create(doc);
};

module.exports = { logAction };
