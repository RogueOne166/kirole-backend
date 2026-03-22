const jwt = require("jsonwebtoken");
const users = require("../data/users");

const JWT_SECRET = process.env.JWT_SECRET;

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Not authorized, no token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({
        error: "Not authorized, user not found",
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      slug: user.slug,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Not authorized, invalid token",
    });
  }
};

module.exports = protect;
