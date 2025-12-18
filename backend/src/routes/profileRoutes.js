const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profilecontroller");
const auth = require("../middleware/authMiddleware");

// GET /api/profile/:id  - returns profile if owner or approved consent exists
router.get("/:id", auth, profileController.getProfile);

module.exports = router;
