import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    return JSON.parse(atob(parts[1]));
  } catch (e) {
    return null;
  }
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [ownerId, setOwnerId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);
    if (decoded?.id) {
      setOwnerId(decoded.id);
      fetchProfile(decoded.id);
    }
  }, []);

  const fetchProfile = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/profile/${id}`);
      setProfile(res.data);
    } catch (e) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* Search Section */}
            <div className="card border-0 shadow-sm mb-4 rounded-4">
              <div className="card-body p-3">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h5 className="mb-md-0 fw-bold ms-2 text-primary">🔍 Profile Explorer</h5>
                  </div>
                  <div className="col-md-7">
                    <div className="input-group">
                      <input
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        className="form-control bg-light border-0"
                        placeholder="Enter User ID to fetch profile..."
                      />
                      <button className="btn btn-primary px-4 fw-bold" onClick={() => fetchProfile(ownerId)}>
                        {loading ? "Loading..." : "View Profile"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {profile ? (
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                {/* Visual Header */}
                <div style={styles.headerBanner}></div>
                
                <div className="card-body p-4 p-md-5 pt-0">
                  <div className="row align-items-end mb-4" style={{ marginTop: "-70px" }}>
                    
                    {/* Profile Image Column */}
                    <div className="col-auto">
                      <img 
                        crossOrigin="anonymous" 
                        src={profile.profileImage || "https://via.placeholder.com/150"} 
                        alt="profile" 
                        className="rounded-4 border border-4 border-white shadow"
                        style={styles.profileImg} 
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://via.placeholder.com/150"; 
                        }}
                      />
                    </div>

                    {/* Name and Basic Info */}
                    <div className="col mb-2">
                      <h2 className="fw-bold mb-1 text-dark">{profile.name}</h2>
                      <div className="text-secondary mb-2 d-flex flex-wrap gap-3 align-items-center">
                        <span>📧 {profile.email}</span>
                        {profile.domain && <span>🎯 {profile.domain}</span>}
                      </div>
                      <div className="d-flex gap-2">
                        {profile.course && (
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                            {profile.course}
                          </span>
                        )}
                        <span className="badge bg-light text-dark border px-3 py-2">ID: {ownerId.slice(-6)}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 opacity-25" />

                  <div className="row g-4">
                    {/* Left Side: Bio & Education */}
                    <div className="col-md-8">
                      <section className="mb-4">
                        <h6 className="text-uppercase text-primary fw-bold small mb-3">About Me</h6>
                        <p className="lead fs-6 text-dark" style={{ lineHeight: '1.8' }}>
                          {profile.description || "No description provided."}
                        </p>
                        <div className="bg-light p-4 rounded-4 mt-4 border-start border-4 border-primary">
                          <p className="mb-0 fst-italic text-muted">
                             "{profile.bio || "Professional profile under consent management."}"
                          </p>
                        </div>
                      </section>

                      {profile.collegeName && (
                        <section>
                          <h6 className="text-uppercase text-primary fw-bold small mb-3">Education</h6>
                          <div className="d-flex align-items-center p-3 border rounded-4 bg-white shadow-sm">
                            <div className="fs-1 me-3">🏫</div>
                            <div>
                              <h6 className="mb-0 fw-bold">{profile.collegeName}</h6>
                              <span className="text-muted small">{profile.course}</span>
                            </div>
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Right Side: Links & Meta */}
                    <div className="col-md-4">
                      <div className="card border-0 bg-light rounded-4 p-4 sticky-top" style={{ top: '20px', zIndex: 1 }}>
                        <h6 className="fw-bold mb-3 text-dark">Resources</h6>
                        
                        {profile.linkedin && (
                          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-white border w-100 mb-2 shadow-sm d-flex align-items-center justify-content-center gap-2">
                             LinkedIn Profile
                          </a>
                        )}

                        {profile.resume && (
                          <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-dark w-100 shadow-sm d-flex align-items-center justify-content-center gap-2">
                            📄 View Resume
                          </a>
                        )}

                        {!profile.linkedin && !profile.resume && (
                          <p className="text-muted small text-center mb-0">No external links available.</p>
                        )}

                        {profile.additionalDetails && (
                          <div className="mt-4">
                            <h6 className="fw-bold small text-muted mb-2">Technical Info</h6>
                            <div className="bg-dark text-info p-3 rounded-3" style={{fontSize:'11px', overflowX: 'auto'}}>
                              <pre className="mb-0">{JSON.stringify(profile.additionalDetails, null, 2)}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                <div className="display-1 mb-3">🔐</div>
                <h4 className="fw-bold">Restricted Access</h4>
                <p className="text-muted px-5">Enter a valid User ID above to explore profiles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#f0f2f5", // Slightly grayer background to make the white cards pop
    minHeight: "100vh",
  },
  headerBanner: {
    height: "160px",
    background: "linear-gradient(45deg, #00416A 0%, #E4E5E6 100%)", // More professional gradient
  },
  profileImg: {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    backgroundColor: "#fff",
  }
};