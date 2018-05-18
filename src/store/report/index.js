import fetch from '@/services/fetch';

const state = {
  currentRoute: '',
  advertiserId: '',  //从项目进入时选择的advertiser id

  // 设置按钮列表
  settings: {
    advertiser: [],
    brand: [],
    productline: [],
    project: [],
    activity: [],
    campaign: [],
  },

  // el_selects_value:{
  //   advertiser_el_selects:{  //广告主页面所有选择的下拉select的记录
  //     device_percent:{
  //       filterValue:'',
  //       indexValue:'',
  //       headerName:''
  //     },
  //     advertise_type:{
  //       filterValue:''
  //     },
  //     media_type:{
  //       filterValue:''
  //     },
  //     region_type:{
  //       filterValue:''
  //     },
  //     point_position:{
  //       filterValue:'',
  //       mediaValue:''
  //     },
  //     crowd_data:{
  //       filterValue:'',
  //       indexValue:''
  //     },
  //     creative_group:{
  //       filterValue:'',
  //       indexValue:''
  //     },
  //     creative_data:{
  //       filterValue:''
  //     }
  //   },
  // },


  //每个菜单选项栏的"自定义条件"和"时间"
  advertiser_report: {
    filterList: [],     //自定义条件
    filterValue: [],    //已选择自定义条件      可选
    filterKey:[],
    dateValue: []       //选择的时间范围        默认为7天
  },

  brand_report: {
    filterList: [],
    filterValue: [],
    filterKey:[],
    dateValue: []
  },

  productline_report: {
    filterList: [],
    filterValue: [],
    filterKey:[],
    dateValue: []
  },

  project_report: {
    filterList: [],
    filterValue: [],
    filterKey:[],
    dateValue: []
  },

  activity_report: {
    filterList: [],
    filterValue: [],
    filterKey:[],
    dateValue: []
  },

  campaign_report: {
    filterList: [],
    filterValue: [],
    filterKey:[],
    dateValue: []
  },
}

const mutations = {
  UPDATE_ADVERTISER_ID(state, data){
    state.advertiserId = data;
  },

  //设置当前路由
  UPDATE_CURRENT_ROUTE(state, data) {
    state.currentRoute = data.substring(data.lastIndexOf("/") + 1);  //"advertiser"
  },

  //设置广告主报告
  ADD_ADVERTOSER_SETTING(state, data) {
    state.settings.advertiser = data;
  },
  UPDATE_ADVERTOSER_SETTING(state, data) {
    state.settings.advertiser = state.settings.advertiser.map((item) => {
      if (item.id == data.id) {
        return { ...item, checked: data.checked, disabled: data.disabled };
      } else {
        return item;
      }
    });
  },
  UPDATE_ADVERTISER_REPORT(state, { filterList, filterValue, filterKey, dateValue }) {
    if (filterList) {
      state.advertiser_report.filterList = filterList;
    }
    if (filterValue) {
      state.advertiser_report.filterValue = filterValue;
    }
    if (filterKey) {
      state.advertiser_report.filterKey = filterKey;
    }
    if (dateValue) {
      state.advertiser_report.dateValue = dateValue;
    }
  },

  //设置品牌的
  ADD_BRAND_SETTING(state, data) {
    state.settings.brand = data
  },
  UPDATE_BRAND_SETTING(state, data) {
    state.settings.brand = state.settings.brand.map((item) => {
      if (item.id == data.id) {
        return { ...item, checked: data.checked, disabled: data.disabled };
      } else {
        return item;
      }
    });
  },

  UPDATE_BRAND_REPORT(state, { filterList, filterValue, filterKey, dateValue }) {
    if (filterList) {
      state.brand_report.filterList = filterList;
    }
    if (filterValue) {
      state.brand_report.filterValue = filterValue;
    }
    if (filterKey) {
      state.brand_report.filterKey = filterKey;
    }
    if (dateValue) {
      state.brand_report.dateValue = dateValue;
    }
  },

  //设置产品线
  ADD_PRODUCTLINE_SETTING(state, data) {
    state.settings.productline = data
  },
  UPDATE_PRODUCTLINE_SETTING(state, data) {
    state.settings.productline = state.settings.productline.map((item) => {
      if (item.id == data.id) {
        return { ...item, checked: data.checked, disabled: data.disabled };
      } else {
        return item;
      }
    });
  },

  UPDATE_PRODUCTLINE_REPORT(state, { filterList, filterValue,filterKey, dateValue }) {
    if (filterList) {
      state.productline_report.filterList = filterList;
    }
    if (filterValue) {
      state.productline_report.filterValue = filterValue;
    }
    if (filterKey) {
      state.productline_report.filterKey = filterKey;
    }
    if (dateValue) {
      state.productline_report.dateValue = dateValue;
    }
  },

  //设置 项目
  ADD_PROJECT_SETTING(state, data) {
    state.settings.project = data
  },
  UPDATE_PROJECT_SETTING(state, data) {
    state.settings.project = state.settings.project.map((item) => {
      if (item.id == data.id) {
        return { ...item, checked: data.checked, disabled: data.disabled };
      } else {
        return item;
      }
    });
  },

  UPDATE_PROJECT_REPORT(state, { filterList, filterValue, filterKey, dateValue }) {
    if (filterList) {
      state.project_report.filterList = filterList;
    }
    if (filterValue) {
      state.project_report.filterValue = filterValue;
    }
    if (filterKey) {
      state.project_report.filterKey = filterKey;
    }
    if (dateValue) {
      state.project_report.dateValue = dateValue;
    }
  },

  //设置 活动
  ADD_ACTIVITY_SETTING(state, data) {
    state.settings.activity = data
  },
  UPDATE_ACTIVITY_SETTING(state, data) {
    state.settings.activity = state.settings.activity.map((item) => {
      if (item.id == data.id) {
        return { ...item, checked: data.checked, disabled: data.disabled };
      } else {
        return item;
      }
    });
  },

  UPDATE_ACTIVITY_REPORT(state, { filterList, filterValue, filterKey, dateValue }) {
    if (filterList) {
      state.activity_report.filterList = filterList;
    }
    if (filterValue) {
      state.activity_report.filterValue = filterValue;
    }
    if (filterKey) {
      state.activity_report.filterKey = filterKey;
    }
    if (dateValue) {
      state.activity_report.dateValue = dateValue;
    }
  },

  //设置 推广计划
  ADD_CAMPAIGN_SETTING(state, data) {
    state.settings.campaign = data
  },
  UPDATE_CAMPAIGN_SETTING(state, data) {
    state.settings.campaign = state.settings.campaign.map((item) => {
      if (item.id == data.id) {
        return { ...item, checked: data.checked, disabled: data.disabled };
      } else {
        return item;
      }
    });
  },

  UPDATE_CAMPAIGN_REPORT(state, { filterList, filterValue, filterKey, dateValue }) {
    if (filterList) {
      state.campaign_report.filterList = filterList;
    }
    if (filterValue) {
      state.campaign_report.filterValue = filterValue;
    }
    if (filterKey) {
      state.campaign_report.filterKey = filterKey;
    }
    if (dateValue) {
      state.campaign_report.dateValue = dateValue;
    }
  },


  /**更新报告页面所选择的select下拉框的值 */
  
  // UPDATE_ADVERTISER_EL_SELECTS(state, data) {
  //   state.el_selects_value.advertiser_el_selects = data;
  // },

}


const fetch_report_action = {
  //自定义条件
  fetch_filter_data({ commit, state },param) {
    /*
     * 
     * type//  adv=广告主，brand=品牌，project=项目，campaign=活动，ad=计划
     */
    return new Promise((resolve, reject) => {
      let type = '';
      if(state.currentRoute=='advertiser'){
        type = 'adv'
      }else if(state.currentRoute=='brand'){
        type = 'brand'
      }
      else if(state.currentRoute=='productline'){
        type = 'line'
      }
      else if(state.currentRoute=='project'){
        type = 'project'
      }
      else if(state.currentRoute=='activity'){
        type = 'campaign'
      }
      else if(state.currentRoute=='campaign'){
        type = 'ad'
      }

      // if(param.parentId && state.currentRoute=='brand'){
      //   state.advertiserId = param.parentId;
      // }

      fetch.post(`/report/getAdNodes`,
        {
          type: type,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  //获取广告主数据，品牌数据等
  fetch_advertiser_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/${state.currentRoute}`,
        {
          limit: param.limit,
          page: param.page,
          date: state[`${state.currentRoute}_report`].dateValue,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  //获取广告主趋势
  fetch_advertiser_trend_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/${state.currentRoute}_trend`,
        {
          type: param.type,         //可接受多个值  1个或2个
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  //获取终端占比
  fetch_device_percent_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
        fetch.post(`/${state.currentRoute}_report/${state.currentRoute}_end`,   // //`/${state.currentRoute}_report/${state.currentRoute}_end`
          {
            type: param.type,   //1 2 3 4 
            index: param.index, // 5 6 7 8
            id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
            date: state[`${state.currentRoute}_report`].dateValue,
            ader_id: state.advertiserId,
            parent_id: param.parentId?param.parentId:''
          }
        )
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          })
    })
  },

  //获取广告形式top5
  fetch_advertiser_type_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/${state.currentRoute}_type`,
        {
          type: param.type,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },


  //获取媒体形式top5
  fetch_media_type_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/media`,   //接口已定义好
        {
          type: param.type,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  //获取地域top5
  fetch_region_type_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/local`,     //接口未定义好，传入type
        {
          type: param.type,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {

          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },


  //获取点位媒体列表
  fetch_point_position_media({ commit, state },param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/advertiser_report/media_list`,     //所有的都走 advertiser_report/media_list接口
        {
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },


  //获取点位列表
  fetch_point_position_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/pos`,     //接口已定义，media_id可省略，但也可传
        {
          type: param.type,
          media_id: param.media,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },


  //获取人群列表
  fetch_crowd_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/crowd`,     //接口已定义好
        {
          type: param.type,
          index: param.index,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  //获取创意组数据
  fetch_creative_group_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/creative_group`,     //接口未定义好，传入type, index
        {
          type: param.type,
          index: param.index,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },


  //获取 创意 数据
  fetch_creative_data({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      fetch.post(`/${state.currentRoute}_report/creative`,     //接口未定义好，传入type
        {
          type: param.type,
          id: state[`${state.currentRoute}_report`].filterValue.length == 0 ? '' : state[`${state.currentRoute}_report`].filterValue,
          date: state[`${state.currentRoute}_report`].dateValue,
          ader_id: state.advertiserId,
          parent_id: param.parentId?param.parentId:''
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  },
}

const actions = {
  ...fetch_report_action,
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
