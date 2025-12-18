import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import MyData from "./pages/MyData";
import RequestData from "./pages/RequestData";
import MyConsents from "./pages/MyConsents";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationToast from "./components/NotificationToast";
import Toast from "./components/Toast";
import RequestsToMe from "./pages/RequestsToMe";
import Profile from "./pages/Profile";
import AuditLogs from "./pages/AuditLogs";

export default function App() {
  return (
    <BrowserRouter>
      <NotificationToast />
      <Toast />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />

        
        <Route path="/consents" element={ <ProtectedRoute> <MyConsents /> </ProtectedRoute> } />
        <Route
          path="/my-data"
          element={
            <ProtectedRoute>
              <MyData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request"
          element={
            <ProtectedRoute>
              <RequestData />
            </ProtectedRoute>
          }
        />

       

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
         <Route
  path="/requests-to-me"
  element={
    <ProtectedRoute>
      <RequestsToMe />
    </ProtectedRoute>
  }
/>
      </Routes>
     

    </BrowserRouter>
  );
}