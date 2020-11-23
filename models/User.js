const model = require("../lib/model");
// const db = require("../db/engine");
const db = require("../db/sqlite");

class User extends model.Model {

  static tablename = "users";

  static engine = db;

  static columns = {
    id: model.pk("id", "id"),
    name: model.textField("name", "name"),
    active: model.booleanField("active", "active")
  }
}

db.createTable(User);

module.exports = User;