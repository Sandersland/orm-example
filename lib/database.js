const fs = require("fs");

class Database {
  constructor(filepath) {
    this.filepath = filepath;
  }

  async create(pk, data) {
    if (!this.filepath) return;
    const fileContents = await this.read();
    let last;
    if (fileContents.length) {
      last = fileContents[fileContents.length - 1][pk];
    }
    
    Object.assign(data, {[pk]: last ? last + 1: 1});
    fileContents.push(data);

    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filepath, 
        JSON.stringify(fileContents, null, 2),
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      );
    })
  }

  async read() {
    return new Promise((resolve, reject) => {
      if (!this.filepath) return resolve([]);
      fs.readFile(this.filepath, (err, fileContents) => {
        if (err) {
          return reject(err);
        }
        const results = JSON.parse(fileContents);
        return resolve(results);
      });
    });
  }

  async update(pk, data) {
    if (!this.filepath) return;
    const fileContents = await this.read();
    const idx = fileContents.findIndex(f => f[pk] === data[pk]);
    fileContents[idx] = data;
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filepath, 
        JSON.stringify(fileContents, null, 2), 
        "utf8", 
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        }
      );
    })
  }

  async delete(pk, data) {
    if (!this.filepath) return;
    let fileContents = await this.read();
    const idx = fileContents.findIndex(f => f[pk] === data[pk]);
    fileContents.splice(idx, 1);
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filepath, 
        JSON.stringify(fileContents, null, 2),
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        }
      );
    })
  }

}

module.exports = Database;