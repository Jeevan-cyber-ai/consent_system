import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/audit/me").then((res) => setLogs(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4>Audit Logs</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Resource</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{l.action}</td>
                <td>{l.resource || (l.details && JSON.stringify(l.details))}</td>
                <td>{new Date(l.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
