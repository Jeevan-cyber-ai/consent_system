import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Notifications() {
  const [requests, setRequests] = useState([]);
  const [me, setMe] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  });

  const loadPending = async () => {
    try {
      // ensure we have current user
      let current = me;
      if (!current) {
        const r = await api.get('/auth/me');
        current = r.data;
        localStorage.setItem('user', JSON.stringify(current));
        setMe(current);
      }

      // fetch pending requests for this owner
      const res = await api.get('/consent/requests-to-me');
      const pending = (res.data || []).filter((c) => c.status === 'pending');
      setRequests(pending);
    } catch (e) {
      setRequests([]);
    }
  };

  useEffect(() => {
    loadPending();

    const handler = async (e) => {
      // on socket notification, refresh pending list (keeps source-of-truth from server)
      await loadPending();
    };

    window.addEventListener('socket-notification', handler);
    return () => window.removeEventListener('socket-notification', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (consentId) => {
    try {
      await api.put(`/consent/approve/${consentId}`);
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Approved", variant: "success" } }));
      await loadPending();
    } catch (e) {
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Approve failed", variant: "danger" } }));
    }
  };

  const reject = async (consentId) => {
    try {
      await api.put(`/consent/reject/${consentId}`);
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Rejected", variant: "warning" } }));
      await loadPending();
    } catch (e) {
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Reject failed", variant: "danger" } }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4>Pending Consent Requests To Me</h4>

        {requests.length === 0 && <p className="text-muted">No pending requests</p>}

        <table className="table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Data Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.requester?.name} ({r.requester?.email})</td>
                <td>{r.dataType}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => approve(r._id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => reject(r._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
