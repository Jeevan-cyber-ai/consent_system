import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function MyConsents() {
  const [consents, setConsents] = useState([]);

  useEffect(() => {
    api.get("/consent/my-consents").then((res) => {
      setConsents(res.data);
    });
  }, []);

  const revokeConsent = async (id) => {
    await api.put(`/consent/revoke/${id}`);
    setConsents(consents.filter((c) => c._id !== id));
  };
  const approveConsent = async (id) => {
  const res = await api.put(`/consent/approve/${id}`);
  setConsents(consents.map(c => c._id === id ? res.data : c));
};

const rejectConsent = async (id) => {
  const res = await api.put(`/consent/reject/${id}`);
  setConsents(consents.map(c => c._id === id ? res.data : c));
};


  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4>My Consents</h4>

        <table className="table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Data Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
         <tbody>
  {consents.map((c) => (
    <tr key={c._id}>
      <td>{c.requester?.name}</td>
      <td>{c.dataType}</td>
      <td>{c.status}</td>
      <td>
        {c.status === "approved" && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => revokeConsent(c._id)}
          >
            Revoke
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </>
  );
}
