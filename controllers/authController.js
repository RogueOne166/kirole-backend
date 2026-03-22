const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../data/users");
const slugify = require("../utils/slugify");

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "name, email, and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = users.find(
      (user) => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name: name.trim(),
      slug: slugify(name),
      email: normalizedEmail,
      password: hashedPassword,
      favorites: {
      	places: [],
      	events: []
      },
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        slug: newUser.slug,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error during signup",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        slug: user.slug,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error during login",
    });
  }
};

const getMe = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = {
  signup,
  login,
  getMe,
};
