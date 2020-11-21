const fs = require("fs");

class Database {
  constructor(filepath) {
    this.filepath = filepath;
  }

  async create(instance) {
    if (!this.filepath) return;
    const {pk} = instance;
    const fileContents = await this.read();
    let last;
    if (fileContents.length) {
      last = fileContents[fileContents.length - 1][pk];
    }
    
    Object.assign(instance, {[pk]: last ? last + 1: 1});
    fileContents.push(instance);

    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filepath, 
        JSON.stringify(fileContents, null, 2),
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve(instance);
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

  async update(instance) {
    if (!this.filepath) return;
    const {pk} = instance;
    const fileContents = await this.read();
    const idx = fileContents.findIndex(f => f[pk] === instance[pk]);
    fileContents[idx] = instance;
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filepath, 
        JSON.stringify(fileContents, null, 2), 
        "utf8", 
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(instance);
        }
      );
    })
  }

  async delete(instance) {
    if (!this.filepath) return;
    const {pk} = instance;
    let fileContents = await this.read();
    const idx = fileContents.findIndex(f => f[pk] === instance[pk]);
    fileContents.splice(idx, 1);
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.filepath, 
        JSON.stringify(fileContents, null, 2),
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(instance);
        }
      );
    })
  }

}

module.exports = Database;