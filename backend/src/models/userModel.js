const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "requester", "admin"], default: "owner" },

  // Profile Fields
  profileImage: { type: String }, // URL/Path to image
  resume: { type: String },       // URL/Path to PDF
  linkedin: { type: String },
  bio: { type: String },
  // Academic / Organization fields
  domain: { type: String },
  collegeName: { type: String },
  course: { type: String },
  description: { type: String },
  additionalDetails: { type: mongoose.Schema.Types.Mixed },

  // Data points that can be requested
  locationData: { type: String },
  isCameraEnabled: { type: Boolean, default: false }, // Status for camera access

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);