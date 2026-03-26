const Event = require("../models/Event");
const slugify = require("../utils/slugify");

const getAllEvents = async (req, res) => {
  try {
    const { region, category, upcoming, page = 1, limit = 10 } = req.query;

    const filter = { status: "approved" };

    if (region) filter.region = new RegExp(`^${region}$`, "i");
    if (category) filter.category = new RegExp(`^${category}$`, "i");

    let events = await Event.find(filter).sort({ date: 1, time: 1 });

    if (upcoming === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      events = events.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const start = (pageNumber - 1) * limitNumber;
    const paginated = events.slice(start, start + limitNumber);

    res.status(200).json({
      total: events.length,
      page: pageNumber,
      limit: limitNumber,
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch events",
      details: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.status !== "approved") {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch event",
      details: error.message,
    });
  }
};

const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      status: "approved",
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch event by slug",
      details: error.message,
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const user = req.user;

    const {
      title,
      category,
      region,
      description,
      latitude,
      longitude,
      price,
      rating,
      reviews,
      audience,
      date,
      time,
      location,
      featured,
      image,
    } = req.body;

    if (!title || !category || !region || !description || !date) {
      return res.status(400).json({
        error: "title, category, region, description, and date are required",
      });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const newEvent = new Event({
      title,
      slug,
      category,
      region,
      description,
      latitude: latitude !== undefined ? Number(latitude) : undefined,
      longitude: longitude !== undefined ? Number(longitude) : undefined,
      price: price || "free",
      rating: rating !== undefined ? Number(rating) : 0,
      reviews: reviews !== undefined ? Number(reviews) : 0,
      audience: Array.isArray(audience) ? audience : ["tourists", "locals"],
      date,
      time: time || "",
      location: location || "",
      featured: featured ?? false,
      image: image || "",
      organizerId: user.id,
      organizerName: user.companyName || user.name || "",
      status: user.role === "admin" ? "approved" : "pending",
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      message:
        user.role === "admin"
          ? "Event created successfully"
          : "Event submitted successfully and is pending approval",
      data: savedEvent,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create event",
      details: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const user = req.user;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const isOwner = event.organizerId?.toString() === user?.id;
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "Not authorized to update this event",
      });
    }

    const fields = [
      "title",
      "category",
      "region",
      "description",
      "date",
      "time",
      "location",
      "price",
      "image",
      "featured",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    if (req.body.latitude !== undefined) event.latitude = Number(req.body.latitude);
    if (req.body.longitude !== undefined) event.longitude = Number(req.body.longitude);
    if (req.body.rating !== undefined) event.rating = Number(req.body.rating);
    if (req.body.reviews !== undefined) event.reviews = Number(req.body.reviews);
    if (req.body.audience !== undefined && Array.isArray(req.body.audience)) {
      event.audience = req.body.audience;
    }

    if (req.body.title) {
      const baseSlug = slugify(req.body.title);
      let slug = baseSlug;
      let counter = 1;

      while (await Event.findOne({ slug, _id: { $ne: event._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
      }

      event.slug = slug;
    }

    if (!isAdmin) {
      event.status = "pending";
    }

    const updatedEvent = await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update event",
      details: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const user = req.user;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const isOwner = event.organizerId?.toString() === user?.id;
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "Not authorized to delete this event",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete event",
      details: error.message,
    });
  }
};

const searchEvents = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const results = await Event.find({
      status: "approved",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { region: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ],
    }).sort({ date: 1, time: 1 });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      error: "Failed to search events",
      details: error.message,
    });
  }
};

const getPopularEvents = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const events = await Event.find({ status: "approved" })
      .sort({ featured: -1, rating: -1, reviews: -1, date: 1 })
      .limit(limit);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch popular events",
      details: error.message,
    });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch organizer events",
      details: error.message,
    });
  }
};

const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "Event approved",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to approve event",
      details: error.message,
    });
  }
};

const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "Event rejected",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to reject event",
      details: error.message,
    });
  }
};

module.exports = {
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
};
