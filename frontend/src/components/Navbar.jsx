import { NavLink, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Required for mobile toggle

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top" style={styles.navbarCustom}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/dashboard">
          <div className="bg-primary rounded-circle d-inline-block me-2" style={{width: '32px', height: '32px', textAlign: 'center', lineHeight: '32px'}}>
            <span style={{fontSize: '18px'}}>🛡️</span>
          </div>
          ConsentHub
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links Container */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active fw-bold" : "nav-link"} to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active fw-bold" : "nav-link"} to="/profile">
                My Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active fw-bold" : "nav-link"} to="/request">
                Request Access
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active fw-bold" : "nav-link"} to="/consents">
               Consents
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active fw-bold" : "nav-link"} to="/my-data">
                Shared with Me
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active fw-bold" : "nav-link"} to="/notifications">
                Notifications
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active fw-bold" : "nav-link"} to="/audit-logs">
                Activity Logs
              </NavLink>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-light btn-sm px-4 rounded-pill" onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbarCustom: {
    background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)", // Deep midnight blue gradient
    padding: "0.8rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },
  logoutBtn: {
    transition: "all 0.3s ease",
    fontWeight: "500"
  }
};