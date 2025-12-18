import { useEffect, useState } from "react";

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now();
      setToasts((t) => [...t, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, e.detail.duration || 4000);
    };

    window.addEventListener("app-toast", handler);
    return () => window.removeEventListener("app-toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1060 }}>
      {toasts.map((t) => (
        <div key={t.id} className={`toast show bg-${t.variant || "info"} text-white mb-2`}>
          <div className="toast-body">{t.message}</div>
        </div>
      ))}
    </div>
  );
}
