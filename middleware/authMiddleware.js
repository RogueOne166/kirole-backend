const jwt = require("jsonwebtoken");
const users = require("../data/users");

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      slug: user.slug,
      email: user.email,
      role: user.role,
      companyName: user.companyName || "",
      favorites: user.favorites || { places: [], events: [] },
      createdAt: user.createdAt,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const requireOrganizer = (req, res, next) => {
  if (!req.user || req.user.role !== "organizer") {
    return res.status(403).json({ error: "Organizer access only" });
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  next();
};

module.exports = {
  requireAuth,
  requireOrganizer,
  requireAdmin,
};
