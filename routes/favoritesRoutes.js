const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getFavorites,
  addFavoritePlace,
  removeFavoritePlace,
  addFavoriteEvent,
  removeFavoriteEvent,
} = require("../controllers/favoritesController");

router.get("/", protect, getFavorites);

// places
router.post("/places/:placeId", protect, addFavoritePlace);
router.delete("/places/:placeId", protect, removeFavoritePlace);

// events
router.post("/events/:eventId", protect, addFavoriteEvent);
router.delete("/events/:eventId", protect, removeFavoriteEvent);

module.exports = router;
