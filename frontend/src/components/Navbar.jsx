import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <span className="navbar-brand">Consent System</span>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/profile">Profile</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/request">Request Data</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/notifications">Notifications</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/audit-logs">Audit Logs</Link>
          </li>
        </ul>

        <button className="btn btn-outline-light" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
