const fs = require("fs");
const path = require("path");

class Database {
  constructor() {
    this.tables = {}
  }

  static init(dirname) {
    const dbInstance = new this();
    fs.readdir(dirname, "utf8", (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach(file => {
        if (file.endsWith(".json")) {
          const tablename = path.basename(file, ".json");
          const filepath = path.join(dirname, file);
          dbInstance.registerTable(tablename, filepath);
        }
      });
    });
    return dbInstance;
  }

  registerTable(tablename, filepath) {
    Object.assign(this.tables, {[tablename]: filepath});
  }

  #prepareSaveRecord(instance) {
    const columnEntries = Object.entries(instance.columns);
    return columnEntries.reduce((acc, [key, value]) => {
      if (value.type === "fk") {
        const relatedInst = instance[key];
        return Object.assign(acc, {[value.id]: relatedInst[relatedInst.pk]})
      }
      return Object.assign(acc, {[value.id]: instance[key]});
    }, {});
  }

  async create(instance) {
    const {pk} = instance;
    const fileContents = await this.read(instance);
    let last;
    if (fileContents.length) {
      last = fileContents[fileContents.length - 1][pk];
    }
    
    Object.assign(instance, {[pk]: last ? last + 1: 1});
    
    const record = this.#prepareSaveRecord(instance);

    fileContents.push(record);

    return new Promise((resolve, reject) => {
      
      fs.writeFile(
        this.tables[instance.tablename],
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

  async read(instance) {
    return new Promise((resolve, reject) => {
      fs.readFile(
        this.tables[instance.tablename],
        (err, fileContents) => {
          if (err) {
            return reject(err);
          }
          const results = JSON.parse(fileContents);
          return resolve(results);
        }
      );
    });
  }

  async update(instance) {
    const {pk} = instance;
    const record = this.#prepareSaveRecord(instance);
    const fileContents = await this.read(instance);
    const idx = fileContents.findIndex(f => f[pk] === instance[pk]);
    fileContents[idx] = record;
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.tables[instance.tablename],
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
    const {pk} = instance;
    let fileContents = await this.read(instance);
    const idx = fileContents.findIndex(f => f[pk] === instance[pk]);
    fileContents.splice(idx, 1);
    return new Promise((resolve, reject) => {
      fs.writeFile(
        this.tables[instance.tablename],
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