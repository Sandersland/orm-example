const model = require("../lib/model");
const db = require("../db/engine");

class User extends model.Model {

  static tablename = "users";

  static engine = db;

  static columns = {
    id: model.pk("id", "id"),
    name: model.column("name", "name"),
    active: model.column("active", "active")
  }
}

module.exports = User;