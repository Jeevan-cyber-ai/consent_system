import { useState } from "react";
import { loginUser } from "./authService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      // It's better to use useNavigate() from react-router-dom, 
      // but keeping your logic for now:
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-lg p-4 border-0" style={styles.loginBox}>
          <div className="card-body">
            <h2 className="text-center mb-4 fw-bold text-dark">Welcome </h2>
            <p className="text-center text-muted mb-4">Please enter your details to login</p>

            {error && <div className="alert alert-danger text-center py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="a form-label small fw-bold">Email</label>
                <input
                  className="form-control form-control-lg shadow-sm"
                  style={styles.inputField}
                  type="email"
                  placeholder="name@gmail.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Password</label>
                <input
                  className="form-control form-control-lg shadow-sm"
                  style={styles.inputField}
                  type="password"
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="btn btn-primary btn-lg w-100 shadow-sm fw-bold mb-3" style={styles.loginBtn}>
                Login
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="text-muted small">Don't have an account? </span>
              <a href="/register" className="text-decoration-none small fw-bold text-primary">
                Create account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Styles
const styles = {
  pageBackground: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Modern Purple/Blue gradient
    minHeight: "100vh",
    width: "100%",
  },
  loginBox: {
    maxWidth: "450px",
    width: "100%",
    borderRadius: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly translucent white
  },
  inputField: {
    borderRadius: "8px",
    fontSize: "1rem",
  },
  loginBtn: {
    borderRadius: "8px",
    padding: "12px",
    transition: "transform 0.2s",
  }
};