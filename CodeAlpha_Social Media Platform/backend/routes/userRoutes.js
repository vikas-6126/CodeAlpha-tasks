const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/User");



// CREATE USER
router.post("/create", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });

  } catch (err) {
    console.error("CREATE USER ERROR:", err.message);
    res.status(500).json({ error: "User creation failed" });
  }
});


// login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});




// FOLLOW USER
router.post("/follow", async (req, res) => {
  const { userId, targetId } = req.body;

  if (userId === targetId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.following.includes(targetId)) {
    user.following.push(targetId);
    target.followers.push(userId);

    await user.save();
    await target.save();
  }

  res.json({ message: "Followed successfully" });
});

// UNFOLLOW USER
router.post("/unfollow", async (req, res) => {
  const { userId, targetId } = req.body;

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  user.following = user.following.filter(
    id => id.toString() !== targetId
  );

  target.followers = target.followers.filter(
    id => id.toString() !== userId
  );

  await user.save();
  await target.save();

  res.json({ message: "Unfollowed successfully" });
});


router.get("/", async (req, res) => {
  const users = await User.find().select("_id username followers");
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.get("/user/:id", async (req, res) => {
  const posts = await Post.find({ user: req.params.id })
    .populate("user", "username");

  res.json(posts);
});







module.exports = router;
