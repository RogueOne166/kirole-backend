const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  getPopularEvents,
  getEventBySlug,
  getMyEvents,
  approveEvent,
  rejectEvent,
} = require("../controllers/eventsController");

const {
  protect,
  adminOnly,
  organizerOnly,
} = require("../middleware/authMiddleware");

router.get("/search", searchEvents);
router.get("/popular", getPopularEvents);
router.get("/my-events", protect, organizerOnly, getMyEvents);
router.get("/slug/:slug", getEventBySlug);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", protect, organizerOnly, createEvent);
router.put("/:id", protect, organizerOnly, updateEvent);
router.delete("/:id", protect, organizerOnly, deleteEvent);

router.put("/approve/:id", protect, adminOnly, approveEvent);
router.put("/reject/:id", protect, adminOnly, rejectEvent);

module.exports = router;
