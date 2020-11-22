const model = require("../lib/model");
const db = require("../db/engine");

const User = require("./User");

class Post extends model.Model {
  static engine = db;

  static columns = {
    id: model.pk("id", "id"),
    subject: model.column("subject", "subject"),
    user: model.fk("userId", "userId", User)
  }
}

module.exports = Post;