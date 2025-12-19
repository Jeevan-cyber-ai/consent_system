import { useState } from "react";
import { registerUser } from "./authService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
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
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (image) fd.append("image", image);
      if (resume) fd.append("resume", resume);
      await registerUser(fd);
      setMessage("Registration successful. Please login.");
    } catch (err) {
      setMessage("Registration failed");
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={styles.registerBox}>
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4 fw-bold text-dark">Create Account</h2>
                <p className="text-center text-muted mb-4">Join our consent-based data system</p>

                {message && (
                  <div className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"} text-center`}>
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

                  <button className="btn btn-success btn-lg w-100 shadow-sm fw-bold mb-3" style={styles.actionBtn}>
                    Register Now
                  </button>
                </form>

                <div className="text-center mt-2">
                  <span className="text-muted small">Already have an account? </span>
                  <a href="/" className="text-decoration-none small fw-bold text-primary">Login here</a>
                </div>

                {message && message.includes("successful") && (
                  <div className="mt-3">
                    <a href="/" className="btn btn-primary w-100 fw-bold">Proceed to Login</a>
                  </div>
                )}
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  actionBtn: {
    borderRadius: "10px",
    padding: "12px",
  }
};