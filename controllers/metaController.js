const Place = require("../models/Place");

const getCategories = async (req, res) => {
  try {
    const categories = await Place.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch categories",
      details: error.message,
    });
  }
};

const getRegions = async (req, res) => {
  try {
    const regions = await Place.distinct("region");
    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch regions",
      details: error.message,
    });
  }
};

const getMetaData = async (req, res) => {
  try {
    const categories = await Place.distinct("category");
    const regions = await Place.distinct("region");

    res.status(200).json({
      categories,
      regions,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch meta data",
      details: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getRegions,
  getMetaData,
};
