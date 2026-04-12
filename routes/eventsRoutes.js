const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getEvents,
  getEventBySlug,
  createEvent,
  getMyEvents,
} = require("../controllers/eventsController");

router.get("/", getEvents);
router.get("/my-events", protect, getMyEvents);
router.get("/:slug", getEventBySlug);
router.post("/", protect, createEvent);

module.exports = router;
