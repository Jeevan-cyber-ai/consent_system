import api from "../api/axios";

// Fetch audit logs
export const getAuditLogs = async () => {
  const res = await api.get("/audit");
  return res.data;
};
