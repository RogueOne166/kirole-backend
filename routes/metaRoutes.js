const express = require("express");
const router = express.Router();

const {
  getCategories,
  getRegions,
  getMetaData,
} = require("../controllers/metaController");

router.get("/", getMetaData);
router.get("/categories", getCategories);
router.get("/regions", getRegions);

module.exports = router;
