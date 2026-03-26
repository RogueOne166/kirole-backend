const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// SIGNUP
router.post("/signup", registerUser);

// LOGIN
router.post("/login", loginUser);

// GET CURRENT USER
router.get("/me", protect, getMe);

module.exports = router;
