// src/app.js

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Route imports
const authRoutes = require("./routes/authRoutes");
const consentRoutes = require("./routes/consentRoutes");
const dataRoutes = require("./routes/dataRoutes");
const auditRoutes = require("./routes/auditRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");


const app = express();


app.use(express.json());           // Parse JSON body
app.use(cors());                   // Enable CORS
app.use(helmet());                 // Secure headers
app.use(morgan("dev"));            // Log HTTP requests

// serve uploaded files (profile images, resumes)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use("/api/auth", authRoutes);
app.use("/api/consent", consentRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Consent-Aware Data Sharing System API is running"
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
