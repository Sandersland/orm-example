const fs = require("fs");

class Database {
  constructor(filepath) {
    this.filepath = filepath;
  }

  create(data) {
    if (!this.filepath) return;
    const fileContents = this.read();
    fileContents.push(data);
    fs.writeFileSync(this.filepath, JSON.stringify(fileContents, null, 2));
    return data;
  }

  read(pk) {
    if (!this.filepath) return [];
    const fileContents = fs.readFileSync(this.filepath);
    return JSON.parse(fileContents);
  }

  update(pk, data) {
    if (!this.filepath) return;
    const fileContents = this.read();
    const idx = fileContents.findIndex(f => f[pk] === data[pk]);
    fileContents[idx] = data;
    fs.writeFileSync(this.filepath, JSON.stringify(fileContents, null, 2));
    return data;
  }

  delete(pk) {}

}

module.exports = Database;