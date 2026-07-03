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
  const [activeTab, setActiveTab] = useState("share");

  // --- DATA LOADING WITH VALIDATION ---
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/consent/my-requests");
        // Filter out any records that are null or missing the dataOwner object
        const approved = (res.data || []).filter(
          (c) => c && c.status === "approved" && c.dataOwner
        );
        setApprovedData(approved.map((c) => ({ consent: c })));
      } catch (e) {
        console.error("Failed to load approved requests:", e);
      }
    };
    load();
  }, []);

  // --- ACTIONS ---
  const saveData = async () => {
    if ((dataType === "location" || dataType === "camera") && !value) {
      setMsg("⚠️ Please use the specialized buttons for GPS or Camera.");
      return;
    }
    try {
      await api.post("/data", { dataType, data: { value } });
      setMsg("✅ Data synchronized successfully");
      setValue("");
    } catch {
      setMsg("❌ Failed to save data");
    }
  };

  const useLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const loc = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        timestamp: Date.now(),
      };
      try {
        await api.post("/data", { dataType: "location", data: loc });
        setMsg("📍 GPS Coordinates Dispatched");
      } catch (e) {
        setMsg("Sync Error");
      }
    });
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraStream(stream);
      setMsg("📷 Camera active (Local Preview)");
    } catch (e) {
      setMsg("Camera access denied");
    }
  };

  const disableCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraStream(null);
      setMsg("Camera stream terminated");
    }
  };

  const saveCameraState = async () => {
    try {
      await api.post("/data", { dataType: "camera", data: { enabled: !!cameraStream } });
      setMsg("💾 Camera permission state saved");
    } catch (e) {
      setMsg("Failed to save state");
    }
  };

  // --- RENDER ---
  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark">Data Control Center</h2>
              <p className="text-muted">Broadcast data or access shared terminals.</p>
            </div>

            <div className="d-flex justify-content-center mb-5">
              <div className="bg-white p-1 rounded-pill shadow-sm border">
                <button
                  onClick={() => setActiveTab("share")}
                  className={`btn rounded-pill px-5 fw-bold ${activeTab === "share" ? "btn-primary" : "btn-light"}`}
                >
                  Broadcast Data
                </button>
                <button
                  onClick={() => setActiveTab("received")}
                  className={`btn rounded-pill px-5 fw-bold ${activeTab === "received" ? "btn-primary" : "btn-light"}`}
                >
                  Access Terminals
                </button>
              </div>
            </div>

            {msg && (
              <div className="alert alert-light border shadow-sm rounded-4 text-center py-2 mb-4">
                <small className="fw-bold text-primary">{msg}</small>
              </div>
            )}

            {activeTab === "share" ? (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <h5 className="fw-bold mb-4">Configure Live Stream</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">PROTOCOL</label>
                    <select className="form-select bg-light" value={dataType} onChange={(e) => setDataType(e.target.value)}>
                      <option value="location"> GPS Location</option>
                      <option value="camera">Video Stream</option>
                      <option value="profile"> Identity Profile</option>
                      <option value="document"> Vault Document</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">METADATA</label>
                    <input className="form-control bg-light" value={value} onChange={(e) => setValue(e.target.value)} />
                  </div>
                </div>

                <div className="bg-light rounded-4 p-4 mb-4">
                  {dataType === "location" && (
                    <button className="btn btn-outline-primary w-100 rounded-pill" onClick={useLocation}>
                      Fetch & Share GPS
                    </button>
                  )}
                  {dataType === "camera" && (
                    <div>
                      <div className="d-flex gap-2 mb-3">
                        <button className="btn btn-success flex-grow-1" onClick={enableCamera}>Start</button>
                        <button className="btn btn-danger flex-grow-1" onClick={disableCamera}>Stop</button>
                      </div>
                      <video ref={videoRef} className="w-100 rounded-3 bg-dark" style={{ height: "300px" }} />
                    </div>
                  )}
                </div>
                <button className="btn btn-primary w-100 rounded-pill py-3 fw-bold" onClick={saveData}>
                  Sync to Vault
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {approvedData.length === 0 ? (
                  <div className="text-center py-5">No active streams.</div>
                ) : (
                  approvedData.map((item) => {
                    // CRITICAL: Guard Clause to prevent "reading property of null" error
                    if (!item?.consent?._id || !item?.consent?.dataOwner) return null;

                    return (
                      <div key={item.consent._id} className="col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="me-3 fs-3">
                              {item.consent.dataType === "location" ? "" : "👤"}
                            </div>
                            <div>
                              {/* Optional Chaining ensures no crash if data is missing */}
                              <h6 className="fw-bold mb-0">{item.consent.dataOwner?.name}</h6>
                              <small className="text-muted">{item.consent.dataOwner?.email}</small>
                            </div>
                          </div>
                          <Link
                            to={`/view-approved/${item.consent.dataOwner?._id}`}
                            className="btn btn-outline-primary w-100 rounded-pill"
                          >
                            Open Terminal
                          </Link>
                        </div>
                      </div>
                    );
                  })
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
  pageWrapper: { backgroundColor: "#f4f7fe", minHeight: "100vh" },
};