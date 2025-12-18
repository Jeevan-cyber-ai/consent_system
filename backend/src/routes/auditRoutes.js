const express = require("express");
const router = express.Router();
const auditController = require("../controllers/auditcontroller");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", auth, role("admin"), auditController.getLogs);
router.get("/me", auth, auditController.getMyLogs);

module.exports = router;
