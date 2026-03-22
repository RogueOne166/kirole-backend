const users = require("../data/users");
const places = require("../data/places");
const events = require("../data/events");

// GET ALL FAVORITES
const getFavorites = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const favoritePlaces = user.favorites.places
    .map((id) => places.find((p) => p.id === id))
    .filter(Boolean);

  const favoriteEvents = user.favorites.events
    .map((id) => events.find((e) => e.id === id))
    .filter(Boolean);

  res.status(200).json({
    places: favoritePlaces,
    events: favoriteEvents,
  });
};

// ADD PLACE
const addFavoritePlace = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  const placeId = Number(req.params.placeId);

  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.favorites.places.includes(placeId)) {
    return res.status(400).json({ error: "Already in favorites" });
  }

  user.favorites.places.push(placeId);

  res.status(200).json({ message: "Place added to favorites" });
};

// REMOVE PLACE
const removeFavoritePlace = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  const placeId = Number(req.params.placeId);

  user.favorites.places = user.favorites.places.filter(
    (id) => id !== placeId
  );

  res.status(200).json({ message: "Place removed from favorites" });
};

// ADD EVENT
const addFavoriteEvent = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  const eventId = Number(req.params.eventId);

  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.favorites.events.includes(eventId)) {
    return res.status(400).json({ error: "Already in favorites" });
  }

  user.favorites.events.push(eventId);

  res.status(200).json({ message: "Event added to favorites" });
};

// REMOVE EVENT
const removeFavoriteEvent = (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  const eventId = Number(req.params.eventId);

  user.favorites.events = user.favorites.events.filter(
    (id) => id !== eventId
  );

  res.status(200).json({ message: "Event removed from favorites" });
};

module.exports = {
  getFavorites,
  addFavoritePlace,
  removeFavoritePlace,
  addFavoriteEvent,
  removeFavoriteEvent,
};
