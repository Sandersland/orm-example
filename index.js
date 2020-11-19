const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/User.js");
const Post = require("./models/Post.js");

const PORT = 8080;

const app = express();
app.use(bodyParser.json());

app.get("/users", (req, res) => {
  const users = User.all().filter(({active}) => active);
  res.json(users);
});

app.get("/posts", (req, res) => {
  const posts = Post.all();
  res.json(posts);
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
