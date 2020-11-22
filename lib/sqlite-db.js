const sqlite3 = require("sqlite3");

class Database {
  constructor(instance) {
    this.instance = instance;
  }

  static init(filepath) {
    const dbInst = new sqlite3.Database(filepath);
    return new Database(dbInst);
  }

  async create(cls) {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(cls.columns);
      const sqlObj = columns.reduce((sqlObj, col) => {
        const value = cls[col];
        if (value) {
          return Object.assign(sqlObj, {[col]: value});
        }
        return sqlObj;
      }, {});
      const keys = Object.keys(sqlObj).join(", ");
      const values = Object.values(sqlObj).map(val => {
        if (typeof val === "string") {
          return `"${val}"`;
        } if (typeof val === "boolean") {
          return val === true ? 1 : 0;
        }
      }).join(", ");
      const sql = `INSERT INTO ${cls.tablename} (${keys}) VALUES (${values})`;
      this.instance.run(sql, (err) => err ? reject(err) : resolve(cls));
    });
  }

  async read(cls) {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(cls.columns);
      this.instance.all(
        `SELECT ${columns.join(", ")} FROM ${cls.tablename}`, 
        (err, rows) => err ? reject(err) : resolve(rows)
      );
    });
  }

  async update(cls) {
    const {pk, tablename} = cls;
    return new Promise((resolve, reject) => {
      const columns = Object.keys(cls.columns);
      const sqlObj = columns.reduce((sqlObj, col) => {
        const value = cls[col];
        if (col !== pk) {
          return Object.assign(sqlObj, {[col]: value});
        }
        return sqlObj;
      }, {});
      const changes = Object.entries(sqlObj)
        .reduce((acc, [key, value]) => {
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
