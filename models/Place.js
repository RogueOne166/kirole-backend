const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    category: String,
    region: String,
    description: String,
    latitude: Number,
    longitude: Number,
    price: String,
    rating: Number,
    reviews: Number,
    audience: [String],
    type: String,
    featured: Boolean,
    image: String,
    slug: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Place", placeSchema);
