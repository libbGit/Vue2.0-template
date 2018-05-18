import fetch from '@/services/fetch'
import campaign from './campaign'
import _ from "lodash";

const state = {
  // 所管理项目的广告主
  ader_id: '',
  ader_name: '',
  ader_opera_status: '',

  project_id: '',
  project_name: '',
  project_opera_status: '',

  activity_id: '',
  activity_name: '',
  activity_opera_status: '',

  campaign_id: '',
  campaign_name: '',

  //品牌和产品线
  brand_id: '',
  brand_name :'',
  product_id:'',
  product_name:'',

  projects: [],//活动列表，children下是活动列表
  // currentkey:'',//选中项
  treeExpand_key:[],
}

const mutations = {
  UPDATE_TREEEXPAND_KEY (state, data) {
    let id = data.id;
    if (data.type=='add') {
      state.treeExpand_key.push(id);
    }else{
      let index = state.treeExpand_key.indexOf(id);
      state.treeExpand_key.splice(index,1);
    }
  },
  CLEAR_TREEEXPAND_KEY (state) {
    state.treeExpand_key = [];
  },
  UPDATE_BRAND_ID (state, brand_id) {
    state.brand_id = brand_id
  },
  UPDATE_PRODUCT_ID (state, product_id) {
    state.product_id = product_id
  },
  UPDATE_BRAND_NAME(state,brand_name){
    state.brand_name = brand_name
  },
  UPDATE_PRODUCT_NAME(state,product_name){
    state.product_name = product_name
  },
  UPDATE_ADER_ID ( state, ader_id) {
    state.ader_id = ader_id
  },
  UPDATE_ADER_OPERA_STATUS ( state, ader_opera_status) {
    state.ader_opera_status = ader_opera_status
  },
  UPDATE_PROJECT_OPERA_STATUS ( state, project_opera_status) {
    state.project_opera_status = project_opera_status
  },
  UPDATE_ACTIVITY_OPERA_STATUS ( state, activity_opera_status) {
    state.activity_opera_status = activity_opera_status
  },
  UPDATE_ADER_NAME ( state, ader_name) {
    state.ader_name = ader_name
  },
  UPDATE_PROJECTS(state, data) {
    state.projects = data
  },
  insert_project(state, data) {
    state.projects.unshift(data);
  },
  update_project_name(state, data) {
    let project = _.find(state.projects,{id:data.id});
    project.name = data.name;
  },
  insert_activity(state, data) {
    let project_id = data.project_id;
    let project = _.find(state.projects,{id:project_id});
    let cloneProject = _.cloneDeep(project);
    let index = _.findIndex(state.projects,{id:project_id});
    if (project) {
      let id = data.activity_id;
      let name = data.activity_name;
      if (!project.children) {
        cloneProject.children = [];
        cloneProject.children.unshift({id,name});
        state.projects.splice(index, 1, cloneProject)
      }else{
        project.children.push({id,name});
      }
    }
  },
  update_activity_name(state, data) {
    let project_id = data.project_id;
    let project = _.find(state.projects,{id:project_id});
    if (project) {
      let activity = _.find(project.children,{id:data.activity_id});
      activity.name = data.activity_name;
    }
  },
  insert_campaign(state, data) {
    let project_id = data.project_id-0;
    let project = _.find(state.projects,{id:project_id});
    let activity = _.find(project.children,{id:data.activity_id});
    let cloneActivity = _.cloneDeep(activity);
    let index = _.findIndex(project.children,{id:data.activity_id});
    if (activity) {
      let id = data.campaign_id;
      let name = data.campaign_name;
      if (!activity.children) {
        cloneActivity.children = [];
        cloneActivity.children.unshift({id,name});
        project.children.splice(index, 1, cloneActivity)
      }else{
        activity.children.unshift({id,name});
      }
    }
  },
  update_campaign_name_m(state, data) {
    let project_id = data.project_id;
    let project = _.find(state.projects,{id:project_id});
    let activity = _.find(project.children,{id:data.activity_id});
    if (activity) {
      let campaign = _.find(activity.children,{id:data.campaign_id});
      if (campaign) {
        campaign.name = data.campaign_name;
      }
    }
  },
  UPDATE_PROJECT_ID (state, project_id) {
    state.project_id = project_id
  },
  UPDATE_PROJECT_NAME (state, project_name) {
    state.project_name = project_name
  },
  UPDATE_ACTIVITY_ID (state, activity_id) {
    state.activity_id = activity_id
  },
  UPDATE_ACTIVITY_NAME (state, activity_name) {
    state.activity_name = activity_name
  },
  UPDATE_CAMPAIGN_ID (state, campaign_id) {
    state.campaign_id = campaign_id
  },
  UPDATE_CAMPAIGN_NAME (state, campaign_name) {
    state.campaign_name = campaign_name
  },
}

const actions = {
  clear_treeExpand_key ({commit}) {
    commit('CLEAR_TREEEXPAND_KEY')
  },
  update_treeExpand_key ({commit}, data) {
    commit('UPDATE_TREEEXPAND_KEY', data)
  },
  update_brand_id ({commit}, brand_id) {
    commit('UPDATE_BRAND_ID', brand_id)
  },
  update_product_id ({commit}, product_id) {
    commit('UPDATE_PRODUCT_ID', product_id)
  },
  update_brand_name ({commit},brand_name){
     commit('UPDATE_BRAND_NAME',brand_name)
  },
  update_product_name ({commit},product_name){
    commit('UPDATE_PRODUCT_NAME',product_name)
 },
  update_ader_id ({commit}, ader_id) {
    commit('UPDATE_ADER_ID', ader_id);
    commit('CLEAR_TREEEXPAND_KEY')
  },
  update_ader_name ({commit}, ader_name) {
    commit('UPDATE_ADER_NAME', ader_name)
  },
  update_ader_opera_status ({commit}, ader_opera_status) {
    commit('UPDATE_ADER_OPERA_STATUS', ader_opera_status)
  },
  update_ader_opera_status ({commit}, project_opera_status) {
    commit('UPDATE_PROJECT_OPERA_STATUS', project_opera_status)
  },
  update_ader_opera_status ({commit}, activity_opera_status) {
    commit('UPDATE_ACTIVITY_OPERA_STATUS', activity_opera_status)
  },
  fetch_getProjects({ commit },data) {
    return fetch.post('/project/menu',data)
      .then(res => {
        if (res.ret == 0 && res.data) {
          let arr = res.data;
          for(let pro of arr){
            pro._id = 'pro'+pro.id;
            if (Array.isArray(pro.children)) {
              for(let act of pro.children){
                act._id = 'act'+act.id;
                if (Array.isArray(act.children)) {
                  for(let cam of act.children){
                    cam._id = 'cam'+cam.id;
                  }
                }
              }
            }
          }
          commit('UPDATE_PROJECTS', arr)
        }
        else {
          commit('UPDATE_PROJECTS', [])
        }
      })
      .catch(err => {
        console.log(new Error(err));
      })
  },
  update_project_id ({commit}, project_id) {
    commit('UPDATE_PROJECT_ID', project_id)
  },
  update_project_name ({commit}, project_name) {
    commit('UPDATE_PROJECT_NAME', project_name)
  },
  update_activity_id ({commit}, activity_id) {
    commit('UPDATE_ACTIVITY_ID', activity_id)
  },
  update_activity_name ({commit}, activity_name) {
    commit('UPDATE_ACTIVITY_NAME', activity_name)
  },
  update_campaign_id ({commit}, campaign_id) {
    commit('UPDATE_CAMPAIGN_ID', campaign_id)
  },
  update_campaign_name ({commit}, campaign_name) {
    commit('UPDATE_CAMPAIGN_NAME', campaign_name)
  },
  fetch_getStatus({ commit },data) {
    return new Promise((resolve, reject) => {
      return fetch.post('/type/status',data)
        .then(res => {
          if (res.ret == 0 && res.data) {
            resolve(res.data)
          }else {
            reject(res.ret);
          }
        })
        .catch(err => {
          reject(err);
        })
    });
    
  },
}

const getters = {
  highlight_key: (state) => {
    if (state.project_id=='') {
      return ''
    }else{
      if (state.activity_id=='') {
        return 'pro'+state.project_id;
      }else{
        if (state.campaign_id=='') {
          return 'act'+state.activity_id;
        }else{
          return 'cam'+state.campaign_id;
        }
      }
    }
  },
}

const modules = {
  campaign
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  modules,
  getters
}
