import api from "../api/axios";

// Get all consents of logged-in user
export const getConsents = async () => {
  const res = await api.get("/consents");
  return res.data;
};

// Grant consent
export const grantConsent = async (consentData) => {
  const res = await api.post("/consents/grant", consentData);
  return res.data;
};

// Revoke consent
export const revokeConsent = async (consentId) => {
  const res = await api.put(`/consents/revoke/${consentId}`);
  return res.data;
};
