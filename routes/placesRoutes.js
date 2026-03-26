const express = require("express");
const router = express.Router();

const {
  getPlaces,
  getPlaceBySlug,
} = require("../controllers/placesController");

// GET ALL PLACES
router.get("/", getPlaces);

// GET ONE PLACE BY SLUG
router.get("/:slug", getPlaceBySlug);

module.exports = router;
