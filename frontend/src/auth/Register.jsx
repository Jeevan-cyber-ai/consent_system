import { useState } from "react";
import { registerUser } from "./authService";
import { useNavigate, Link } from "react-router-dom"; // Added for navigation
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    linkedin: "",
    bio: "",
    course: "",
    collegeName: "",
    domain: "",
    description: ""
  });
  
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const fd = new FormData();
      
      // Append all text fields
      Object.keys(form).forEach((k) => {
        if (form[k]) fd.append(k, form[k]);
      });
      
      // Append files
      if (image) fd.append("image", image);
      if (resume) fd.append("resume", resume);

      await registerUser(fd);
      
      setIsError(false);
      setMessage("✅ Registration successful! Redirecting to login...");
      
      // Auto-redirect to login after 2 seconds
      setTimeout(() => navigate("/"), 2000); 
      
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="card shadow-lg border-0" style={styles.registerBox}>
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-2 fw-bold text-dark">Create Account</h2>
                <p className="text-center text-muted mb-4">Join our consent-based data system</p>

                {message && (
                  <div className={`alert ${isError ? "alert-danger" : "alert-success"} text-center animate__animated animate__fadeIn`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Basic Info */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input className="form-control shadow-sm" name="name" placeholder="John Doe" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Email</label>
                      <input className="form-control shadow-sm" type="email" name="email" placeholder="john@example.com" required onChange={handleChange} />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Password</label>
                      <input className="form-control shadow-sm" type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">LinkedIn URL</label>
                      <input className="form-control shadow-sm" name="linkedin" placeholder="linkedin.com/in/..." onChange={handleChange} />
                    </div>

                    {/* Academic Info */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">College / University</label>
                      <input className="form-control shadow-sm" name="collegeName" placeholder="University Name" onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Course</label>
                      <input className="form-control shadow-sm" name="course" placeholder="B.Tech, MBA, etc." onChange={handleChange} />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label small fw-bold">Domain / Specialization</label>
                      <input className="form-control shadow-sm" name="domain" placeholder="Full Stack, Data Science, etc." onChange={handleChange} />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label small fw-bold">Summary Description</label>
                      <textarea className="form-control shadow-sm" name="description" rows="2" placeholder="Briefly describe your background" onChange={handleChange} />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label small fw-bold">Short Bio</label>
                      <textarea className="form-control shadow-sm" name="bio" rows="2" placeholder="Tell us something about yourself" onChange={handleChange} />
                    </div>

                    {/* File Uploads */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Profile Image</label>
                      <input className="form-control form-control-sm shadow-sm" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label small fw-bold">Resume (PDF)</label>
                      <input className="form-control form-control-sm shadow-sm" type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])} />
                    </div>
                  </div>

                  <button 
                    disabled={loading} 
                    className="btn btn-success btn-lg w-100 shadow-sm fw-bold mb-3" 
                    style={styles.actionBtn}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    {loading ? "Registering..." : "Register Now"}
                  </button>
                </form>

                <div className="text-center mt-2">
                  <span className="text-muted small">Already have an account? </span>
                  <Link to="/" className="text-decoration-none small fw-bold text-primary">Login here</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    width: "100%",
  },
  registerBox: {
    borderRadius: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
  },
  actionBtn: {
    borderRadius: "10px",
    padding: "12px",
    transition: "all 0.3s ease"
  }
};