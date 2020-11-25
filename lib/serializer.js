class Serializer {

  static model = {};

  get model () {
    return this.constructor.model;
  }

  static fields = [];

  get fields () {
    return this.constructor.model;
  }

  constructor(many=false) {
    this.many = many;
  }

  #serialize(instance) {
    const obj = {}; 
    const columnEntries = Object.entries(this.constructor.model.columns);
    for (let [name, {id, type}] of columnEntries) {
      const fieldValue = instance[name];
      for (let i = 0; i < this.constructor.fields.length; i++) {
        const field = this.constructor.fields[i];
        if (field === id && type !== "fk") {
          obj[id] = fieldValue;
        } else if (field === id && type === "fk" ) {
          obj[id] = fieldValue[fieldValue.pk]
        } else if (field.hasOwnProperty("autojoin") && field.autojoin) {
          obj[name] = fieldValue;
        } 
      }
    }
    return obj;
  }

  dump(instance) {
    if (this.many) {
      if (!Array.isArray(instance)) {
        // throw error
      }
      return instance.map(inst => this.#serialize(inst));
    }

    return this.#serialize(instance);
  }
}

function autojoin(fieldId) {
  return {id: fieldId, autojoin: true}
}

module.exports = {Serializer, autojoin};