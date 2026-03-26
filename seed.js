require("dotenv").config();
const mongoose = require("mongoose");

const Place = require("./models/Place");
const Event = require("./models/Event");

const places = require("./data/places");
const events = require("./data/events");

const seedData = async () => {
  try {
    console.log("Starting seed...");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Place.deleteMany();
    await Event.deleteMany();

    await Place.insertMany(places);
    await Event.insertMany(events);

    console.log("Places and events inserted successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedData();
