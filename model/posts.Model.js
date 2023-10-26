const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const PostModel = mongoose.model("post_insta", postSchema);

module.exports = PostModel;