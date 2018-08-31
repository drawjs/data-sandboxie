class Store {}

class Getters {
  store = {};
  constructor(store) {
    this.store = store;
  }
}

class Mutations {
  store = {};
  getters = {};
  constructor(store, getters) {
    this.store = store;
    this.getters = getters;
  }
}

class Actions {
  store = {};
  getters = {};
  mutations = {};
  constructor(store, getters, mutations) {
    this.store = store;
    this.getters = getters;
    this.mutations = mutations;
  }
}

export default class ModelTemplate {
  store = {};
  getters = {};
  mutations = {};
  actions = {};

  constructor() {
    this.store = new Store();
    this.getters = new Getters(this.store);
    this.mutations = new Mutations(this.store, this.getters);
    this.actions = new Actions(this.store, this.getters, this.mutations);
  }
}
