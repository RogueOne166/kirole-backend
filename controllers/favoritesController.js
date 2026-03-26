const User = require("../models/User");
const Place = require("../models/Place");
const Event = require("../models/Event");

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favoritePlaces")
      .populate("favoriteEvents");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      places: user.favoritePlaces,
      events: user.favoriteEvents,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch favorites",
      details: error.message,
    });
  }
};

const addFavoritePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const user = await User.findById(req.user.id);
    const place = await Place.findById(placeId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    const exists = user.favoritePlaces.some((id) => id.toString() === placeId);

    if (!exists) {
      user.favoritePlaces.push(placeId);
      await user.save();
    }

    await user.populate("favoritePlaces");

    res.status(200).json({
      message: "Place added to favorites",
      places: user.favoritePlaces,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add favorite place",
      details: error.message,
    });
  }
};

const removeFavoritePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favoritePlaces = user.favoritePlaces.filter(
      (id) => id.toString() !== placeId
    );

    await user.save();
    await user.populate("favoritePlaces");

    res.status(200).json({
      message: "Place removed from favorites",
      places: user.favoritePlaces,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to remove favorite place",
      details: error.message,
    });
  }
};

const addFavoriteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);
    const event = await Event.findById(eventId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const exists = user.favoriteEvents.some((id) => id.toString() === eventId);

    if (!exists) {
      user.favoriteEvents.push(eventId);
      await user.save();
    }

    await user.populate("favoriteEvents");

    res.status(200).json({
      message: "Event added to favorites",
      events: user.favoriteEvents,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add favorite event",
      details: error.message,
    });
  }
};

const removeFavoriteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favoriteEvents = user.favoriteEvents.filter(
      (id) => id.toString() !== eventId
    );

    await user.save();
    await user.populate("favoriteEvents");

    res.status(200).json({
      message: "Event removed from favorites",
      events: user.favoriteEvents,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to remove favorite event",
      details: error.message,
    });
  }
};

module.exports = {
  getFavorites,
  addFavoritePlace,
  removeFavoritePlace,
  addFavoriteEvent,
  removeFavoriteEvent,
};
