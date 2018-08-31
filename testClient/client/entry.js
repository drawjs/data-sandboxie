import Vue from 'vue'
import TheApp from './components/TheApp.vue'
import store from './state/index'

new Vue( {
  el        : '#app',
  components: {
    TheApp
  },
  template: '<TheApp />',
  store
} ).$mount()