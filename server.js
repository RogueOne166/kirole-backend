require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const placesRoutes = require("./routes/placesRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const metaRoutes = require("./routes/metaRoutes");
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Mauritius travel and outings backend is running" });
});

app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/places", placesRoutes);
app.use("/events", eventsRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/", metaRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
