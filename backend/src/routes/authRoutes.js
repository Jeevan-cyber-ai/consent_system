const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");
const auth = require("../middleware/authMiddleware");

// handle multipart uploads for profile image and resume
const multer = require("multer");
const fs = require("fs");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, unique + "-" + file.originalname);
	}
});

const upload = multer({ storage });

// accept fields: image, resume
router.post("/register", upload.fields([{ name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 }]), authController.register);
router.post("/login", authController.login);

router.get("/users", auth, authController.getUsers);
router.get("/me", auth, authController.getMe);

module.exports = router;
