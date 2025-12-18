import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const ensureUser = async () => {
      if (!token) return;
      const user = localStorage.getItem("user");
      if (!user) {
        setLoading(true);
        try {
          const res = await api.get("/auth/me");
          if (mounted) localStorage.setItem("user", JSON.stringify(res.data));
        } catch (e) {
          localStorage.removeItem("token");
        }
        if (mounted) setLoading(false);
      }
    };

    ensureUser();
    return () => (mounted = false);
  }, [token]);

  if (!token) return <Navigate to="/" replace />;
  if (loading) return null;

  return children;
}
