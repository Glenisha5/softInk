import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error", message: (err as Error).message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error", message: (err as Error).message });
  }
});

// GOOGLE LOGIN
router.post("/google", async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    let user = await User.findOne({ email });
    if (!user) {
      const username = name || email.split("@")[0];
      user = await User.create({ username, email, googleId: googleId || email });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Server error", message: (err as Error).message });
  }
});

export default router;