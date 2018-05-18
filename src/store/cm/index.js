import fetch from '@/services/fetch'

const state = {
  projectList: [],//项目列表
  activityList:[],//活动列表
  mediaList:[],//媒体列表 2维数组 && 点位列表
  pointList:[],//点位列表
  sohuAdPutType:[],//sohu广告投放类型
  iQIYI:[],//sohu广告投放类型
}

const mutations = {
  UPDATE_PROJECTLIST ( state, projectList) {
    state.projectList = projectList
  },
  UPDATE_ACTIVITYLIST ( state, activityList) {
    state.activityList = activityList
  },
  UPDATE_MEDIALIST ( state, mediaList) {
    state.mediaList = mediaList
  },

  UPDATE_POINTLIST ( state, pointList) {
    state.pointList = pointList
  },
  UPDATE_SOHUADPUTTYPE ( state, sohuAdPutType) {
    state.sohuAdPutType = sohuAdPutType
  },
  UPDATE_IQIYI ( state, iQIYI) {
    state.iQIYI = iQIYI
  },
  
}
const actions = {
  fetch_sohuAdPutType({ commit }) {
    return new Promise( (resolve, reject) => {
      fetch.post("/creative/get_sohu_industry")
        .then(res => {
          if (res.ret == 0&&Array.isArray(res.data)) {
            let typeTree = res.data;
            commit('UPDATE_SOHUADPUTTYPE', typeTree)
            resolve(typeTree);
          } else {
            reject(new Error(res.msg||'sohu广告投放类型 返回值为空'));
          }
        })
        .catch(err => {
          reject(err||'sohu广告投放类型 err')
        });
    })
  },
  fetch_iQIYI({ commit }) {
    return new Promise( (resolve, reject) => {
      fetch.post("/creative/get_iqiyi_tag")
        .then(res => {
          if (res.ret == 0&&Array.isArray(res.data)) {
            let typeTree = res.data;
            commit('UPDATE_IQIYI', typeTree)
            resolve(typeTree);
          } else {
            reject(new Error(res.msg||'爱奇艺tag标签 返回值为空'));
          }
        })
        .catch(err => {
          reject(err||'爱奇艺tag标签 err')
        });
    })
  },
  fetch_getProjects({ commit },data) {
    return new Promise( (resolve, reject) => {
      // fetch.post("/campaign/project", { brand_id: brand_id ,product_line:product_line})
      fetch.post("/campaign/project", data)
        .then(res => {
          if (res.ret == 0&&res.data) {
            let projects = res.data;
            commit('UPDATE_PROJECTLIST', res.data)
            resolve(projects);
          } else {
            reject(new Error(res.msg||'项目 返回值为空'));
          }
        })
        .catch(err => {
          reject(err)
        });
    })
  },
  fetch_activities({ commit },data){
    //{ project_id: project_id,product_line:product_line }
    return new Promise( (resolve, reject) => {
      fetch.post("/campaign/activity", data)
        .then(res => {
          if (res.ret == 0&&res.data) {
            let activities = res.data;
            commit('UPDATE_ACTIVITYLIST', activities)
            resolve(activities);
          } else {
            reject(new Error(res.msg||'活动返回值为空'));
          }
        })
        .catch(err => {
          reject(err);
        });
      });
  },
  fetch_media({ commit },ader_id){
    return new Promise( (resolve, reject) => {
      fetch.post("/advertiser/getAderMedia", { ader_id: ader_id })
        .then(res => {
          if (res.ret == 0&&res.data) {
            let media = res.data;
            commit('UPDATE_MEDIALIST', media)
            resolve(media);
          } else {
            reject(new Error(res.msg||'媒体 返回值为空'));
          }
        })
        .catch(err => {
          reject(err);
        });
      });
  },




}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
