const consentService = require("../services/consentservice");
const Consent = require("../models/consentModel");
// REQUEST (creates PENDING consent)
exports.grantConsent = async (req, res) => {
  const consent = await consentService.requestConsent({
    requester: req.user.id,
    dataOwner: req.body.dataOwner,
    dataType: req.body.dataType
  });

  res.json(consent);
};

exports.revokeConsent = async (req, res) => {
  const consent = await consentService.revokeConsent(
    req.params.id,
    req.user.id
  );

  res.json(consent);
};

exports.approveConsent = async (req, res) => {
  // We expect { expiryHours: number } in req.body
  const result = await consentService.approveConsent(
    req.params.id, 
    req.user.id, 
    req.body.expiryHours 
  );
  res.json(result);
};

exports.rejectConsent = async (req, res) => {
  const consent = await consentService.rejectConsent(req.params.id, req.user.id);
  res.json(consent);
};
exports.requestsToMe = async (req, res) => {
  const requests = await consentService.getRequestsToMe(req.user.id);
  res.json(requests);
};


exports.myRequests = async (req, res) => {
  const data = await consentService.getMyRequests(req.user.id);
  res.json(data);
};

exports.myConsents = async (req, res) => {
  const data = await consentService.getMyApprovedConsents(req.user.id);
  res.json(data);
};
exports.requestConsent = async (req, res) => {
  const consent = await consentService.requestConsent({
    requester: req.user.id,
    dataOwner: req.body.dataOwner,
    dataType: req.body.dataType
  });

  res.json(consent);
};
