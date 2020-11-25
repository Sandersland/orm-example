const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/User.js");
const Post = require("./models/Post.js");

const PostSerializer = require("./serializers/PostSerializer");

const postSerializer = new PostSerializer();
const postsSerializer = new PostSerializer(many=true);

const PORT = 8080;

const app = express();
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.query.all();
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
  return res.status(404).json();
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
  return res.status(404).json();
});

app.delete("/users/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  const user = await User.query.get(id);
  if (user) {
    await user.delete();
    return res.json(user);
  }
  return res.status(404).json();
});

app.get("/posts", async(req, res) => {
  const posts = await Post.query.all();
  const response = postsSerializer.dump(posts);
  return res.json(response);
});

app.get("^/posts/:id([0-9]+)", async(req, res) => {
  const {id} = req.params;
  const post = await Post.query.get(id);
  if (post) {
    const response = postSerializer.dump(post);
    return res.json(response);
  }
  return res.status(404).json();
  
});

app.post("/posts", async(req, res) => {
  const post = await Post.create(req.body);
  await post.save();
  const response = postSerializer.dump(post);
  return res.json(response);
});

app.patch("^/posts/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  let post = await Post.query.get(id);
  if (post) {
    Object.assign(post, req.body);
    post = await post.save();
    const response = postSerializer.dump(post);
    return res.json(response);
  }
  return res.status(404).json();
});

app.delete("^/posts/:id([0-9]+)", async (req, res) => {
  const {id} = req.params;
  const post = await Post.query.get(id);
  if (post) {
    await post.delete();
    return res.json(post);
  }
  return res.status(404).json();
})

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
