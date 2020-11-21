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
    create: () => {},
    read: async () => [],
    update: () => {},
    delete: () => {}
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

  static create(args) {
    const obj = {};
    Object.entries(this.columns)
      .forEach(([name, props]) => {
        switch(props.type) {
          case "pk":
          case "column":
            Object.assign(obj, {[name]: args[props.id]});
            break;
          case "fk":
            const foreignInst = props.cls.all()
              .find(c => c[props.cls.pk] === args[props.id]);
            Object.assign(obj, {[name]: foreignInst});
            break;
        }
      });
    return new this(obj);
  }

  static async all() {
    const response = await this.engine.read();
    return response.map(result => this.create(result));
  }

  async save() {
    const id = this[this.pk];
    
    if (!id) {
      await this.constructor.engine.create(this);
    } else {
      await this.constructor.engine.update(this);
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

function column (id, label) {
  return new Column("column", id, label);
}

function pk (id, label) {
  return new PrimaryKey(id, label);
}

function fk (id, label, cls) {
  return new ForeignKey(id, label, cls);
}

module.exports = {
  Model, column, pk, fk
}