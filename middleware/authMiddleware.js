const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
      companyName: user.companyName || "",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Not authorized, token failed",
      details: error.message,
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
};

const organizerOnly = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "organizer" && req.user.role !== "admin")
  ) {
    return res.status(403).json({ error: "Organizer only" });
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
  organizerOnly,
};
