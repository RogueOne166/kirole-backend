const Place = require("../models/Place");

// GET ALL PLACES
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
};

// GET PLACE BY SLUG
const getPlaceBySlug = async (req, res) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug });

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place" });
  }
};

module.exports = {
  getPlaces,
  getPlaceBySlug,
};
