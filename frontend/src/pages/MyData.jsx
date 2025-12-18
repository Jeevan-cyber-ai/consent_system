import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function MyData() {
  const [dataType, setDataType] = useState("location");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  const saveData = async () => {
    try {
      await api.post("/data", {
        dataType,
        data: { value }
      });
      setMsg("Data saved successfully");
      setValue("");
    } catch {
      setMsg("Failed to save data");
    }
  };

  const useLocation = () => {
    if (!navigator.geolocation) {
      setMsg("Geolocation not supported by browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      try {
        await api.post("/data", { dataType: "location", data: loc });
        setMsg("Location saved");
      } catch (e) {
        setMsg("Failed to save location");
      }
    }, (err) => {
      setMsg("Location permission denied or error");
    });
  };

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraStream(stream);
      setMsg("Camera enabled (local preview). Save state to backend if desired.");
    } catch (e) {
      setMsg("Camera access denied or not available");
    }
  };

  const disableCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setCameraStream(null);
      setMsg("Camera stopped");
    }
  };

  const saveCameraState = async () => {
    try {
      await api.post("/data", { dataType: "camera", data: { enabled: !!cameraStream } });
      setMsg("Camera state saved to backend");
    } catch (e) {
      setMsg("Failed to save camera state");
    }
  };

  // Listen for real-time data deliveries (e.g., approval)
  useEffect(() => {
    const handler = (e) => {
      const payload = e.detail; // { consentId, dataType, data }
      if (!payload) return;
      if (payload.dataType === "camera" && payload.data && payload.data.cameraEnabled) {
        enableCamera();
        window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Camera auto-enabled after approval", variant: "success" } }));
      }

      if (payload.dataType === "location" && payload.data && payload.data.location) {
        // display location to user and optionally save locally
        setMsg(`Received location: ${JSON.stringify(payload.data.location)}`);
      }

      if (payload.dataType === "profile") {
        // notify user to view profile
        window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Profile data delivered — check Profile page", variant: "info" } }));
      }
    };

    window.addEventListener("data-delivery", handler);
    return () => window.removeEventListener("data-delivery", handler);
  }, [cameraStream]);

  // Fetch approved consents where current user is the requester and load data
  const [approvedData, setApprovedData] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/consent/my-requests");
        const approved = (res.data || []).filter((c) => c.status === "approved");

        const results = [];
        for (const c of approved) {
          try {
            // try fetching via data endpoint (ownerId, type)
            const dataRes = await api.get(`/data/${c.dataOwner._id}/${c.dataType}`);
            results.push({ consent: c, data: dataRes.data });
          } catch (e) {
            // fallback: if profile type, call profile endpoint
            if (c.dataType === "profile") {
              try {
                const p = await api.get(`/profile/${c.dataOwner._id}`);
                results.push({ consent: c, data: p.data });
              } catch (er) {
                results.push({ consent: c, data: null });
              }
            } else {
              results.push({ consent: c, data: null });
            }
          }
        }

        if (mounted) setApprovedData(results);
      } catch (e) {}
    };

    load();
    return () => (mounted = false);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4 col-md-6">
        <h4>My Data</h4>

        {msg && <div className="alert alert-info">{msg}</div>}

        <select
          className="form-select mb-2"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
        >
          <option value="location">Location</option>
          <option value="camera">Camera</option>
          <option value="profile">Profile</option>
          <option value="document">Document</option>
        </select>

        <input
          className="form-control mb-2"
          placeholder="Enter data value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {dataType === "location" && (
          <div className="mb-2">
            <button className="btn btn-info me-2" onClick={useLocation}>
              Use current location
            </button>
          </div>
        )}

        {dataType === "camera" && (
          <div className="mb-2">
            <div className="mb-2">
              <button className="btn btn-primary me-2" onClick={enableCamera}>
                Enable Camera
              </button>
              <button className="btn btn-secondary me-2" onClick={disableCamera}>
                Disable Camera
              </button>
              <button className="btn btn-warning" onClick={saveCameraState}>
                Save Camera State
              </button>
            </div>

            <div>
              <video ref={videoRef} style={{ width: "100%", maxHeight: 300 }} />
            </div>
          </div>
        )}

        <button className="btn btn-success" onClick={saveData}>
          Save Data
        </button>

        <hr />
        <h5 className="mt-4">Approved Data Delivered To You</h5>
        {approvedData.length === 0 && <p className="text-muted">No approved data available</p>}
        {approvedData.map((item) => (
          <div key={item.consent._id} className="card mb-2">
            <div className="card-body">
              <h6 className="card-title">From: {item.consent.dataOwner?.name || item.consent.dataOwner}</h6>
              <p className="card-subtitle mb-2 text-muted">Type: {item.consent.dataType}</p>
              <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(item.data, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
