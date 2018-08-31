const state = {
  operable: false
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
  }
}
const getters = {
}
const actions = {
  autoUpdateOperable( { commit, state }, { dsModel } ) {
    setInterval( resolve, 100 )
    function resolve() {
      const { selectedNodesCount } = dsModel.getters
      const { operable: prevOperable } = state
      const operable = selectedNodesCount > 0
      prevOperable !== operable && commit( 'UPDATE_OPERABLE', operable )
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
