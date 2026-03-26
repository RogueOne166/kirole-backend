const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },

    date: { type: String, required: true },
    time: { type: String, default: "" },
    location: { type: String, default: "", trim: true },

    region: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },

    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },

    latitude: { type: Number },
    longitude: { type: Number },

    price: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },

    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    audience: {
      type: [String],
      default: ["tourists", "locals"],
    },

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizerName: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
