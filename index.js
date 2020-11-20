const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/User.js");
const Post = require("./models/Post.js");

const PORT = 8080;

const app = express();
app.use(bodyParser.json());

app.get("/users", (req, res) => {
  const users = User.all();
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const {id} = req.params;

  const user = User.all().find((u) => u.id == id);
  res.json(user);
});

app.post("/users", (req, res) => {
  const user = User.create(req.body);
  user.save()
  res.json(user);
});

app.patch("/users/:id", (req, res) => {
  const {id} = req.params;

  let user = User.all().find(u => u.id == id);
  Object.assign(user, req.body);
  user.save();
  
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const {id} = req.params;

  const user = User.all().find(u => u.id == id);

  user.delete();
  res.json(user);
});

app.get("/posts", (req, res) => {
  const posts = Post.all();
  res.json(posts);
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
