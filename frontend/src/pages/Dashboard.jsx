import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setMe(u);
    } catch (e) {
      console.error("User data not found in storage");
    }
  }, []);

  return (
    <div style={styles.dashboardWrapper}>
      <Navbar />
      
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-5 align-items-center bg-white p-4 rounded-4 shadow-sm mx-0">
          <div className="col-auto">
            {me && me.profileImage ? (
              <img 
                src={me.profileImage} 
                alt="profile" 
                className="shadow-sm border border-3 border-primary-subtle"
                style={styles.profilePic} 
              />
            ) : (
              <div style={styles.profilePlaceholder}>
                <span style={{fontSize: '2rem'}}>👤</span>
              </div>
            )}
          </div>
          <div className="col">
            <h1 className="fw-bold text-dark mb-1">
              Welcome Back{me ? `, ${me.name.split(' ')[0]}` : ''}!
            </h1>
            
            <p className="text-muted mb-0">
              <span className="badge bg-success-subtle text-success border border-success-subtle me-2">Secure Session Active</span>
              <br></br>Manage your data permissions and requests from your control panel.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="row g-4">
          {/* Card: Profile */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={styles.dashboardCard}>
              <div className="card-body p-4 text-center">
                <div className="mb-3 fs-1">📁</div>
                <h5 className="fw-bold">My Vault</h5>
                <p className="text-muted small">Update your personal details, academic info, and secure files.</p>
                <Link to="/profile" className="btn btn-outline-primary rounded-pill w-100 fw-bold">Open Profile</Link>
              </div>
            </div>
          </div>

          {/* Card: Shared With Me */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={styles.dashboardCard}>
              <div className="card-body p-4 text-center">
                <div className="mb-3 fs-1">🔓</div>
                <h5 className="fw-bold">Shared with Me</h5>
                <p className="text-muted small">Access data that other users have granted you permission to view.</p>
                <Link to="/my-data" className="btn btn-primary rounded-pill w-100 fw-bold">View Data</Link>
              </div>
            </div>
          </div>

          {/* Card: Request Data */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={styles.dashboardCard}>
              <div className="card-body p-4 text-center">
                <div className="mb-3 fs-1">📨</div>
                <h5 className="fw-bold">Request Access</h5>
                <p className="text-muted small">Send new requests to users for profile or location data.</p>
                <Link to="/request" className="btn btn-outline-warning text-dark rounded-pill w-100 fw-bold">Send Request</Link>
              </div>
            </div>
          </div>

          {/* Card: Notifications */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={styles.dashboardCard}>
              <div className="card-body p-4 text-center">
                <div className="mb-3 fs-1">🔔</div>
                <h5 className="fw-bold">Alerts</h5>
                <p className="text-muted small">Check pending consent requests and system notifications.</p>
                <Link to="/notifications" className="btn btn-outline-info text-dark rounded-pill w-100 fw-bold">Open Alerts</Link>
              </div>
            </div>
          </div>

          {/* Card: Audit Logs */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={styles.dashboardCard}>
              <div className="card-body p-4 text-center">
                <div className="mb-3 fs-1">📜</div>
                <h5 className="fw-bold">Activity Logs</h5>
                <p className="text-muted small">Review your account history and see who accessed your data.</p>
                <Link to="/audit-logs" className="btn btn-outline-secondary rounded-pill w-100 fw-bold">View Logs</Link>
              </div>
            </div>
          </div>
          
          {/* Card: Requests to Me */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={styles.dashboardCard}>
              <div className="card-body p-4 text-center">
                <div className="mb-3 fs-1">📥</div>
                <h5 className="fw-bold">Pending Approvals</h5>
                <p className="text-muted small">Review and approve requests from others waiting for your data.</p>
                <Link to="/requests-to-me" className="btn btn-outline-dark rounded-pill w-100 fw-bold">Manage</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboardWrapper: {
    backgroundColor: "#4cc8ceff", // Soft, professional formal grey-blue
    minHeight: "100vh",
  },
  profilePic: {
    width: 90,
    height: 90,
    objectFit: "cover",
    borderRadius: "20px",
  },
  profilePlaceholder: {
    width: 90,
    height: 90,
    background: "#e9ecef",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #ccc"
  },
  dashboardCard: {
    borderRadius: "18px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  }
};