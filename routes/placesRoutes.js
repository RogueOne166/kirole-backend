const express = require("express");
const router = express.Router();

const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaces,
  getNearbyPlaces,
  getTopRatedPlaces,
  getPlaceBySlug,
} = require("../controllers/placesController");

router.get("/", getAllPlaces);
router.get("/search", searchPlaces);
router.get("/nearby", getNearbyPlaces);
router.get("/top-rated", getTopRatedPlaces);
router.get("/slug/:slug", getPlaceBySlug); 
router.get("/:id", getPlaceById);
router.post("/", createPlace);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);


module.exports = router;

