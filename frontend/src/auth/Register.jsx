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
    <div className="container mt-5 col-md-4">
      <h3 className="text-center">Register</h3>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="linkedin"
          placeholder="LinkedIn URL"
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          name="course"
          placeholder="Course (e.g., B.Sc Computer Science)"
          onChange={handleChange}
        />

        {/* dept removed per request */}

        <input
          className="form-control mb-3"
          name="collegeName"
          placeholder="College / University"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="domain"
          placeholder="Domain / Specialization"
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          name="description"
          placeholder="Short description / summary"
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          name="bio"
          placeholder="Short bio"
          onChange={handleChange}
        />

        <label className="form-label">Profile image</label>
        <input className="form-control mb-3" type="file" accept="image/*" onChange={(e)=>setImage(e.target.files[0])} />

        <label className="form-label">Resume (pdf)</label>
        <input className="form-control mb-3" type="file" accept="application/pdf" onChange={(e)=>setResume(e.target.files[0])} />

        <button className="btn btn-success w-100">
          Register
        </button>
      </form>
      {message && message.includes("Registration successful") && (
        <div className="mt-3">
          <a href="/" className="btn btn-primary w-100">Proceed to Login</a>
        </div>
      )}
    </div>
  );
}
