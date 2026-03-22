const places = require("../data/places");

//Calculate the distance of the distance between 2 coordinates
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
const getAllPlaces = (req, res) => {
  const { category, region, type, page = 1, limit = 10 } = req.query;

  let filteredPlaces = [...places];

  if (category) {
    filteredPlaces = filteredPlaces.filter(
      (place) => place.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (region) {
    filteredPlaces = filteredPlaces.filter(
      (place) => place.region.toLowerCase() === region.toLowerCase()
    );
  }

  if (type) {
    filteredPlaces = filteredPlaces.filter(
      (place) => place.type.toLowerCase() === type.toLowerCase()
    );
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const start = (pageNumber - 1) * limitNumber;
  const end = start + limitNumber;

  const paginated = filteredPlaces.slice(start, end);

  res.status(200).json({
    total: filteredPlaces.length,
    page: pageNumber,
    limit: limitNumber,
    data: paginated,
  });
};

// Get one place by id
const getPlaceById = (req, res) => {
  const id = Number(req.params.id);
  const place = places.find((p) => p.id === id);

  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  res.status(200).json(place);
};

// Create a new place/event/activity
const createPlace = (req, res) => {
  const {
    name,
    category,
    region,
    description,
    latitude,
    longitude,
    price,
    audience,
    type,
    date,
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

if (image !== undefined && !image.trim()) {
  return res.status(400).json({
    error: "image must not be empty",
  });
}

  const newPlace = {
    id: places.length ? places[places.length - 1].id + 1 : 1,
    name,
    category,
    region,
    description: description || "",
    latitude: lat,
    longitude: lng,
    price: price || "unknown",
    audience: Array.isArray(audience) ? audience : ["locals", "tourists"],
    type,
  };

  if (type === "event" && date) {
    newPlace.date = date;
  }

  places.push(newPlace);

  res.status(201).json({
    message: "Place created successfully",
    data: newPlace,
  });
};

const updatePlace = (req, res) => {
  const id = Number(req.params.id);
  const place = places.find((p) => p.id === id);

  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  const {
    name,
    category,
    region,
    description,
    latitude,
    longitude,
    price,
    audience,
    type,
    date,
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

  if (type !== undefined) {
    if (type !== "place" && type !== "event") {
      return res.status(400).json({
        error: 'type must be either "place" or "event"',
      });
    }

    place.type = type;
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
  if (category !== undefined) place.category = category;
  if (region !== undefined) place.region = region;
  if (description !== undefined) place.description = description;
  if (price !== undefined) place.price = price;

  if (date !== undefined) {
    if (place.type === "event") {
      place.date = date;
    } else {
      delete place.date;
    }
  }

  if (place.type !== "event") {
    delete place.date;
  }

  res.status(200).json({
    message: "Place updated successfully",
    data: place,
  });
};

const deletePlace = (req, res) => {
  const id = Number(req.params.id);
  const index = places.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Place not found" });
  }

  const deletedPlace = places.splice(index, 1);

  res.status(200).json({
    message: "Place deleted successfully",
    data: deletedPlace[0],
  });
};

const searchPlaces = (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      error: "Search query is required"
    });
  }

  const q = query.toLowerCase();

  const results = places.filter((place) =>
    place.name.toLowerCase().includes(q) ||
    place.category.toLowerCase().includes(q) ||
    place.region.toLowerCase().includes(q) ||
    place.description.toLowerCase().includes(q)
  );

  res.status(200).json(results);
};

//find the nearest place
const getNearbyPlaces = (req, res) => {
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

  const nearbyPlaces = places
    .map((place) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        place.latitude,
        place.longitude
      );

      return {
        ...place,
        distance: Number(distance.toFixed(2)),
      };
    })
    .filter((place) => place.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance);

  res.status(200).json(nearbyPlaces);
};

const getTopRatedPlaces = (req, res) => {
  const limit = Number(req.query.limit) || 6;

  const topPlaces = [...places]
    .sort((a, b) => {
      if (b.rating === a.rating) {
        return b.reviews - a.reviews;
      }
      return b.rating - a.rating;
    })
    .slice(0, limit);

  res.status(200).json(topPlaces);
};

const getPlaceBySlug = (req, res) => {
  const { slug } = req.params;
  const place = places.find((p) => p.slug === slug);

  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  res.status(200).json(place);
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


