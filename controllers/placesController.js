const Place = require("../models/Place");

// Calculate the distance between 2 coordinates
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

// Get all places/activities
const getAllPlaces = async (req, res) => {
  try {
    const { category, region, type, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (region) {
      filter.region = new RegExp(`^${region}$`, "i");
    }

    if (type) {
      filter.type = new RegExp(`^${type}$`, "i");
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Place.countDocuments(filter);
    const places = await Place.find(filter).skip(skip).limit(limitNumber);

    res.status(200).json({
      total,
      page: pageNumber,
      limit: limitNumber,
      data: places,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch places",
      details: error.message,
    });
  }
};

// Get one place by MongoDB id
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch place",
      details: error.message,
    });
  }
};

// Create a new place/event/activity
const createPlace = async (req, res) => {
  try {
    const {
      name,
      slug,
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
      featured,
      image,
      date,
      time,
      location,
    } = req.body;

    if (
      !name?.trim() ||
      !category?.trim() ||
      !region?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        error: "name, category, region, and description must not be empty",
      });
    }

    if (price && price !== "free" && price !== "paid") {
      return res.status(400).json({
        error: 'price must be either "free" or "paid"',
      });
    }

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      return res.status(400).json({
        error: "latitude and longitude must be valid numbers",
      });
    }

    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
        return res.status(400).json({
          error: "rating must be a number between 0 and 5",
        });
      }
    }

    if (reviews !== undefined) {
      const parsedReviews = Number(reviews);
      if (Number.isNaN(parsedReviews) || parsedReviews < 0) {
        return res.status(400).json({
          error: "reviews must be a number greater than or equal to 0",
        });
      }
    }

    if (image !== undefined && !String(image).trim()) {
      return res.status(400).json({
        error: "image must not be empty",
      });
    }

    const newPlace = new Place({
      name,
      slug,
      category,
      region,
      description,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      price: price || "free",
      rating: rating !== undefined ? Number(rating) : 0,
      reviews: reviews !== undefined ? Number(reviews) : 0,
      audience: Array.isArray(audience) ? audience : ["locals", "tourists"],
      type: type || "place",
      featured: featured ?? false,
      image: image || "",
      date,
      time,
      location,
    });

    const savedPlace = await newPlace.save();

    res.status(201).json({
      message: "Place created successfully",
      data: savedPlace,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create place",
      details: error.message,
    });
  }
};

const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    const {
      name,
      slug,
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
      featured,
      image,
      date,
      time,
      location,
    } = req.body;

    if (latitude !== undefined) {
      const lat = Number(latitude);
      if (Number.isNaN(lat)) {
        return res.status(400).json({
          error: "latitude must be a valid number",
        });
      }
      place.latitude = lat;
    }

    if (longitude !== undefined) {
      const lng = Number(longitude);
      if (Number.isNaN(lng)) {
        return res.status(400).json({
          error: "longitude must be a valid number",
        });
      }
      place.longitude = lng;
    }

    if (price !== undefined && price !== "free" && price !== "paid") {
      return res.status(400).json({
        error: 'price must be either "free" or "paid"',
      });
    }

    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
        return res.status(400).json({
          error: "rating must be a number between 0 and 5",
        });
      }
      place.rating = parsedRating;
    }

    if (reviews !== undefined) {
      const parsedReviews = Number(reviews);
      if (Number.isNaN(parsedReviews) || parsedReviews < 0) {
        return res.status(400).json({
          error: "reviews must be a number greater than or equal to 0",
        });
      }
      place.reviews = parsedReviews;
    }

    if (audience !== undefined) {
      if (!Array.isArray(audience)) {
        return res.status(400).json({
          error: "audience must be an array",
        });
      }
      place.audience = audience;
    }

    if (name !== undefined) place.name = name;
    if (slug !== undefined) place.slug = slug;
    if (category !== undefined) place.category = category;
    if (region !== undefined) place.region = region;
    if (description !== undefined) place.description = description;
    if (price !== undefined) place.price = price;
    if (type !== undefined) place.type = type;
    if (featured !== undefined) place.featured = featured;
    if (image !== undefined) place.image = image;
    if (date !== undefined) place.date = date;
    if (time !== undefined) place.time = time;
    if (location !== undefined) place.location = location;

    const updatedPlace = await place.save();

    res.status(200).json({
      message: "Place updated successfully",
      data: updatedPlace,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update place",
      details: error.message,
    });
  }
};

const deletePlace = async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);

    if (!deletedPlace) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.status(200).json({
      message: "Place deleted successfully",
      data: deletedPlace,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete place",
      details: error.message,
    });
  }
};

const searchPlaces = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    const results = await Place.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { region: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      error: "Failed to search places",
      details: error.message,
    });
  }
};

// Find the nearest place
const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (lat === undefined || lng === undefined || radius === undefined) {
      return res.status(400).json({
        error: "lat, lng, and radius are required",
      });
    }

    const userLat = Number(lat);
    const userLng = Number(lng);
    const searchRadius = Number(radius);

    if (
      Number.isNaN(userLat) ||
      Number.isNaN(userLng) ||
      Number.isNaN(searchRadius)
    ) {
      return res.status(400).json({
        error: "lat, lng, and radius must be valid numbers",
      });
    }

    const places = await Place.find();

    const nearbyPlaces = places
      .map((place) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          place.latitude,
          place.longitude
        );

        return {
          ...place.toObject(),
          distance: Number(distance.toFixed(2)),
        };
      })
      .filter((place) => place.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(nearbyPlaces);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch nearby places",
      details: error.message,
    });
  }
};

const getTopRatedPlaces = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const topPlaces = await Place.find()
      .sort({ rating: -1, reviews: -1 })
      .limit(limit);

    res.status(200).json(topPlaces);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch top rated places",
      details: error.message,
    });
  }
};

const getPlaceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const place = await Place.findOne({ slug });

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch place by slug",
      details: error.message,
    });
  }
};

module.exports = {
  getAllPlaces,
  getPlaceById,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaces,
  getNearbyPlaces,
  getTopRatedPlaces,
};
