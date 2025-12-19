import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Notifications() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  });

  const loadPending = async () => {
    setLoading(true);
    try {
      let current = me;
      if (!current) {
        const r = await api.get('/auth/me');
        current = r.data;
        localStorage.setItem('user', JSON.stringify(current));
        setMe(current);
      }

      const res = await api.get('/consent/requests-to-me');
      const pending = (res.data || []).filter((c) => c.status === 'pending');
      setRequests(pending);
    } catch (e) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
    const handler = async () => {
      await loadPending();
    };
    window.addEventListener('socket-notification', handler);
    return () => window.removeEventListener('socket-notification', handler);
  }, []);

  const approve = async (consentId) => {
    try {
      await api.put(`/consent/approve/${consentId}`);
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Access Granted", variant: "success" } }));
      await loadPending();
    } catch (e) {
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Approve failed", variant: "danger" } }));
    }
  };

  const reject = async (consentId) => {
    try {
      await api.put(`/consent/reject/${consentId}`);
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Request Rejected", variant: "warning" } }));
      await loadPending();
    } catch (e) {
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Reject failed", variant: "danger" } }));
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">🔔 Inbox</h3>
            <p className="text-muted small mb-0">Manage incoming data access requests from other users.</p>
          </div>
          {requests.length > 0 && (
            <span className="badge bg-danger rounded-pill px-3 py-2 shadow-sm">
              {requests.length} New Request{requests.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="fs-1 mb-3">📬</div>
            <h5 className="text-dark fw-bold">All caught up!</h5>
            <p className="text-muted small">You don't have any pending consent requests to review.</p>
          </div>
        ) : (
          <div className="row g-3">
            {requests.map((r) => (
              <div className="col-12" key={r._id}>
                <div className="card border-0 shadow-sm rounded-4 hover-shadow transition-all" style={styles.requestCard}>
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      {/* Requester Info */}
                      <div className="col-md-5 d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '45px', height: '45px', fontWeight: 'bold'}}>
                          {(r.requester?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-dark">{r.requester?.name}</h6>
                          <small className="text-muted">{r.requester?.email}</small>
                        </div>
                      </div>

                      {/* Request Content */}
                      <div className="col-md-3 text-center my-3 my-md-0">
                        <div className="bg-light rounded-pill px-3 py-1 border d-inline-block">
                          <span className="small text-muted text-uppercase fw-bold me-2" style={{fontSize: '10px'}}>Requesting:</span>
                          <span className="text-primary fw-bold small">
                            {r.dataType === 'location' ? '📍 Location' : 
                             r.dataType === 'camera' ? '📷 Camera' : 
                             r.dataType === 'profile' ? '👤 Profile' : r.dataType}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-md-4 text-md-end">
                        <button 
                          className="btn btn-success rounded-pill px-4 me-2 fw-bold shadow-sm"
                          onClick={() => approve(r._id)}
                        >
                          Allow Access
                        </button>
                        <button 
                          className="btn btn-outline-danger rounded-pill px-4 fw-bold"
                          onClick={() => reject(r._id)}
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#f4f7fe",
    minHeight: "100vh",
  },
  requestCard: {
    backgroundColor: "#ffffff",
    borderLeft: "5px solid #0d6efd", // Blue indicator for new requests
  }
};