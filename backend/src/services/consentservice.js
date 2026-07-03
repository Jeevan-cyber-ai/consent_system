const Consent = require("../models/consentModel");
const User = require("../models/userModel");
const DataRecord = require("../models/dataRecordModel");
const auditService = require("./auditservice");
const notificationService = require("./notificationservice");

// 1. REQUEST CONSENT (Remains similar)
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

const approveConsent = async (id, ownerId, expiryHours) => {
  const consent = await Consent.findById(id);
  if (!consent) throw new Error("Consent not found");
  
  if (String(consent.dataOwner) !== String(ownerId)) {
    const err = new Error("Not authorized");
    err.status = 403;
    throw err;
  }

  const hours = parseInt(expiryHours) || 24;
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + hours);

  consent.status = "approved";
  consent.expiryDate = expiryDate; 
  await consent.save();

  const owner = await User.findById(ownerId).lean();
  let payload = null;

  // --- STRICT DATA SEGREGATION LOGIC ---
  if (consent.dataType === "profile") {
    // Only send identity info, no location
    payload = { 
      name: owner.name, 
      email: owner.email, 
      bio: owner.bio,
      collegeName: owner.collegeName,
      course: owner.course,
      dataType: "profile" 
    };
  } else if (consent.dataType === "location") {
    // Fetch only coordinates from DataRecord
    const latestLoc = await DataRecord.findOne({ owner: ownerId, dataType: "location" }).sort({ createdAt: -1 });
    payload = {
      lat: latestLoc?.data?.lat,
      lon: latestLoc?.data?.lon,
      dataType: "location"
    };
  } else if (consent.dataType === "document") {
    const syncedDoc = await DataRecord.findOne({ owner: ownerId, dataType: "document" }).sort({ createdAt: -1 });
    payload = syncedDoc ? syncedDoc.data : { value: owner.resume, isFile: true };
  }

  try {
    const { sendNotification, sendData } = require("../sockets/notification");
    
    sendNotification(consent.requester.toString(), {
      title: "Consent Approved",
      message: `${owner.name} granted access to ${consent.dataType}`,
      type: "CONSENT",
      resourceId: consent._id
    });

    sendData(consent.requester.toString(), { 
      consentId: consent._id, 
      dataType: consent.dataType, 
      data: payload,
      ownerId: ownerId,
      expiresAt: expiryDate 
    });
  } catch (e) {
    console.error("Socket error:", e.message);
  }

  return consent;
};

// ... keep other functions (requestConsent, rejectConsent, etc.) same as before

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