const Consent = require("../models/consentModel");
const User = require("../models/userModel");
const auditService = require("./auditservice");
const notificationService = require("./notificationservice");

// Create a request (pending) and notify the owner
const requestConsent = async (data) => {
  const consent = await Consent.create({
    ...data,
    status: "pending"
  });

  // Audit log for requester
  try {
    await auditService.logAction(data.requester, "CONSENT_REQUESTED", data.dataType, {
      resourceId: consent._id
    });
  } catch (e) {}

  // Notify owner
  try {
    const requesterUser = await User.findById(data.requester).select("name email");
    await notificationService.createNotification(data.dataOwner, {
      title: "New Data Request",
      message: `${requesterUser ? requesterUser.name : 'A user'} requested access to ${data.dataType}`,
      type: "CONSENT",
      resourceId: consent._id
    });
  } catch (e) {}

  return consent;
};

// Approve consent: update status, create audit log, notify requester, return data payload
const approveConsent = async (id, ownerId) => {
  const consent = await Consent.findById(id);
  if (!consent) throw new Error("Consent not found");
  // only the data owner may approve
  if (String(consent.dataOwner) !== String(ownerId)) {
    const err = new Error("Not authorized to approve this consent");
    err.status = 403;
    throw err;
  }

  consent.status = "approved";
  await consent.save();

  await auditService.logAction(ownerId, "CONSENT_APPROVED", consent.dataType, {
    resourceId: consent._id
  });

  // Notify requester
  try {
    await notificationService.createNotification(consent.requester, {
      title: "Consent Approved",
      message: `Access granted for ${consent.dataType}`,
      type: "CONSENT",
      resourceId: consent._id
    });
  } catch (e) {}

  // Provide data based on dataType
  const owner = await User.findById(consent.dataOwner).lean();

  let payload = null;
  if (consent.dataType === "profile") {
    payload = {
      name: owner.name,
      email: owner.email,
      linkedin: owner.linkedin,
      bio: owner.bio,
      profileImage: owner.profileImage,
      resume: owner.resume,
      additionalDetails: owner.additionalDetails
    };
  } else if (consent.dataType === "location") {
    payload = { location: owner.locationData };
  } else if (consent.dataType === "camera") {
    // mark camera enabled for the owner (owner must have consented)
    await User.findByIdAndUpdate(owner._id, { isCameraEnabled: true });
    payload = { cameraEnabled: true };
  } else if (consent.dataType === "document") {
    payload = { resume: owner.resume };
  }

  // Send data over socket to requester if connected
  try {
    const { sendData } = require("../sockets/notification");
    // payload may be null for camera; send consent and payload
    await sendData(consent.requester.toString(), { consentId: consent._id, dataType: consent.dataType, data: payload });
  } catch (e) {}

  return { consent, data: payload };
};

const rejectConsent = async (id, ownerId) => {
  const consent = await Consent.findById(id);
  if (!consent) throw new Error("Consent not found");

  // only the data owner may reject
  if (String(consent.dataOwner) !== String(ownerId)) {
    const err = new Error("Not authorized to reject this consent");
    err.status = 403;
    throw err;
  }

  consent.status = "rejected";
  await consent.save();

  await auditService.logAction(ownerId, "CONSENT_REJECTED", consent.dataType, {
    resourceId: consent._id
  });

  try {
    await notificationService.createNotification(consent.requester, {
      title: "Consent Rejected",
      message: `Access denied for ${consent.dataType}`,
      type: "CONSENT",
      resourceId: consent._id
    });
  } catch (e) {}

  return consent;
};

// Requests I RECEIVED (I am owner)
const getRequestsToMe = async (userId) => {
  return await Consent.find({ dataOwner: userId, status: "pending" }).populate(
    "requester",
    "name email"
  );
};

// Requests I SENT
const getMyRequests = async (userId) => {
  return await Consent.find({ requester: userId }).populate("dataOwner", "name email");
};

// Approved consents I OWN
const getMyApprovedConsents = async (userId) => {
  return await Consent.find({ dataOwner: userId, status: "approved" }).populate(
    "requester",
    "name email"
  );
};

// REVOKE: owner revokes a previously approved consent
const revokeConsent = async (id, ownerId) => {
  const consent = await Consent.findById(id);
  if (!consent) throw new Error("Consent not found");

  // only the data owner may revoke
  if (String(consent.dataOwner) !== String(ownerId)) {
    const err = new Error("Not authorized to revoke this consent");
    err.status = 403;
    throw err;
  }

  consent.status = "revoked";
  await consent.save();

  await auditService.logAction(ownerId, "CONSENT_REVOKED", consent.dataType, {
    resourceId: consent._id
  });

  try {
    await notificationService.createNotification(consent.requester, {
      title: "Consent Revoked",
      message: `Access revoked for ${consent.dataType}`,
      type: "CONSENT",
      resourceId: consent._id
    });
  } catch (e) {}

  return consent;
};

module.exports = {
  requestConsent,
  approveConsent,
  rejectConsent,
  revokeConsent,
  getRequestsToMe,
  getMyRequests,
  getMyApprovedConsents
};