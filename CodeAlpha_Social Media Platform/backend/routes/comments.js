const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

// ==========================
// CREATE COMMENT
// ==========================
router.post("/create", async (req, res) => {
  try {
    const { content, user, post } = req.body;

    const userExists = await User.findById(user);
    const postExists = await Post.findById(post);

    if (!userExists || !postExists) {
      return res.status(400).json({ error: "Invalid user or post ID" });
    }

    const comment = await Comment.create({ content, user, post });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "username");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// GET COMMENTS FOR A POST
// ==========================
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
