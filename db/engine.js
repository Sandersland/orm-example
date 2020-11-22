const Database = require("../lib/database");

const db = Database.init(__dirname);

module.exports = db;
