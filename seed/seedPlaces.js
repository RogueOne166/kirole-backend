const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Place = require("../models/Place");
const places = require("../data/places");

dotenv.config();

const seedPlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Place.deleteMany();
    await Place.insertMany(places);

    console.log("Places seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedPlaces();
