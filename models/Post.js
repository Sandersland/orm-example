const path = require("path");
const model = require("../lib/model");
const {fromJSONFile} = require("../lib/utils");

const User = require("./User");

const PATH = path.join(process.cwd(), "db/posts.json");

class Post extends model.Model {
  static __results = fromJSONFile(PATH);

  static columns = {
    id: model.pk("id", "id"),
    subject: model.column("subject", "subject"),
    user: model.fk("userId", "userId", User)
  }
}

module.exports = Post;