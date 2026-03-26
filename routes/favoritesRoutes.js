const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoritesController");

// GET ALL FAVORITES
router.get("/", protect, getFavorites);

// ADD FAVORITE
router.post("/places/:placeId", protect, addFavorite);

// REMOVE FAVORITE
router.delete("/places/:placeId", protect, removeFavorite);

module.exports = router;
