import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function ApprovedRequestDetail() {
  const { ownerId } = useParams();
  const [data, setData] = useState({ profile: null, location: null, camera: false });
  const [loading, setLoading] = useState(true);

  const fetchApprovedData = async () => {
    try {
      const profRes = await api.get(`/profile/${ownerId}`);
      const locRes = await api.get(`/data/${ownerId}/location`).catch(() => null);
      const camRes = await api.get(`/data/${ownerId}/camera`).catch(() => null);

      setData({
        profile: profRes.data,
        location: locRes?.data,
        camera: camRes?.data?.enabled
      });
    } catch (err) {
      console.error("Access denied or user not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedData();
    const handler = (e) => {
      const payload = e.detail;
      if (payload.ownerId === ownerId) {
        fetchApprovedData();
      }
    };
    window.addEventListener("data-delivery", handler);
    return () => window.removeEventListener("data-delivery", handler);
  }, [ownerId]);

  if (loading) {
    return (
      <div style={styles.pageWrapper} className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3 fw-bold">Verifying Secure Consent...</span>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">🔐 Secure Access Terminal</h3>
            <p className="text-muted small">Viewing authorized data for User ID: {ownerId}</p>
          </div>
          <span className="badge rounded-pill bg-success px-3 py-2">
            <span className="spinner-grow spinner-grow-sm me-2" role="status"></span>
            Live Connection
          </span>
        </div>

        {!data.profile ? (
          <div className="alert alert-warning border-0 shadow-sm rounded-4 p-4 text-center">
             <h5 className="mb-1">No Data Found</h5>
             <p className="mb-0">You do not have approved consent or the user has retracted access.</p>
          </div>
        ) : (
          <div className="row g-4">
            
            {/* Profile Sidebar */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div style={styles.profileHeader}></div>
                <div className="card-body text-center" style={{ marginTop: "-50px" }}>
                  <img 
                    src={data.profile.profileImage || 'https://via.placeholder.com/150'} 
                    className="rounded-4 border border-4 border-white shadow-sm mb-3" 
                    style={styles.profilePic} 
                    alt="Profile"
                  />
                  <h4 className="fw-bold mb-0">{data.profile.name}</h4>
                  <p className="text-muted small mb-3">{data.profile.email}</p>
                  <div className="bg-light p-3 rounded-3 text-start">
                    <h6 className="small fw-bold text-uppercase text-secondary">Bio</h6>
                    <p className="small mb-0">{data.profile.bio || "No bio provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Data Streams */}
            <div className="col-lg-8">
              
              {/* Location Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary-subtle p-2 rounded-3 me-3">📍</div>
                    <h5 className="fw-bold mb-0">Location Tracking</h5>
                  </div>
                  {data.location ? (
                    <div className="p-3 rounded-4 border bg-light">
                      <div className="row text-center">
                        <div className="col-6 border-end">
                          <small className="text-muted d-block">Latitude</small>
                          <span className="fw-bold text-primary">{data.location.lat || data.location.latitude || "N/A"}</span>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Longitude</small>
                          <span className="fw-bold text-primary">{data.location.lng || data.location.longitude || "N/A"}</span>
                        </div>
                      </div>
                      <div className="mt-3 x-small text-center text-muted">
                         Last Updated: {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-danger-subtle border-0 rounded-4">
                      Location access restricted by user.
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Card */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="bg-danger-subtle p-2 rounded-3 me-3">📷</div>
                      <h5 className="fw-bold mb-0">Camera Status</h5>
                    </div>
                    {data.camera ? (
                      <span className="badge bg-success rounded-pill px-3">ACTIVE</span>
                    ) : (
                      <span className="badge bg-secondary rounded-pill px-3">OFFLINE</span>
                    )}
                  </div>
                  <p className="text-muted small mt-3 mb-0">
                    {data.camera 
                      ? "The user has enabled camera streaming for this session." 
                      : "The user's camera is currently disabled or blocked."}
                  </p>
                </div>
              </div>

            </div>
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
  profileHeader: {
    height: "100px",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  },
  profilePic: {
    width: 120,
    height: 120,
    objectFit: "cover",
    backgroundColor: "white"
  }
};