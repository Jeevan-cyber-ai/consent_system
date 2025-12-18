const express = require("express");
const router = express.Router();
const consentController = require("../controllers/consentcontroller");
const auth = require("../middleware/authMiddleware");
router.get("/requests-to-me", auth, consentController.requestsToMe);
router.get("/my-requests", auth, consentController.myRequests);
router.get("/my-consents", auth, consentController.myConsents);

router.put("/approve/:id", auth, consentController.approveConsent);
router.put("/reject/:id", auth, consentController.rejectConsent);
router.put("/revoke/:id", auth, consentController.revokeConsent);
router.post("/request", auth, consentController.requestConsent);


module.exports = router;
