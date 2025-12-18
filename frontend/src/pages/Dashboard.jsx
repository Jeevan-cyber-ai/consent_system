import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setMe(u);
    } catch (e) {}
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex align-items-center mb-4">
          <div className="me-3">
            {me && me.profileImage ? (
              <img src={me.profileImage} alt="profile" style={{width:80,height:80,objectFit:'cover',borderRadius:12}} />
            ) : (
              <div style={{width:80,height:80,background:'#eee',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>You</div>
            )}
          </div>
          <div>
            <h2 className="mb-0">Welcome{me ? `, ${me.name}` : ''}</h2>
            <p className="text-muted">Manage your consents and data securely.</p>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Profile</h5>
                <p className="card-text text-muted">View and edit your profile vault.</p>
                <a href="/profile" className="btn btn-primary btn-sm">Open Profile</a>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Request Data</h5>
                <p className="card-text text-muted">Ask others for access to their data.</p>
                <a href="/request" className="btn btn-warning btn-sm">Request</a>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Notifications</h5>
                <p className="card-text text-muted">See pending requests and alerts.</p>
                <a href="/notifications" className="btn btn-info btn-sm">Open</a>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Audit Logs</h5>
                <p className="card-text text-muted">View action history related to your account.</p>
                <a href="/audit-logs" className="btn btn-secondary btn-sm">View</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
