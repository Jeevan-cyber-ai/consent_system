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

const path = require('path');


const app = express();

// 2. Fix for Static Files (the uploads folder)
app.use('/uploads', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
}, express.static(path.join(__dirname, '..', 'uploads')));
console.log("Serving images from:", path.join(__dirname, 'uploads'));

app.use(express.json());           // Parse JSON body
app.use(cors({ origin: "http://localhost:5173", credentials: true }));                   // Enable CORS
               // Secure headers
app.use(morgan("dev"));            // Log HTTP requests
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Fixes the blocked image
    contentSecurityPolicy: false, // Fixes the 'default-src none' error
  })
);


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
