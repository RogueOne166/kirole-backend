const express = require("express");
const router = express.Router();

const {
  getPlaces,
  getPlaceBySlug,
} = require("../controllers/placesController");

router.get("/", getPlaces);
router.get("/:slug", getPlaceBySlug);

module.exports = router;
