const path = require("path");

const model = require("../lib/model");
const {fromJSONFile} = require("../lib/utils");

const PATH = path.join(process.cwd(), "db/users.json");

class User extends model.Model {
  static __results = () => {
    // console.log(this);
    return fromJSONFile(PATH)();
  };

  static columns = {
    id: model.pk("id", "id"),
    name: model.column("name", "name"),
    active: model.column("active", "active")
  }
}

module.exports = User;