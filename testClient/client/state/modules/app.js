const state = {
  operable : false,
  deletable: false
}
const mutations = {
  UPDATE_OPERABLE( state, value ) {
    state.operable = value
  },
  ENABLE_OPERABLE( state ) {
    state.operable = true
  },
  DISABLE_OPERABLE( state ) {
    state.operable = false
  },
  UPDATE_DELETABLE( state, value ) {
    state.deletable = value
  },
}
const getters = {
}
const actions = {
  autoUpdateOperableDeletable( { commit, state }, { dsModel } ) {
    setInterval( () => {
      resolveOperable()
      resolveDeletable()
    }, 100 )
    function resolveOperable() {
      const { selectedNodesCount } = dsModel.getters
      const { operable: prevOperable } = state
      const operable = selectedNodesCount > 0
      prevOperable !== operable && commit( 'UPDATE_OPERABLE', operable )
    }
    function resolveDeletable() {
      const { selectedDsElementsCount } = dsModel.getters
      const { deletable: prevDeletable } = state
      const deletable = selectedDsElementsCount > 0
      prevDeletable !== deletable && commit( 'UPDATE_DELETABLE', deletable )
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
