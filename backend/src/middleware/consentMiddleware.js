const Consent = require("../models/consentModel");

module.exports = async (req, res, next) => {
  const requesterId = req.user.id;
  const ownerId = req.params.ownerId;
  const dataType = req.params.type;

  const consent = await Consent.findOne({
    dataOwner: ownerId,
    requester: requesterId,
    dataType,
    status: "approved",
    // Fix: Allow access if expiryDate doesn't exist OR is in the future
    $or: [
      { expiryDate: { $gt: new Date() } },
      { expiryDate: { $exists: false } },
      { expiryDate: null }
    ]
  });

  if (!consent) {
    return res.status(403).json({
      message: "Consent not available, expired, or not yet approved"
    });
  }

  next();
};