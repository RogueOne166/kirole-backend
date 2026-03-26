const User = require("../models/User");
const Place = require("../models/Place");

// GET FAVORITES
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

// ADD FAVORITE
const addFavorite = async (req, res) => {
  try {
    const { placeId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(placeId)) {
      user.favorites.push(placeId);
      await user.save();
    }

    res.json({ message: "Added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

// REMOVE FAVORITE
const removeFavorite = async (req, res) => {
  try {
    const { placeId } = req.params;

    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== placeId
    );

    await user.save();

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
