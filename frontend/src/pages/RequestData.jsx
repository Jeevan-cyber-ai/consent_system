import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function RequestData() {
  const [dataOwner, setDataOwner] = useState("");
  const [dataType, setDataType] = useState("location");
  const [msg, setMsg] = useState("");
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/auth/users").then((res) => setUsers(res.data)).catch(()=>{});
  }, []);

  const requestConsent = async () => {
    try {
      await api.post("/consent/request", {
        dataOwner,
        dataType
      });
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Consent request sent", variant: "success" } }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Request failed", variant: "danger" } }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4 col-md-6">
        <h4>Request Data</h4>

        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Search users by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="form-select mb-2"
          value={dataOwner}
          onChange={(e) => setDataOwner(e.target.value)}
        >
          <option value="">Select data owner</option>
          {users
            .filter((u) => {
              if (!query) return true;
              const q = query.toLowerCase();
              return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
            })
            .map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
        </select>

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

        <button className="btn btn-warning" onClick={requestConsent}>
          Request Consent
        </button>
      </div>
    </>
  );
}
