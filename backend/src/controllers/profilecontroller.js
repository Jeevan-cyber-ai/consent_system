const User = require("../models/userModel");
const Consent = require("../models/consentModel");
const auditService = require("../services/auditservice");

exports.getProfile = async (req, res) => {
  const ownerId = req.params.id;
  const requesterId = req.user.id;

  // If requester is owner, return profile
  if (ownerId === requesterId) {
    const owner = await User.findById(ownerId).select("-password").lean();
    return res.json(owner);
  }

  // Otherwise require approved consent for profile
  const consent = await Consent.findOne({
    dataOwner: ownerId,
    requester: requesterId,
    dataType: "profile",
    status: "approved"
  });

  if (!consent) {
    return res.status(403).json({ message: "No approved consent for profile" });
  }

  const owner = await User.findById(ownerId).select("-password").lean();

  await auditService.logAction(requesterId, "PROFILE_ACCESSED", "profile", { resourceId: ownerId });

  // Return only profile-relevant fields
  const payload = {
    name: owner.name,
    email: owner.email,
    linkedin: owner.linkedin,
    bio: owner.bio,
    profileImage: owner.profileImage,
    resume: owner.resume,
    additionalDetails: owner.additionalDetails
  };

  // ensure uploaded file paths are full URLs
  const host = req.get('host');
  const protocol = req.protocol;
  if (payload.profileImage && !payload.profileImage.startsWith('http')) {
    const p = payload.profileImage.replace(/\\/g, '/');
    const clean = p.replace(/^\/+/, '');
    payload.profileImage = `${protocol}://${host}/${clean}`;
  }
  if (payload.resume && !payload.resume.startsWith('http')) {
    const r = payload.resume.replace(/\\/g, '/');
    const cleanr = r.replace(/^\/+/, '');
    payload.resume = `${protocol}://${host}/${cleanr}`;
  }

  // include academic fields if present
  if (owner.course) payload.course = owner.course;
  if (owner.collegeName) payload.collegeName = owner.collegeName;
  if (owner.description) payload.description = owner.description;
  if (owner.domain) payload.domain = owner.domain;

  res.json(payload);
};
