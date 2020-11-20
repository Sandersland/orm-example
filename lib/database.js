const fs = require("fs");

class Database {
  constructor(filepath) {
    this.filepath = filepath;
  }

  create(pk, data) {
    if (!this.filepath) return;
    const fileContents = this.read();
    let last;
    if (fileContents.length) {
      last = fileContents[fileContents.length - 1][pk];
    }
    
    Object.assign(data, {[pk]: last ? last + 1: 1});
    fileContents.push(data);
    fs.writeFileSync(this.filepath, JSON.stringify(fileContents, null, 2));
    return data;
  }

  read() {
    if (!this.filepath) return [];
    const fileContents = fs.readFileSync(this.filepath);
    const results = JSON.parse(fileContents);
    return results;
  }

  update(pk, data) {
    if (!this.filepath) return;
    const fileContents = this.read();
    const idx = fileContents.findIndex(f => f[pk] === data[pk]);
    fileContents[idx] = data;
    fs.writeFileSync(this.filepath, JSON.stringify(fileContents, null, 2));
    return data;
  }

  delete(pk, data) {
    if (!this.filepath) return;
    let fileContents = this.read();
    const idx = fileContents.findIndex(f => f[pk] === data[pk]);
    fileContents.splice(idx, 1);
    fs.writeFileSync(this.filepath, JSON.stringify(fileContents, null, 2));
  }

}

module.exports = Database;