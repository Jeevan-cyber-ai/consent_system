const User = require("../models/userModel");
const Consent = require("../models/consentModel");
const auditService = require("../services/auditservice");
const mongoose = require("mongoose"); // Added for validation

exports.getProfile = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const requesterId = req.user.id;

    // 1. Validate ID format to prevent CastError
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // 2. Logic for owner vs requester
    let owner;
    if (ownerId === requesterId) {
      owner = await User.findById(ownerId).select("-password").lean();
    } else {
      const consent = await Consent.findOne({
        dataOwner: ownerId,
        requester: requesterId,
        dataType: "profile",
        status: "approved"
      });

      if (!consent) {
        return res.status(403).json({ message: "No approved consent for profile" });
      }
      owner = await User.findById(ownerId).select("-password").lean();
      await auditService.logAction(requesterId, "PROFILE_ACCESSED", "profile", { resourceId: ownerId });
    }

    if (!owner) return res.status(404).json({ message: "User not found" });

    const host = req.get('host');
const protocol = req.protocol;

const formatUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  // Convert Windows backslashes (\) to web forward slashes (/)
  const cleanPath = path.replace(/\\/g, '/'); 
  
  // Return full URL: http://localhost:5000/uploads/filename.jpg
  return `${protocol}://${host}/${cleanPath}`;
};
    // 4. Build Payload
    const payload = {
      name: owner.name,
      email: owner.email,
      linkedin: owner.linkedin,
      bio: owner.bio,
      profileImage: formatUrl(owner.profileImage),
      resume: formatUrl(owner.resume),
      additionalDetails: owner.additionalDetails,
      course: owner.course,
      dept: owner.dept,
      collegeName: owner.collegeName,
      description: owner.description,
      domain: owner.domain
    };

    res.json(payload);
  } catch (error) {
    console.error("Profile access error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};