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
} = require("../controllers/eventsController");

router.get("/search", searchEvents);
router.get("/popular", getPopularEvents);
router.get("/slug/:slug", getEventBySlug); 
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
