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
  const users = await User.all();
  const user = users.find((u) => u.id == id);
  return res.json(user);
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  await user.save();
  return res.json(user);
});

app.patch("/users/:id", async (req, res) => {
  const {id} = req.params;

  const users = await User.all();
  let user = users.find(u => u.id == id);
  Object.assign(user, req.body);
  await user.save();
  return res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  const {id} = req.params;
  const users = await User.all();
  const user = users.find(u => u.id == id);
  if (user) {
    await user.delete();
    return res.json(user);
  }
    return res.status(404).json({});
});

app.get("/posts", async(req, res) => {
  const posts = await Post.all();
  return res.json(posts);
});

app.get("^/posts/:id([0-9]+)", async(req, res) => {
  const {id} = req.params;
  const posts = await Post.all();
  const post = posts.find((p) => p.id == id);
  return res.json(post);
})

app.post("/posts", async(req, res) => {
  const post = await Post.create(req.body);
  await post.save();
  return res.json(post);
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
