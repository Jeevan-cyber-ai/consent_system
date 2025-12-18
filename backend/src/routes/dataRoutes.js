const express = require("express");
const router = express.Router();
const dataController = require("../controllers/datacontroller");
const auth = require("../middleware/authMiddleware");
const consentCheck = require("../middleware/consentMiddleware");

router.post("/", auth, dataController.createData);
// route expects ownerId and data type: /api/data/:ownerId/:type
router.get("/:ownerId/:type", auth, consentCheck, dataController.getData);

module.exports = router;
