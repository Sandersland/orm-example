const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/User.js");
const Post = require("./models/Post.js");

const PORT = 8080;

const app = express();
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.all();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.json(err)
  }
});

app.get("^/users/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  const user = await User.query.get(id);
  if (user) {
    return res.json(user);
  }
  return res.status(404).json({});
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  await user.save();
  return res.json(user);
});

app.patch("/users/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  let user = await User.query.get(id);
  if (user) {
    Object.assign(user, req.body);
    user = await user.save();
    return res.json(user);
  }
  return res.status(404).json({});
});

app.delete("/users/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  const user = await User.query.get(id);
  if (user) {
    await user.delete();
    return res.json(user);
  }
  return res.status(404).json({});
});

app.get("/posts", async(req, res) => {
  const posts = await Post.query.all();
  return res.json(posts);
});

app.get("^/posts/:id([0-9]+)", async(req, res) => {
  const {id} = req.params;
  const post = await Post.query.get(id);
  return res.json(post);
})

app.post("/posts", async(req, res) => {
  const post = await Post.create(req.body);
  await post.save();
  return res.json(post);
});

app.patch("^/posts/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  let post = await Post.query.get(id);
  if (post) {
    Object.assign(post, req.body);
    post = await post.save();
    return res.json(post);
  }
  return res.status(404).json({});
});

app.delete("^/posts/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  const post = await Post.query.get(id);
  if (post) {
    await post.delete();
    return res.json(post);
  }
  return res.status(404).json({});
})

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
