const Place = require("../models/Place");

// GET ALL PLACES
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    console.error("getPlaces error:", error);
    res.status(500).json({
      error: "Failed to fetch places",
      details: error.message,
    });
  }
};

// GET PLACE BY SLUG OR ID
const getPlaceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let place = await Place.findOne({ slug });

    if (!place && /^[0-9a-fA-F]{24}$/.test(slug)) {
      place = await Place.findById(slug);
    }

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    console.error("getPlaceBySlug error:", error);
    res.status(500).json({
      error: "Failed to fetch place",
      details: error.message,
    });
  }
};

module.exports = {
  getPlaces,
  getPlaceBySlug,
};
