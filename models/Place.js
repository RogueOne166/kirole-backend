const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    category: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    price: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },

    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    audience: {
      type: [String],
      default: ["locals", "tourists"],
    },

    type: {
      type: String,
      default: "place",
    },

    featured: { type: Boolean, default: false },
    image: { type: String, default: "" },

    date: { type: String, default: "" },
    time: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Place", placeSchema);
