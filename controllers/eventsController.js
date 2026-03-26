const Event = require("../models/Event");

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("getEvents error:", error);
    res.status(500).json({
      error: "Failed to fetch events",
      details: error.message,
    });
  }
};

// GET EVENT BY SLUG OR ID
const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let event = await Event.findOne({ slug });

    if (!event && slug.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(slug);
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("getEventBySlug error:", error);
    res.status(500).json({
      error: "Failed to fetch event",
      details: error.message,
    });
  }
};

module.exports = {
  getEvents,
  getEventBySlug,
};
