import { useEffect } from "react";
import socket from "../socket/socket";

// small helper to decode JWT payload
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    return JSON.parse(atob(parts[1]));
  } catch (e) {
    return null;
  }
};

const NotificationToast = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // join user room if token present
    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);
    if (decoded && decoded.id) {
      socket.emit("join", decoded.id);
    }

    socket.on("notification", (data) => {
      // only forward notifications intended for this user
      const myId = decoded && decoded.id ? String(decoded.id) : null;
      const payloadUser = data && data.user && data.user._id ? String(data.user._id) : String(data && data.user);
      if (myId && payloadUser && myId !== payloadUser) return; // ignore others

      // forward as a global toast
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: data.message || data.title, variant: "info" } }));
      // also emit a window event so notification lists can update in real-time
      window.dispatchEvent(new CustomEvent("socket-notification", { detail: data }));
    });

    socket.on("data-delivery", (data) => {
      // forward to app (some pages will listen)
      window.dispatchEvent(new CustomEvent("data-delivery", { detail: data }));
      // also notify user
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: `Data delivered: ${data.dataType}`, variant: "success" } }));
    });

    return () => {
      socket.off("notification");
      socket.off("data-delivery");
    };
  }, []);

  return null;
};

export default NotificationToast;
