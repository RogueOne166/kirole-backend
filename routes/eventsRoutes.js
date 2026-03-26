const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventBySlug,
} = require("../controllers/eventsController");

router.get("/", getEvents);
router.get("/:slug", getEventBySlug);

module.exports = router;
