const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    name: {
      type: String,
    },

    placeName: {
      type: String,
    },

    category: String,
    region: String,
    description: String,

    date: String,
    time: String,

    price: String,

    image: String,

    featured: Boolean,

    slug: String,

    //  IMPORTANT FIX
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ADD THESE FOR DASHBOARD
    status: {
      type: String,
      default: "Draft",
    },

    ticketsSold: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
