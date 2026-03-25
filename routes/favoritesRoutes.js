const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const {
  getFavorites,
  addFavoritePlace,
  removeFavoritePlace,
  addFavoriteEvent,
  removeFavoriteEvent,
} = require("../controllers/favoritesController");

router.get("/", requireAuth, getFavorites);

// places
router.post("/places/:placeId", requireAuth, addFavoritePlace);
router.delete("/places/:placeId", requireAuth, removeFavoritePlace);

// events
router.post("/events/:eventId", requireAuth, addFavoriteEvent);
router.delete("/events/:eventId", requireAuth, removeFavoriteEvent);

module.exports = router;
