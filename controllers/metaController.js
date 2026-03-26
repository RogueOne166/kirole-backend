const Place = require("../models/Place");

const getCategories = async (req, res) => {
  try {
    const categories = await Place.distinct("category");
    res.status(200).json(categories.filter(Boolean));
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({
      error: "Failed to fetch categories",
      details: error.message,
    });
  }
};

const getRegions = async (req, res) => {
  try {
    const regions = await Place.distinct("region");
    res.status(200).json(regions.filter(Boolean));
  } catch (error) {
    console.error("getRegions error:", error);
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
      categories: categories.filter(Boolean),
      regions: regions.filter(Boolean),
    });
  } catch (error) {
    console.error("getMetaData error:", error);
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
