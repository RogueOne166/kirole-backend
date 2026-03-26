const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,        // optional now
    name: String,         // in case your data uses name instead of title
    placeName: String,
    category: String,
    region: String,
    description: String,
    date: String,
    time: String,
    price: String,
    image: String,
    featured: Boolean,
    slug: String,
    organizerId: String   // NOT required anymore
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
