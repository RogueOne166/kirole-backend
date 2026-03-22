const places = require("../data/places");
const events = require("../data/events");

const getHomeData = (req, res) => {
  const featured = places.filter((place) => place.featured === true);

  const categories = [...new Set(places.map((place) => place.category))].sort();

  const regions = [...new Set(places.map((place) => place.region))].sort();

  res.status(200).json({
    featured,
    categories,
    regions,
    events,
  });
};

module.exports = {
  getHomeData,
};
