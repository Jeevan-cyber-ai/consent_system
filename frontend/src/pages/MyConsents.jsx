import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function MyConsents() {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/consent/my-consents")
      .then((res) => setConsents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const revokeConsent = async (id) => {
    await api.put(`/consent/revoke/${id}`);
    setConsents(consents.filter((c) => c._id !== id));
  };

  const approveConsent = async (id) => {
    const res = await api.put(`/consent/approve/${id}`);
    setConsents(consents.map(c => c._id === id ? res.data : c));
  };

  const rejectConsent = async (id) => {
    const res = await api.put(`/consent/reject/${id}`);
    setConsents(consents.map(c => c._id === id ? res.data : c));
  };

  // Helper for Status Badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="badge bg-success-subtle text-success border border-success-subtle px-3">Active Access</span>;
      case "pending": return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3">Action Required</span>;
      case "rejected": return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3">Rejected</span>;
      default: return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        
        {/* Header Section */}
        <div className="row mb-5 align-items-center">
          <div className="col-md-7">
            <h3 className="fw-bold text-dark mb-1">🛡️ Consent Management</h3>
            <p className="text-muted mb-0">Review and control who has access to your personal data streams.</p>
          </div>
          <div className="col-md-5 text-md-end">
            <div className="d-inline-flex bg-white p-2 rounded-pill shadow-sm border">
              <span className="px-3 small fw-bold text-primary">Total Permissions: {consents.length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : consents.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="fs-1 mb-3">📭</div>
            <h5 className="text-muted">No consent requests found</h5>
            <p className="text-muted small">When users request your data, they will appear here.</p>
          </div>
        ) : (
          <div className="row g-4">
            {consents.map((c) => (
              <div className="col-md-6 col-xl-4" key={c._id}>
                <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary-subtle p-2 rounded-3 me-3 fs-4">
                          {c.dataType === 'location' ? '📍' : c.dataType === 'camera' ? '📷' : '👤'}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{c.requester?.name || "Unknown User"}</h6>
                          <small className="text-muted">{c.requester?.email}</small>
                        </div>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>

                    <div className="p-3 bg-light rounded-3 mb-4">
                      <small className="text-uppercase fw-bold text-secondary d-block mb-1" style={{fontSize: '10px'}}>Requested Resource</small>
                      <span className="fw-bold text-dark">{c.dataType.toUpperCase()} DATA</span>
                    </div>

                    <div className="d-flex gap-2">
                      {c.status === "pending" && (
                        <>
                          <button className="btn btn-success w-100 rounded-pill fw-bold" onClick={() => approveConsent(c._id)}>
                            Approve
                          </button>
                          <button className="btn btn-outline-danger w-100 rounded-pill fw-bold" onClick={() => rejectConsent(c._id)}>
                            Reject
                          </button>
                        </>
                      )}

                      {c.status === "approved" && (
                        <button className="btn btn-danger w-100 rounded-pill fw-bold shadow-sm" onClick={() => revokeConsent(c._id)}>
                          Revoke Access
                        </button>
                      )}

                      {(c.status === "rejected" || c.status === "revoked") && (
                        <button className="btn btn-light w-100 rounded-pill disabled text-muted fw-bold">
                          Inactive
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 text-center">
          <div className="alert alert-info d-inline-block border-0 shadow-sm rounded-pill px-4 py-2 small">
            <i className="bi bi-info-circle me-2"></i>
            Revoking access will immediately cut off data delivery to the requester.
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#f4f7fe",
    minHeight: "100vh",
  }
};