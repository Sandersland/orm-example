const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/User.js");
const Post = require("./models/Post.js");

const PORT = 8080;

const app = express();
app.use(bodyParser.json());

app.get("/users", (req, res) => {
  const users = User.all();
  return res.json(users);
});

app.get("/users/:id", (req, res) => {
  const {id} = req.params;
  const user = User.all().find((u) => u.id == id);
  return res.json(user);
});

app.post("/users", (req, res) => {
  const user = User.create(req.body);
  user.save()
  return res.json(user);
});

app.patch("/users/:id", (req, res) => {
  const {id} = req.params;

  let user = User.all().find(u => u.id == id);
  Object.assign(user, req.body);
  user.save();
  
  return res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const {id} = req.params;

  const user = User.all().find(u => u.id == id);
  if (user) {
    user.delete();
    return res.json(user);
  }
    return res.status(404).json({});
});

app.get("/posts", (req, res) => {
  const posts = Post.all();
  return res.json(posts);
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
