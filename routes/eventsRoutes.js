const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventBySlug,
} = require("../controllers/eventsController");

// GET ALL EVENTS
router.get("/", getEvents);

// GET ONE EVENT BY SLUG
router.get("/:slug", getEventBySlug);

module.exports = router;
