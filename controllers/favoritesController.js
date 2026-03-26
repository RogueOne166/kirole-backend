const User = require("../models/User");
const Place = require("../models/Place");

// GET FAVORITES
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error("getFavorites error:", error);
    res.status(500).json({
      message: "Failed to fetch favorites",
      details: error.message,
    });
  }
};

// ADD FAVORITE
const addFavorite = async (req, res) => {
  try {
    const { placeId } = req.params;

    const user = await User.findById(req.user.id);
    const place = await Place.findById(placeId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const alreadyExists = user.favorites.some(
      (id) => id.toString() === placeId
    );

    if (!alreadyExists) {
      user.favorites.push(placeId);
      await user.save();
    }

    res.status(200).json({ message: "Added to favorites" });
  } catch (error) {
    console.error("addFavorite error:", error);
    res.status(500).json({
      message: "Failed to add favorite",
      details: error.message,
    });
  }
};

// REMOVE FAVORITE
const removeFavorite = async (req, res) => {
  try {
    const { placeId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== placeId
    );

    await user.save();

    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("removeFavorite error:", error);
    res.status(500).json({
      message: "Failed to remove favorite",
      details: error.message,
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
