const Consent = require("../models/consentModel");

module.exports = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const ownerId = req.params.ownerId;
    const requestedType = req.params.type; // This MUST match the :type in your route

    if (!requestedType) {
      return res.status(400).json({ message: "Data type parameter missing" });
    }

    const consent = await Consent.findOne({
      dataOwner: ownerId,
      requester: requesterId,
      dataType: requestedType, 
      status: "approved",
      $or: [
        { expiryDate: { $gt: new Date() } },
        { expiryDate: { $exists: false } }
      ]
    });

    if (!consent) {
      // This triggers the 403 Forbidden you saw
      return res.status(403).json({
        message: `Access Denied: No approved '${requestedType}' permission.`
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Auth Error" });
  }
};