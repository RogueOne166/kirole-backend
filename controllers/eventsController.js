const Event = require("../models/Event");

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// GET EVENT BY SLUG (optional but useful)
const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

module.exports = {
  getEvents,
  getEventBySlug,
};
