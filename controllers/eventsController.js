const events = require("../data/events");

const getAllEvents = (req, res) => {
  const { region, category, upcoming, page = 1, limit = 5 } = req.query;

  let filteredEvents = [...events];

  if (region) {
    filteredEvents = filteredEvents.filter(
      (event) => event.region.toLowerCase() === region.toLowerCase()
    );
  }

  if (category) {
    filteredEvents = filteredEvents.filter(
      (event) => event.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (upcoming === "true") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });
  }

  filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const start = (pageNumber - 1) * limitNumber;
  const end = start + limitNumber;

  const paginated = filteredEvents.slice(start, end);

  res.status(200).json({
    total: filteredEvents.length,
    page: pageNumber,
    limit: limitNumber,
    data: paginated,
  });
};

const getEventById = (req, res) => {
  const id = Number(req.params.id);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.status(200).json(event);
};

const createEvent = (req, res) => {
  const {
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
    date,
    featured,
    image,
  } = req.body;

  if (
    !name ||
    !category ||
    !region ||
    !description ||
    latitude === undefined ||
    longitude === undefined ||
    !date
  ) {
    return res.status(400).json({
      error:
        "name, category, region, description, latitude, longitude, and date are required",
    });
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({
      error: "latitude and longitude must be valid numbers",
    });
  }

  const newEvent = {
    id: events.length ? events[events.length - 1].id + 1 : 1,
    name,
    category,
    region,
    description,
    latitude: lat,
    longitude: lng,
    price: price || "free",
    rating: rating !== undefined ? Number(rating) : 0,
    reviews: reviews !== undefined ? Number(reviews) : 0,
    audience: Array.isArray(audience) ? audience : ["tourists", "locals"],
    type: "event",
    date,
    featured: featured === true,
    image: image || "",
  };

  events.push(newEvent);

  res.status(201).json({
    message: "Event created successfully",
    data: newEvent,
  });
};

const updateEvent = (req, res) => {
  const id = Number(req.params.id);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const {
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
    date,
    featured,
    image,
  } = req.body;

  if (latitude !== undefined) {
    const lat = Number(latitude);
    if (Number.isNaN(lat)) {
      return res.status(400).json({ error: "latitude must be a valid number" });
    }
    event.latitude = lat;
  }

  if (longitude !== undefined) {
    const lng = Number(longitude);
    if (Number.isNaN(lng)) {
      return res.status(400).json({ error: "longitude must be a valid number" });
    }
    event.longitude = lng;
  }

  if (rating !== undefined) {
    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating)) {
      return res.status(400).json({ error: "rating must be a valid number" });
    }
    event.rating = parsedRating;
  }

  if (reviews !== undefined) {
    const parsedReviews = Number(reviews);
    if (Number.isNaN(parsedReviews)) {
      return res.status(400).json({ error: "reviews must be a valid number" });
    }
    event.reviews = parsedReviews;
  }

  if (audience !== undefined) {
    if (!Array.isArray(audience)) {
      return res.status(400).json({ error: "audience must be an array" });
    }
    event.audience = audience;
  }

  if (name !== undefined) event.name = name;
  if (category !== undefined) event.category = category;
  if (region !== undefined) event.region = region;
  if (description !== undefined) event.description = description;
  if (price !== undefined) event.price = price;
  if (date !== undefined) event.date = date;
  if (featured !== undefined) event.featured = featured;
  if (image !== undefined) event.image = image;

  res.status(200).json({
    message: "Event updated successfully",
    data: event,
  });
};

const deleteEvent = (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  const deletedEvent = events.splice(index, 1);

  res.status(200).json({
    message: "Event deleted successfully",
    data: deletedEvent[0],
  });
};

const searchEvents = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const query = q.toLowerCase();

  const results = events.filter((event) =>
    event.name.toLowerCase().includes(query) ||
    event.category.toLowerCase().includes(query) ||
    event.region.toLowerCase().includes(query) ||
    event.description.toLowerCase().includes(query)
  );

  res.status(200).json(results);
};

const getPopularEvents = (req, res) => {
  const limit = Number(req.query.limit) || 4;

  const popularEvents = [...events]
    .sort((a, b) => {
      if (b.rating === a.rating) {
        return b.reviews - a.reviews;
      }
      return b.rating - a.rating;
    })
    .slice(0, limit);

  res.status(200).json(popularEvents);
};

const getEventBySlug = (req, res) => {
  const { slug } = req.params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.status(200).json(event);
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
};
