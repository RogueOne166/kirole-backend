const Place = require("../models/Place");
const Event = require("../models/Event");

const getHomeData = async (req, res) => {
  try {
    const featured = await Place.find({ featured: true }).limit(6);
    const categories = await Place.distinct("category");
    const regions = await Place.distinct("region");
    const events = await Event.find({ status: "approved" })
      .sort({ date: 1, time: 1 })
      .limit(6);

    res.status(200).json({
      featured,
      categories,
      regions,
      events,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch home data",
      details: error.message,
    });
  }
};

module.exports = { getHomeData };
