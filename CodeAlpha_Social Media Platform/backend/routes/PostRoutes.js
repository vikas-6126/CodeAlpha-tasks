const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// CREATE POST
router.post("/create", async (req, res) => {
  try {
    const { content, user } = req.body;
    const post = await Post.create({ content, user });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET POSTS BY USER (PROFILE PAGE)
router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE POST
router.delete("/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LIKE / UNLIKE
router.post("/like", async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const index = post.likes.indexOf(userId);
    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
