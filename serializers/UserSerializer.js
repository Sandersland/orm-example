const {Serializer} = require("../lib/serializer");
const Post = require("../models/Post");

class UserSerializer extends Serializer {

  constructor(args) {
    super(args);
  }

  static model = Post;

  static fields = [
    "id",
    "name"
  ];

}

module.exports = UserSerializer;