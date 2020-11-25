const sqlite3 = require("sqlite3");

class Database {
  constructor(instance) {
    this.instance = instance;
  }

  static init(filepath) {
    const dbInst = new sqlite3.Database(filepath);
    return new Database(dbInst);
  }

  createTable(cls) {
    return new Promise((resolve, reject) => {
      const columns = Object.values(cls.columns)
        .map(({type, id}) => {
          switch (type) {
            case "pk":
              return `${id} INTEGER PRIMARY KEY`;
            case "fk":
            case "boolean":
              return `${id} INTEGER`;
            case "text":
              return `${id} TEXT`;
            default:
              return `${id} TEXT`;
          }
        });
      const sql = `CREATE TABLE IF NOT EXISTS ${cls.tablename} (${columns.join(", ")})`;
      console.log(sql);
      this.instance.run(sql, (err) => err ? reject(err) : resolve(this));
    });
  }

  #prepareSaveRecord(cls) {
    const columnEntries = Object.entries(cls.columns);
    return columnEntries.reduce((acc, [key, value]) => {
      if (value.type === "fk") {
        const relatedInst = cls[key];
        return Object.assign(acc, {[value.id]: relatedInst[relatedInst.pk]})
      }
      if (cls[key]) {
        return Object.assign(acc, {[value.id]: cls[key]});
      }
      return acc;
    }, {});
  }

  async create(cls) {
    

    return new Promise((resolve, reject) => {
      const record = this.#prepareSaveRecord(cls);
      const keys = Object.keys(record).join(", ");
      // TODO: pull logic into serializer
      const values = Object.values(record).map(val => {
        if (typeof val === "string") {
          return `"${val}"`;
        } if (typeof val === "boolean") {
          return val === true ? 1 : 0;
        } else {
          return val;
        }
      }).join(", ");
      const sql = `INSERT INTO ${cls.tablename} (${keys}) VALUES (${values})`;
      console.log(sql);
      this.instance.run(sql, (err) => err ? reject(err) : resolve(cls));
    });
  }

  read(cls) {
    const columns = Object.values(cls.columns).map(col => col.id);
    return new Promise((resolve, reject) => {
      this.instance.all(
        `SELECT ${columns.join(", ")} FROM ${cls.tablename}`, 
        (err, rows) => err ? reject(err) : resolve(rows)
      );
    });
  }

  async update(cls) {
    const {pk, tablename} = cls;
    const record = this.#prepareSaveRecord(cls);
    return new Promise((resolve, reject) => {
      const changes = Object.entries(record)
        .reduce((acc, [key, value]) => {
          console.log(key)
          if (typeof value === "string") {
            value = `"${value}"`;
          }
          if (typeof value === "boolean") {
            value = value === true ? 1 : 0;
          }
          acc.push(`${key} = ${value}`);
          return acc;
        }, []).join(", ");
      const sql = `UPDATE ${tablename} SET ${changes} WHERE ${pk} = ${cls[pk]}`;
      this.instance.run(sql, (err) => err ? reject(err) : resolve(cls));
    });
  }

  async delete(cls) {
    const {pk} = cls;
    return new Promise ((resolve, reject) => {
      this.instance.run(
        `DELETE FROM ${cls.tablename} WHERE ${pk} = ${cls[pk]}`,
        (err) => err ? reject(err) : resolve(cls)
      );
    });
  }
}

module.exports = Database;
