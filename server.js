require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const placesRoutes = require("./routes/placesRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);        // 🔥 THIS FIXES YOUR SIGNUP
app.use("/places", placesRoutes);
app.use("/events", eventsRoutes);
app.use("/favorites", favoritesRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
