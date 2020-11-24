const {Serializer, autojoin} = require("../lib/serializer");
const Post = require("../models/Post");

class PostSerializer extends Serializer {

  constructor(args) {
    super(args);
  }

  static model = Post;

  static fields = [
    "id",
    "subject",
    autojoin("userId")
  ];

  static readonly = ["id"];

}

module.exports = PostSerializer;