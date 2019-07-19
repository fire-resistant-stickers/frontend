import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // mainPath: "http://localhost:3001",
    mainPath: "http://167.179.70.182:1116",
    token: null,
    currentDataIndex: -1,
    data : []
  },
  mutations: {
    setToken(state, data) {
      state.token = data
    }
  },
  actions: {

  }
})
