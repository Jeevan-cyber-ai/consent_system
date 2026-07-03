import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function RequestsToMe() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/consent/requests-to-me")
      .then(res => setRequests(res.data));
  }, []);

  const approve = async (id) => {
    await api.put(`/consent/approve/${id}`);
    setRequests(prev => prev.filter(r => r._id !== id));
  };

  const reject = async (id) => {
    await api.put(`/consent/reject/${id}`);
    setRequests(prev => prev.filter(r => r._id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4>Consent Requests To Me</h4>

        {requests.length === 0 && (
          <p className="text-muted">No pending requests</p>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Data Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td>{r.requester.name}</td>
                <td>{r.dataType}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => approve(r._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => reject(r._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}


