const places = require("../data/places");

const getCategories = (req, res) => {
  const categories = [...new Set(places.map((place) => place.category))];

  res.status(200).json(categories);
};

const getRegions = (req, res) => {
  const regions = [...new Set(places.map((place) => place.region))];

  res.status(200).json(regions);
};

const getFeaturedPlaces = (req, res) => {
  const featuredPlaces = places.filter((place) => place.featured === true);

  res.status(200).json(featuredPlaces);
};


module.exports = {
  getCategories,
  getRegions,
  getFeaturedPlaces,
};

