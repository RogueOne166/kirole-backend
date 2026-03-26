const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoritesController");

router.get("/", protect, getFavorites);
router.post("/places/:placeId", protect, addFavorite);
router.delete("/places/:placeId", protect, removeFavorite);

module.exports = router;
