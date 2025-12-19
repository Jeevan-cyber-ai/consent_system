import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/audit/me")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error fetching logs:", err))
      .finally(() => setLoading(false));
  }, []);

  // Helper to color-code actions
  const getActionBadge = (action) => {
    if (action.includes("ACCESSED")) return "bg-info text-dark";
    if (action.includes("APPROVED") || action.includes("GRANTED")) return "bg-success";
    if (action.includes("DENIED") || action.includes("REVOKED")) return "bg-danger";
    return "bg-secondary";
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        
        {/* Header Section */}
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h3 className="fw-bold text-dark mb-1">📜 Activity Ledger</h3>
            <p className="text-muted small mb-0">Transparent history of all data access and consent actions.</p>
          </div>
          <div className="col-md-6 text-md-end">
             <button className="btn btn-white shadow-sm border rounded-pill px-4" onClick={() => window.location.reload()}>
               🔄 Refresh Logs
             </button>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-uppercase small fw-bold text-secondary">Event / Action</th>
                    <th className="py-3 text-uppercase small fw-bold text-secondary">Target Resource</th>
                    <th className="py-3 text-uppercase small fw-bold text-secondary text-center">Timestamp</th>
                    <th className="pe-4 py-3 text-uppercase small fw-bold text-secondary text-end">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">Loading activity history...</td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">No activity recorded yet.</td>
                    </tr>
                  ) : (
                    logs.map((l) => (
                      <tr key={l._id} style={styles.tableRow}>
                        <td className="ps-4 py-3">
                          <span className={`badge rounded-pill px-3 py-2 ${getActionBadge(l.action)}`}>
                            {l.action.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3">
                          <code className="text-primary fw-bold">
                            {l.resource || "System"}
                          </code>
                        </td>
                        <td className="py-3 text-center">
                          <div className="text-dark small fw-bold">{new Date(l.timestamp).toLocaleDateString()}</div>
                          <div className="text-muted x-small">{new Date(l.timestamp).toLocaleTimeString()}</div>
                        </td>
                        <td className="pe-4 py-3 text-end">
                          {l.details ? (
                            <button 
                              className="btn btn-sm btn-light border rounded-pill px-3"
                              onClick={() => alert(JSON.stringify(l.details, null, 2))}
                            >
                              View JSON
                            </button>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
           <p className="text-muted small">
             <i className="bi bi-shield-check me-2"></i>
             These logs are immutable and stored for your security.
           </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#f4f7fe",
    minHeight: "100vh",
  },
  tableRow: {
    transition: "background-color 0.2s ease",
  }
};