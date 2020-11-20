const path = require("path");
const model = require("../lib/model");

const Database = require("../lib/database");

const User = require("./User");

const PATH = path.join(process.cwd(), "db/posts.json");

const db = new Database(PATH);

class Post extends model.Model {
  static engine = db;

  static columns = {
    id: model.pk("id", "id"),
    subject: model.column("subject", "subject"),
    user: model.fk("userId", "userId", User)
  }
}

module.exports = Post;