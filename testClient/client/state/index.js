import Vue from 'vue'
import Vuex from 'vuex'
import * as modules from './modules/index'
import app from './modules/app'

Vue.use( Vuex )

export default new Vuex.Store( {
  modules
} )