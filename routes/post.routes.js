const express = require("express");
const PostModel=require("../model/posts.Model")
const { auth } = require("../middleware/auth.middleware");
const { limiter } = require("../middleware/rateLimiter.middleware");

const postRouter = express.Router();

postRouter.use(limiter);
postRouter.use(auth);
postRouter.post("/add", async (req, res) => {
  try {
    const posts = new PostModel(req.body);
    await posts.save();
    res.status(200).json({ msg: "Post added", addPost: req.body });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const posts = await PostModel.find(req.query);
    res.status(200).json({ posts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    await PostModel.findByIdAndUpdate({ _id: id }, payload);
    const updatePost = await PostModel.find({ _id: id });
    res.status(200).json({ msg: "Post has been updated", updatePost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.patch("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await PostModel.findByIdAndDelete({ _id: id });
    const deletePost = await PostModel.find({ _id: id });
    res.status(200).json({ msg: "Post has been deleted", deletePost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = {
  postRouter
};