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
  requireAuth,
  requireOrganizer,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.get("/search", searchEvents);
router.get("/popular", getPopularEvents);
router.get("/my-events", requireAuth, requireOrganizer, getMyEvents);
router.get("/slug/:slug", getEventBySlug);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", requireAuth, requireOrganizer, createEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

router.put("/approve/:id", requireAuth, requireAdmin, approveEvent);
router.put("/reject/:id", requireAuth, requireAdmin, rejectEvent);

module.exports = router;
