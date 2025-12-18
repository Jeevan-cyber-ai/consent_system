import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

// decode simple JWT to get payload (no verification)
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (e) {
    return null;
  }
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);
    if (decoded?.id) {
      setOwnerId(decoded.id);
      fetchProfile(decoded.id);
    }
  }, []);

  const fetchProfile = async (id) => {
    try {
      const res = await api.get(`/profile/${id}`);
      setProfile(res.data);
    } catch (e) {
      setProfile(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4 col-md-8">
        <h4>Profile</h4>

        <div className="mb-3">
          <label className="form-label">Load profile by User ID</label>
          <div className="d-flex">
            <input
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="form-control me-2"
              placeholder="User ID (leave to view your profile)"
            />
            <button
              className="btn btn-primary"
              onClick={() => fetchProfile(ownerId)}
            >
              Load
            </button>
          </div>
        </div>

        {profile ? (
          <div className="card p-3">
            <div className="d-flex align-items-start mb-3">
              {profile.profileImage && (
                <img src={profile.profileImage} alt="profile" style={{maxWidth:140, maxHeight:140, objectFit:'cover', marginRight:16, borderRadius:8}} />
              )}
              <div>
                <h5>{profile.name}</h5>
                <p className="text-muted">{profile.email}</p>
                {profile.course && <span className="badge bg-primary me-2">{profile.course}</span>}
                {profile.collegeName && <div className="text-muted mt-2">{profile.collegeName}</div>}
              </div>
            </div>
            {profile.description && <p className="mt-3">{profile.description}</p>}
            {profile.bio && <p>{profile.bio}</p>}
            {profile.domain && <p><strong>Domain:</strong> {profile.domain}</p>}
            {profile.linkedin && (
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  {profile.linkedin}
                </a>
              </p>
            )}
            {profile.resume && (
              <p>
                <a href={profile.resume} target="_blank" rel="noreferrer">Download resume</a>
              </p>
            )}
            {profile.additionalDetails && (
              <pre>{JSON.stringify(profile.additionalDetails, null, 2)}</pre>
            )}
          </div>
        ) : (
          <p className="text-muted">No profile available or consent not granted.</p>
        )}
      </div>
    </>
  );
}
