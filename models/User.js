const path = require("path");

const model = require("../lib/model");
const Database = require("../lib/database");

const PATH = path.join(process.cwd(), "db/users.json");

const db = new Database(PATH);

class User extends model.Model {

  static engine = db;

  static columns = {
    id: model.pk("id", "id"),
    name: model.column("name", "name"),
    active: model.column("active", "active")
  }
}

module.exports = User;