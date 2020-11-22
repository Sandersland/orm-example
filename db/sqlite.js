const Database = require("../lib/sqlite-db");

const db = Database.init("./db/data.db");

module.exports = db;