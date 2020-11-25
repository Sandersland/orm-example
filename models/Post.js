const model = require("../lib/model");
const db = require("../db/sqlite");
// const db = require("../db/engine");

const User = require("./User");

class Post extends model.Model {
  static engine = db;

  static columns = {
    id: model.pk("id", "id"),
    subject: model.textField("subject", "subject"),
    user: model.fk("userId", "userId", User)
  }
}

db.createTable(Post);

module.exports = Post;