class Store {
  constructor() {
    this.ds = null
  }
}

class Getters {
  constructor( store ) {
    this.store = store
  }

  get selectedNodesCount() {
    const { selectedSingleNodes = [] } = this.store.ds.getters
    return selectedSingleNodes.length 
  }

  get selectedDsElementsCount() {
    const { selectedDsElements = [] } = this.store.ds.getters
    return selectedDsElements.length 
  }

}

class Mutations {
  constructor( store, getters ) {
    this.store = store
    this.getters = getters
  }

  UPDATE_DS( ds ) {
    this.store.ds = ds
  }
}

class Actions {
  constructor( store, getters, mutations ) {
    this.store = store
    this.getters = getters
    this.mutations = mutations
  }
}

export default class DsModel {
  constructor() {
    this.store = new Store()
    this.getters = new Getters( this.store )
    this.mutations = new Mutations( this.store, this.getters )
    this.actions = new Actions( this.store, this.getters, this.mutations )
  }
}
