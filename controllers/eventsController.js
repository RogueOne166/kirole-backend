const Event = require("../models/Event");

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
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

    if (!event && /^[0-9a-fA-F]{24}$/.test(slug)) {
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

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const {
      title,
      name,
      category,
      region,
      description,
      latitude,
      longitude,
      price,
      rating,
      reviews,
      audience,
      type,
      date,
      featured,
      image,
      location,
      status,
      ticketsSold,
      slug,
    } = req.body;

    const eventTitle = title || name;

    if (!eventTitle) {
      return res.status(400).json({ message: "Event title is required" });
    }

    const newEvent = await Event.create({
      title: eventTitle,
      name: eventTitle,
      category: category || "event",
      region: region || "",
      description: description || "",
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      price: price || "free",
      rating: rating ?? 0,
      reviews: reviews ?? 0,
      audience: Array.isArray(audience) ? audience : [],
      type: type || "event",
      date: date || "",
      featured: featured ?? false,
      image: image || "",
      location: location || region || "",
      status: status || "Draft",
      ticketsSold: ticketsSold ?? 0,
      slug: slug || undefined,
      organizerId: req.user.id,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("createEvent error:", error);
    res.status(500).json({
      error: "Failed to create event",
      details: error.message,
    });
  }
};

// GET LOGGED-IN ORGANIZER EVENTS
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("getMyEvents error:", error);
    res.status(500).json({
      error: "Failed to fetch organizer events",
      details: error.message,
    });
  }
};

module.exports = {
  getEvents,
  getEventBySlug,
  createEvent,
  getMyEvents,
};
