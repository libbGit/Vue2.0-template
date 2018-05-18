import fetch from '@/services/fetch'

const state = {
  // 行业列表
  industryList: [],
  // 代理商
  agentList: [],
  // 品牌/产品线
  brand_forms:[]
}

const mutations = {
  UPDATE_INDUSTRY_LIST(state, data){
    state.industryList = data
  },
  UPDATE_AGENT_LIST(state, data) {
    state.agentList = data
  },
  UPDATE_BRAND_FORM(state, data) {
    state.brand_forms = data
  }
}

const actions = {
  fetch_industry_list ({commit}) {
    return new Promise((resolve, reject) => {
      fetch.get('/advertiser/get_industry')
        .then( res=> {
          if( res.ret == 0 && res.data && res.data.industry_info) {
            commit('UPDATE_INDUSTRY_LIST', res.data.industry_info)
          }
        })
        .catch( err => {
          reject(err);
        })
    })
  },
  fetch_agent_list({commit}) {
    return new Promise((resolve, reject)=> {
      fetch.get('/agent/getAll?offset=0&limit=9999')
        .then( res => {
          if(res.ret == 0 && res.data) {
            commit('UPDATE_AGENT_LIST', res.data)
          }
        })
    })
  },
  // 获取品牌产品线
  fetch_brand_form({commit}, ader_id) {
    return new Promise((resolve, reject) => {
      fetch.post('/brands/getList', {
        ader_id: ader_id
      }).then( res => {
          if(res.ret == 0 ) {
            commit('UPDATE_BRAND_FORM', res.data)
            resolve(res.data);
          }
          else {
            reject(new Error(res.msg))
          }
        }).catch( err => {
          reject(err)
        })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
