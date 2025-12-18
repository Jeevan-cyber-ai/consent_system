const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationcontroller");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, notificationController.getNotifications);
router.put("/:id/read", auth, notificationController.markAsRead);

module.exports = router;
