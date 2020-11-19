class Model {
  static __results = () => {
    return [];
  }

  static columns = {

  }

  constructor(args) {
    Object.assign(this, args);
  }

  static get pk () {
    return Object.values(this.columns).find(col => col.type === "pk").id;
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

  static all() {
    return this.__results().map(result => this.create(result));
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