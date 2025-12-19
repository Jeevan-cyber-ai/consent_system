const Consent = require("../models/consentModel");
const User = require("../models/userModel");
const DataRecord = require("../models/dataRecordModel"); // Added for sourcing live data
const auditService = require("./auditservice");
const notificationService = require("./notificationservice");

// 1. REQUEST CONSENT
const requestConsent = async (data) => {
  const consent = await Consent.create({
    ...data,
    status: "pending"
  });

  try {
    await auditService.logAction(data.requester, "CONSENT_REQUESTED", data.dataType, {
      resourceId: consent._id
    });
    
    const requesterUser = await User.findById(data.requester).select("name");
    await notificationService.createNotification(data.dataOwner, {
      user: data.dataOwner,
      title: "New Data Request",
      message: `${requesterUser ? requesterUser.name : 'A user'} requested access to ${data.dataType}`,
      type: "CONSENT",
      resourceId: consent._id
    });
  } catch (e) {
    console.error("Non-blocking error in requestConsent logs:", e.message);
  }

  return consent;
};

// 2. APPROVE CONSENT (With Live Data Sourcing)
const approveConsent = async (id, ownerId) => {
  const consent = await Consent.findById(id);
  if (!consent) throw new Error("Consent not found");
  
  if (String(consent.dataOwner) !== String(ownerId)) {
    const err = new Error("Not authorized");
    err.status = 403;
    throw err;
  }

  consent.status = "approved";
  // Grant access for 7 days by default
  consent.expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
  await consent.save();

  // DUAL AUDIT LOGS
  await auditService.logAction(ownerId, "CONSENT_APPROVED_BY_ME", consent.dataType, {
    resourceId: consent._id,
    details: { requester: consent.requester }
  });

  await auditService.logAction(consent.requester, "CONSENT_GRANTED_TO_ME", consent.dataType, {
    resourceId: consent._id,
    details: { approvedBy: ownerId }
  });

  const owner = await User.findById(ownerId).lean();

  // SOURCE LIVE DATA FROM DATA RECORDS
  // This is the bridge that makes Location/Camera "work" immediately upon approval
  const latestDataRecord = await DataRecord.findOne({ 
    owner: ownerId, 
    dataType: consent.dataType 
  }).sort({ createdAt: -1 });

  // NOTIFICATIONS & SOCKETS
  try {
    const { sendNotification, sendData } = require("../sockets/notification");
    
    sendNotification(consent.requester.toString(), {
      title: "Consent Approved",
      message: `${owner.name} granted you access to ${consent.dataType}`,
      type: "CONSENT",
      resourceId: consent._id
    });

    // Prepare payload for immediate delivery
    let payload = null;
    if (consent.dataType === "profile") {
      payload = { name: owner.name, email: owner.email, bio: owner.bio, profileImage: owner.profileImage };
    } else if (latestDataRecord) {
      // Pull the actual coordinates or state from the DataRecord collection
      payload = latestDataRecord.data; 
    }

    sendData(consent.requester.toString(), { 
      consentId: consent._id, 
      dataType: consent.dataType, 
      data: payload,
      ownerId: ownerId
    });
  } catch (e) {
    console.error("Socket notification error:", e.message);
  }

  return consent;
};

// 3. REJECT CONSENT
const rejectConsent = async (id, ownerId) => {
  const consent = await Consent.findById(id);
  if (!consent) throw new Error("Consent not found");
  if (String(consent.dataOwner) !== String(ownerId)) throw new Error("Unauthorized");

  consent.status = "rejected";
  await consent.save();

  await auditService.logAction(ownerId, "CONSENT_REJECTED", consent.dataType, { resourceId: consent._id });
  return consent;
};

// 4. REVOKE CONSENT
const revokeConsent = async (id, ownerId) => {
  const consent = await Consent.findById(id);
  if (!consent) throw new Error("Consent not found");
  if (String(consent.dataOwner) !== String(ownerId)) throw new Error("Unauthorized");

  consent.status = "revoked";
  await consent.save();

  await auditService.logAction(ownerId, "CONSENT_REVOKED", consent.dataType, { resourceId: consent._id });
  return consent;
};

// Helper Fetchers
const getRequestsToMe = (userId) => Consent.find({ dataOwner: userId, status: "pending" }).populate("requester", "name email");
const getMyRequests = (userId) => Consent.find({ requester: userId }).populate("dataOwner", "name email");
const getMyApprovedConsents = (userId) => Consent.find({ dataOwner: userId, status: "approved" }).populate("requester", "name email");

module.exports = {
  requestConsent,
  approveConsent,
  rejectConsent,
  revokeConsent,
  getRequestsToMe,
  getMyRequests,
  getMyApprovedConsents
};