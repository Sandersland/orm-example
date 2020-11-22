const Database = require("../lib/json-db");

const db = Database.init(__dirname);

module.exports = db;
