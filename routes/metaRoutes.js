require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const placesRoutes = require("./routes/placesRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const homeRoutes = require("./routes/homeRoutes");
const metaRoutes = require("./routes/metaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/places", placesRoutes);
app.use("/events", eventsRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/home", homeRoutes);
app.use("/meta", metaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
