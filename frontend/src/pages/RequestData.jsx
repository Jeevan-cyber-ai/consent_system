import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function RequestData() {
  const [dataOwner, setDataOwner] = useState("");
  const [dataType, setDataType] = useState("profile"); // Set default to profile
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/auth/users")
      .then((res) => setUsers(res.data))
      .catch(() => {});
  }, []);

  const requestConsent = async () => {
    if (!dataOwner) {
      alert("Please select a user first");
      return;
    }
    try {
      await api.post("/consent/request", { dataOwner, dataType });
      window.dispatchEvent(new CustomEvent("app-toast", { 
        detail: { message: `Request for ${dataType} sent!`, variant: "success" } 
      }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent("app-toast", { 
        detail: { message: "Request failed", variant: "danger" } 
      }));
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
  });

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card shadow-lg border-0" style={styles.requestCard}>
              <div className="card-body p-4 p-md-5">
                
                {/* Header Icon */}
                <div className="text-center mb-4">
                  <div className="bg-warning-subtle d-inline-block p-3 rounded-circle mb-3">
                    <span style={{ fontSize: "2rem" }}>📤</span>
                  </div>
                  <h3 className="fw-bold text-dark">Request Access</h3>
                  <p className="text-muted small">Select a user and the type of information you need access to.</p>
                </div>

                <hr className="my-4 opacity-25" />

                {/* Step 1: Search User */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">1. FIND USER</label>
                  <div className="input-group mb-2 shadow-sm">
                    <span className="input-group-text bg-white border-end-0">🔍</span>
                    <input
                      className="form-control border-start-0"
                      placeholder="Name or email..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  
                  <select
                    className="form-select form-select-lg shadow-sm"
                    value={dataOwner}
                    onChange={(e) => setDataOwner(e.target.value)}
                    style={styles.selectInput}
                  >
                    <option value="">Choose the data owner...</option>
                    {filteredUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} — {u.email}
                      </option>
                    ))}
                  </select>
                  {query && filteredUsers.length === 0 && (
                    <div className="form-text text-danger px-1">No users found matching your search.</div>
                  )}
                </div>

                {/* Step 2: Select Data Type */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">2. SELECT DATA TYPE</label>
                  <div className="row g-2">
                    {["profile", "location", "camera", "document"].map((type) => (
                      <div className="col-6" key={type}>
                        <div 
                          onClick={() => setDataType(type)}
                          style={{
                            ...styles.typeBox,
                            ...(dataType === type ? styles.typeBoxActive : {})
                          }}
                        >
                          <span className="me-2">
                            {type === "profile" && "👤"}
                            {type === "location" && "📍"}
                            {type === "camera" && "📷"}
                            {type === "document" && "📄"}
                          </span>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  className="btn btn-warning btn-lg w-100 shadow-sm fw-bold mt-2" 
                  onClick={requestConsent}
                  disabled={!dataOwner}
                  style={styles.requestBtn}
                >
                  Send Consent Request
                </button>

                <div className="text-center mt-4">
                  <p className="text-muted x-small mb-0">
                    Requests are subject to user approval and logged in the audit system.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#a0939aff", // Matches Dashboard background
    minHeight: "100vh",
  },
  requestCard: {
    borderRadius: "24px",
    backgroundColor: "#e9f0f4ff",
  },
  selectInput: {
    borderRadius: "12px",
    fontSize: "0.95rem",
  },
  typeBox: {
    border: "2px solid #f0f0f0",
    borderRadius: "12px",
    padding: "10px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#666"
  },
  typeBoxActive: {
    borderColor: "#ffc107",
    backgroundColor: "#fffbeb",
    color: "#000",
  },
  requestBtn: {
    borderRadius: "12px",
    padding: "14px",
    transition: "transform 0.2s"
  }
};