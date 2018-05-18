import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
//pd缓存
import user from './user'
import advertiser from './advertiser'
import ad from './ad'
import cm from './cm'
import report from './report'

const state = {

}
const getters = {

}
const mutations = {

}
const actions = {

}
const modules = {
  user,
  advertiser,
  ad,
  cm,
  report
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
  plugins: [createPersistedState()],
  strict: process.env.NODE_ENV !== 'production'   //在生产环境启用导致性能损失
})
