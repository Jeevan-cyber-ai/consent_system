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
    expiryDate: { $gt: new Date() }
  });

  if (!consent) {
    return res.status(403).json({
      message: "Consent not available or expired"
    });
  }

  next();
};
