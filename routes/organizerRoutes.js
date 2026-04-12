const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getOrganizerDashboard } = require("../controllers/organizerController");

router.get("/dashboard", protect, getOrganizerDashboard);

module.exports = router;
