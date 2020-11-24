class Query {
  constructor(model, results) {
    const {tablename, columns, engine} = model;
    this.model = model;
    this.tablename = tablename;
    this.columns = columns;
    this.engine = engine;
    this.results = results ? results : [];
  }

  async all() {
    const results = [];
    if (!this.results.length) {
      this.results = await this.engine.read(this.model);
    }

    for (let i = 0; i < this.results.length; i++) {
      results[i] = await this.model.create(this.results[i]);
    }

    return results;
  }

  async filterby(filterObj) {
    const results = await this.engine.read(this.model);
    if (!results || !results.length) return this;
    this.results = results.filter((item) => {
      for (let key in filterObj) {
        if (item[key] != filterObj[key])
          return false;
      }
      return true;
    });
    return this;
  }

  async first() {
    if (!this.results.length) return null;
    return await this.model.create(this.results[0]);
  }

  async get(pk) {
    return (await this.filterby({[this.model.pk]: pk})).first();
  }

}

class Model {

  static get tablename() {
    // this is intended to be overwritten
    const plural = (word) => word.endsWith("s") ? word : word + "s"; 
    return plural(this.name).toLowerCase();
  }

  get tablename() {
    return this.constructor.tablename;
  }

  static engine = {
    create: async () => {},
    read: async () => [],
    update: async () => {},
    delete: async () => {}
  }

  static columns = {

  }

  constructor(args) {
    Object.assign(this, args);
  }

  get columns() {
    return this.constructor.columns;
  }

  static get pk () {
    return Object.values(this.columns).find(col => col.type === "pk").id;
  }

  get pk() {
    return this.constructor.pk;
  }

  static get query () {
    const queryInstance = new Query(this);
    return queryInstance;
  }

  static async create(args) {
    const obj = {}; 
    const columnEntries = Object.entries(this.columns);
    for await (let [name, {cls, id, type}] of columnEntries) {
      if (type === "fk") {
        const results = await cls.query.all();
        const foreignInst = results.find(res => res[cls.pk] === args[id]);
        Object.assign(obj, {[name]: foreignInst});
      } else {
        Object.assign(obj, {[name]: args[id]});
      }
    }
    
    return new this(obj);
  }

  async save() {
    const id = this[this.pk];
    
    if (!id) {
      return await this.constructor.engine.create(this);
    } else {
      return await this.constructor.engine.update(this);
    }
  }

  async delete() {
    const id = this[this.pk];
    if (!id) return;
    await this.constructor.engine.delete(this);
  }

}

class Column {
  constructor(type, id, label) {
    this.type = type;
    this.id = id;
    this.label = label;
  }
}

class PrimaryKey extends Column {
  constructor(id, label) {
    super("pk", id, label);
  }
}

class ForeignKey extends Column {
  constructor(id, label, cls) {
    super("fk", id, label);
    this.cls = cls;
  }
}

function booleanField(id, label) {
  return new Column("boolean", id, label);
}

function textField(id, label) {
  return new Column("text", id, label);
}

function pk (id, label) {
  return new PrimaryKey(id, label);
}

function fk (id, label, cls) {
  return new ForeignKey(id, label, cls);
}

module.exports = {
  Model, booleanField, textField, pk, fk
}