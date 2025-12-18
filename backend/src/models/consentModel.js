const mongoose = require("mongoose");

const consentSchema = new mongoose.Schema({
  dataOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  dataType: {
    type: String,
    enum: ["location", "camera", "profile", "document"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "revoked", "rejected", "expired"],
    default: "pending"
  },

  expiryDate: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Consent", consentSchema);
