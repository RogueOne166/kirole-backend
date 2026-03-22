const express = require("express");
const router = express.Router();

const {
  getCategories,
  getRegions,
  getFeaturedPlaces,
} = require("../controllers/metaController");

router.get("/categories", getCategories);
router.get("/regions", getRegions);
router.get("/featured", getFeaturedPlaces);

module.exports = router;

