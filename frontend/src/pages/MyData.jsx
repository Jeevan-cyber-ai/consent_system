import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MyData() {
  const [dataType, setDataType] = useState("location");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [approvedData, setApprovedData] = useState([]);
  const [activeTab, setActiveTab] = useState("share"); // 'share' or 'received'

  const saveData = async () => {
    try {
      await api.post("/data", { dataType, data: { value } });
      setMsg("✅ Data synchronized successfully");
      setValue("");
    } catch {
      setMsg("❌ Failed to save data");
    }
  };

  const useLocation = () => {
    if (!navigator.geolocation) {
      setMsg("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      try {
        await api.post("/data", { dataType: "location", data: loc });
        setMsg("📍 Location pinned and shared");
      } catch (e) {
        setMsg("Failed to save location");
      }
    }, () => setMsg("Location permission denied"));
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraStream(stream);
      setMsg("📷 Camera active (Local Preview)");
    } catch (e) {
      setMsg("Camera access denied");
    }
  };

  const disableCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setCameraStream(null);
      setMsg("Camera stream terminated");
    }
  };

  const saveCameraState = async () => {
    try {
      await api.post("/data", { dataType: "camera", data: { enabled: !!cameraStream } });
      setMsg("💾 Camera permission state saved to vault");
    } catch (e) {
      setMsg("Failed to save state");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/consent/my-requests");
        const approved = (res.data || []).filter((c) => c.status === "approved");
        setApprovedData(approved.map(c => ({ consent: c })));
      } catch (e) {}
    };
    load();
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            
            {/* Header Section */}
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">Data Control Center</h2>
              <p className="text-muted">Broadcast your own data streams or access terminals shared with you.</p>
            </div>

            {/* Tab Navigation */}
            <div className="d-flex justify-content-center mb-5">
              <div className="bg-white p-1 rounded-pill shadow-sm border">
                <button 
                  onClick={() => setActiveTab("share")}
                  className={`btn rounded-pill px-5 fw-bold transition-all ${activeTab === 'share' ? 'btn-primary' : 'btn-light border-0'}`}
                >
                  Broadcast Data
                </button>
                <button 
                  onClick={() => setActiveTab("received")}
                  className={`btn rounded-pill px-5 fw-bold transition-all ${activeTab === 'received' ? 'btn-primary' : 'btn-light border-0'}`}
                >
                  Access Terminals
                </button>
              </div>
            </div>

            {msg && (
              <div className="alert alert-light border shadow-sm rounded-4 text-center py-2 mb-4 animate__animated animate__fadeIn">
                <small className="fw-bold text-primary">{msg}</small>
              </div>
            )}

            {activeTab === "share" ? (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <h5 className="fw-bold text-dark mb-0">Configure Live Stream</h5>
                </div>
                <div className="card-body p-4 p-md-5 pt-2">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">PROTOCOL / TYPE</label>
                      <select className="form-select border-light bg-light rounded-3" value={dataType} onChange={(e) => setDataType(e.target.value)}>
                        <option value="location">📍 GPS Location</option>
                        <option value="camera">📷 Video Stream</option>
                        <option value="profile">👤 Identity Profile</option>
                        <option value="document">📄 Vault Document</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">STREAM METADATA</label>
                      <input className="form-control border-light bg-light rounded-3" placeholder="Reference note..." value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                  </div>

                  {/* Contextual Action Areas */}
                  <div className="bg-light rounded-4 p-4 mb-4">
                    {dataType === "location" && (
                      <div className="text-center py-3">
                        <button className="btn btn-outline-primary px-5 rounded-pill fw-bold" onClick={useLocation}>
                          Fetch & Share GPS Coordinates
                        </button>
                      </div>
                    )}

                    {dataType === "camera" && (
                      <div className="text-center">
                        <div className="d-flex justify-content-center gap-2 mb-4">
                          <button className={`btn rounded-pill px-4 fw-bold ${cameraStream ? 'btn-danger' : 'btn-success'}`} onClick={cameraStream ? disableCamera : enableCamera}>
                            {cameraStream ? "Stop Capture" : "Initialize Camera"}
                          </button>
                          <button className="btn btn-warning rounded-pill px-4 fw-bold" onClick={saveCameraState}>Update Permission</button>
                        </div>
                        <div className="position-relative bg-dark rounded-4 overflow-hidden shadow-lg border border-secondary" style={{ height: "340px" }}>
                          {!cameraStream && (
                            <div className="position-absolute top-50 start-50 translate-middle text-center text-white-50">
                              <div className="fs-1 mb-2">📷</div>
                              <small className="text-uppercase fw-bold ls-1">Stream Offline</small>
                            </div>
                          )}
                          <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover", filter: cameraStream ? 'none' : 'grayscale(1)' }} />
                        </div>
                      </div>
                    )}

                    {dataType !== "location" && dataType !== "camera" && (
                      <div className="text-center py-5 text-muted">
                        <div className="fs-2 mb-2">📎</div>
                        <p className="small mb-0">Use the input above to provide {dataType} data manually.</p>
                      </div>
                    )}
                  </div>

                  <button className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 shadow" onClick={saveData}>
                    Synchronize with Backend Vault
                  </button>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {approvedData.length === 0 ? (
                  <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
                    <div className="fs-1 mb-3">📡</div>
                    <h5 className="text-dark fw-bold">No Active Inbound Streams</h5>
                    <p className="text-muted small">Requests approved by others will appear here for monitoring.</p>
                  </div>
                ) : (
                  approvedData.map((item) => (
                    <div key={item.consent._id} className="col-md-6">
                      <div className="card border-0 shadow-sm rounded-4 h-100 transition-all hover-up">
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                          <div className="d-flex align-items-center mb-4">
                            <div className="bg-primary-subtle p-3 rounded-circle me-3">
                              {item.consent.dataType === 'location' ? '📍' : item.consent.dataType === 'camera' ? '📷' : '👤'}
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0 text-dark">{item.consent.dataOwner?.name}</h6>
                              <small className="text-muted">{item.consent.dataOwner?.email}</small>
                            </div>
                          </div>
                          <div className="bg-light rounded-3 p-2 mb-4 border-start border-primary border-4">
                            <small className="text-uppercase fw-bold text-muted d-block" style={{fontSize: '10px'}}>Inbound Stream</small>
                            <span className="fw-bold text-primary small">{item.consent.dataType.toUpperCase()}</span>
                          </div>
                          <Link 
                            to={`/view-approved/${item.consent.dataOwner._id}`} 
                            className="btn btn-outline-primary rounded-pill btn-sm w-100 fw-bold py-2"
                          >
                            Open Terminal
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
    backgroundColor: "#f4f7fe", 
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif" 
  }
};