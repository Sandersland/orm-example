class Serializer {

  static model = {};

  get model () {
    return this.constructor.model;
  }

  static fields = [];

  get fields () {
    return this.constructor.model;
  }

  static readonly = [];

  get readonly() {
    return this.constructor.readonly;
  }

  constructor(many=false) {
    this.many = many;
  }

  dump(instance) {
    const obj = {}; 
    const columnEntries = Object.entries(this.constructor.model.columns);
    for (let [name, {id}] of columnEntries) {
      const fieldValue = instance[name];
      for (let i = 0; i < this.constructor.fields.length; i++) {
        const field = this.constructor.fields[i];
        if (field === id) {
          obj[id] = fieldValue;
        } else if (field.hasOwnProperty("autojoin") && field.autojoin) {
          obj[name] = fieldValue;
        } else if (field.hasOwnProperty("id")) {
          obj[field.id] = fieldValue[fieldValue.pk];
        }
      }
      
    }
    return obj;
  }

  async load() {}
}

function autojoin(fieldId) {
  return {id: fieldId, autojoin: true}
}
module.exports = {Serializer, autojoin};