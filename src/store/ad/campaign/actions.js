import fetch from '@/services/fetch'

const actions = {
  update_campaign_update_type ({commit}, campaign_update_type) {
    commit('UPDATE_CAMPAIGN_UPDATE_TYPE', campaign_update_type)
  },
  update_campaign_audit_status({commit}, campaign_audit_status){
    commit('UPDATE_CAMPAIGN_AUDIT_STATUS', campaign_audit_status)
  },
  update_step_index ({commit}, step_index) {
    commit('UPDATE_STEP_INDEX', step_index)
  },
  update_run_status ({commit}, run_status) {
    commit('UPDATE_RUN_STATUS', run_status)
  },
  update_budget ({commit}, budget) {
    commit('UPDATE_BUDGET', budget)
  },
  update_start_date ({commit}, start_date) {
    commit('UPDATE_START_DATE', start_date)
  },
  update_end_date ({commit}, end_date) {
    commit('UPDATE_END_DATE', end_date)
  },
  update_timeset_check ({commit}, timeset_check) {
    commit('UPDATE_TIMESET_CHECK', timeset_check)
  },
  update_local_check ({commit}, local_check) {
    commit('UPDATE_LOCAL_CHECK', local_check)
  },
  update_frequency_check ({commit}, frequency_check) {
    commit('UPDATE_FREQUENCY_CHECK', frequency_check)
  },
  update_speed_check ({commit}, speed_check) {
    commit('UPDATE_SPEED_CHECK', speed_check)
  },
  update_media_check ({commit}, media_check) {
    commit('UPDATE_MEDIA_CHECK', media_check)
  },
  update_advance_check ({commit}, advance_check) {
    commit('UPDATE_ADVANCE_CHECK', advance_check)
  },
  update_timeset ({commit}, timeset) {
    commit('UPDATE_TIMESET', timeset);
  },
  update_local ( {commit}, local) {
    commit('UPDATE_LOCAL', local);
  },
  update_speed ({commit}, speed){
    commit('UPDATE_SPEED', speed)
  },
  update_frequency_type({commit}, value){
    commit('UPDATE_FREQUENCY_TYPE', value)
  },
  update_frequency({commit}, value){
    commit('UPDATE_FREQUENCY', value)
  },
  update_frequency_day({commit}, value){
    commit('UPDATE_FREQUENCY_DAY', value)
  },
  update_platform_id ({commit}, platform_id) {
    commit('UPDATE_PLATFORM_ID', platform_id)
  },
  update_mediatype_id ({commit}, mediatype_id) {
    commit('UPDATE_MEDIATYPE_ID', mediatype_id)
  },
  update_channel_id ({commit}, channel_id) {
    commit('UPDATE_CHANNEL_ID', channel_id)
  },
  update_position_id ({commit}, position_id) {
    commit('UPDATE_POSITION_ID', position_id)
  },
  update_adform_id ({commit}, adform_id) {
    commit('UPDATE_ADFORM_ID', adform_id)
  },
  update_ad_pos_list ({commit}, ad_pos_list) {
    commit('UPDATE_AD_POS_LIST', ad_pos_list)
  },
  update_ad_pos ({commit}, ad_pos) {
    commit('UPDATE_AD_POS', ad_pos)
  },
  update_ad_pos_except ({commit}, ad_pos_except) {
    commit('UPDATE_AD_POS_EXCEPT', ad_pos_except)
  },
  update_webview({commit}, value){
    commit('UPDATE_WEBVIEW', value)
  },
  update_device_type ({commit}, device_type) {
    commit('UPDATE_DEVICE_TYPE', device_type)
  },
  update_os({commit}, value){
    commit('UPDATE_OS', value)
  },
  update_net_config({commit}, value){
    commit('UPDATE_NET_CONFIG', value)
  },
  update_network({commit}, value){
    commit('UPDATE_NETWORK', value);
  },
  update_group_id ({commit}, gruop_id) {
    commit('UPDATE_GROUP_ID', gruop_id)
  },
  update_group_name ({commit}, group_name) {
    commit('UPDATE_GROUP_NAME', group_name)
  },
  update_is_save_group ({commit}, is_save_group) {
    commit('UPDATE_IS_SAVE_GROUP', is_save_group)
  },
  update_group_type ({commit}, group_type) {
    commit('UPDATE_GROUP_TYPE', group_type)
  },
  update_group_validaty ({commit}, group_validaty) {
    commit('UPDATE_GROUP_VALIDATY', group_validaty)
  },
  update_group_info ({commit}, group_info) {
    commit('UPDATE_GROUP_INFO', group_info)
  },
  update_group_keys ({commit}, group_keys) {
    commit('UPDATE_GROUP_KEYS', group_keys)
  },
  update_group_cookie ({commit}, group_cookie) {
    commit('UPDATE_GROUP_COOKIE', group_cookie)
  },
  update_group_id_type ({commit}, group_id_type) {
    commit('UPDATE_GROUP_ID_TYPE', group_id_type)
  },
  update_group_device ({commit}, group_device) {
    commit('UPDATE_GROUP_DEVICE', group_device)
  },
  update_group_encrypt ({commit}, group_encrypt) {
    commit('UPDATE_GROUP_ENCRYPT', group_encrypt)
  },
  update_zone_info ({commit}, zone_info) {
    commit('UPDATE_ZONE_INFO', zone_info)
  },
  padding_group ({dispatch}, payload) {
    dispatch('update_group_id', payload.group_id || '');
    dispatch('update_group_name', payload.group_name || '');
    dispatch('update_is_save_group', payload.is_save_group || false);
    dispatch('update_group_type', payload.group_type || '1');
    dispatch('update_group_validaty', payload.group_validaty || '30');
    dispatch('update_group_info', payload.group_info || '');
    dispatch('update_group_keys', payload.group_keys || []);
    dispatch('update_group_cookie', payload.group_cookie || '');
    dispatch('update_group_id_type', payload.group_id_type || '1');
    dispatch('update_group_device', payload.group_device || '');
    dispatch('update_group_encrypt', payload.group_encrypt || '0');
  },
  create_group({state, getters, dispatch}) {
    return new Promise( (resolve, reject) => {
      return fetch.post('/group/create', getters.group_data ).then(function (res) {
        if( res.ret == 0) {
          dispatch('update_group_id', res.data.id)
          resolve(res);
        }
        else {
          reject(new Error(res.msg))
        }
      }).catch(function (err) {
        reject(err);
      });
    })
  },
  update_group({state, rootState, getters}) {
    return new Promise( (resolve, reject) => {
      return fetch.post('/group/update', {
        // id: rootState.ad.campaign_id,
        ...getters.group_data
      }).then(function (res) {
        if( res.ret == 0) {
          resolve(res);
        }
        else {
          reject(new Error(res.msg))
        }
      }).catch(function (err) {
        reject(err);
      });
    })
  },
  // 创建广告计划 - 第一步
  create_campaign_step1({state, rootState, dispatch}, payload){
    return new Promise( (resolve, reject) => {
      fetch.post('/campaign/step', {
        id: rootState.ad.campaign_id,
        advertiser_id: rootState.ad.ader_id,
        brand_id: rootState.ad.brand_id,
        product_line: rootState.ad.product_id,
        project_id: rootState.ad.project_id,
        activity_id: rootState.ad.activity_id,
        name: rootState.ad.campaign_name,
        budget: state.budget,
        start_time: state.start_date,
        end_time: state.end_date,
      }).then( res => {
        if( res.ret == 0 ) {
          if(res.data.id) {
            dispatch('ad/update_campaign_id', res.data.id, {root: true})
          }
          resolve(res)
        }
        else {
          reject(new Error(res.msg))
        }
      }).catch( err => {
        reject( err )
      })
    })
  },
  // 创建广告计划 - 第二步
  create_campaign_step2({state, rootState, dispatch}, payload){
    return new Promise( (resolve, reject) => {
      fetch.post('/campaign/step', {
        id: rootState.ad.campaign_id,

        timeset_check: state.timeset_check ? 1: 0,
        time_setting: state.timeset,

        local_check: state.local_check ? 1: 0,
        local: state.local.join(','),

        speed_check: state.speed_check ? 1: 0,
        speed: state.speed,

        frequency_check: state.frequency_check ? 1: 0,
        frequency_type: state.frequency_type,
        frequency: state.frequency,
        frequency_day: state.frequency_day,

        media_check: state.media_check ? 1: 0,

        platform_id: state.platform_id.join(','),
        mediatype_id: state.mediatype_id.join(','),
        channel_id: state.channel_id.join(','),
        position_id: state.position_id.join(','),
        adform_id: state.adform_id.join(','),
        ad_pos: state.ad_pos.join(','),
        ad_pos_except: state.ad_pos_except.join(','),

        advance_check: state.advance_check ? 1: 0,
        net_config: state.net_config.join(','),
        network: state.network.join(','),
        device_type: state.device_type.join(','),
        os: state.os.join(','),
        webview: state.webview.join(','),
      }).then( res => {
        if( res.ret == 0 ) {
          resolve(res)
        }
        else {
          reject(new Error(res.msg))
        }
      }).catch( err => {
        reject( err )
      })
    })
  },
  // 创建广告计划 - 第三步
  create_campaign_step3({state, rootState, dispatch}, payload){
    return new Promise( (resolve, reject) => {
      fetch.post('/campaign/step', {
        id: rootState.ad.campaign_id,
        group: state.group_id,
      }).then( res => {
        if( res.ret == 0 ) {
          resolve(res)
        }
        else {
          reject(new Error(res.msg))
        }
      }).catch( err => {
        reject( err )
      })
    })
  },
  // 创建广告计划 - 第四步
  create_campaign_step4({state, rootState, dispatch}, payload){
    return new Promise( (resolve, reject) => {
      fetch.post('/campaign/step', {
        id: rootState.ad.campaign_id,
        creative_group_ids: state.zone_info.map( item => { return item.creative_group_id}).join()
      }).then( res => {
        if( res.ret == 0 ) {
          resolve(res)
        }
        else {
          reject(new Error(res.msg))
        }
      }).catch( err => {
        reject( err )
      })
    })
  },
  // 推送计划到PBS
  push_campaign({state, rootState, dispatch}, payload){
    payload = payload || {}
    return new Promise( (resolve, reject) => {
      fetch.post('/campaign/push', {
        id: payload.id || rootState.ad.campaign_id
      }).then( res => {
        if( res.ret == 0 ) {
          resolve(res)
        }
        else {
          reject(new Error(res.msg))
        }
      }).catch( err => {
        reject( err )
      })
    })
  },
  padding_campaign( {dispatch, state, rootState}, payload){
    payload = payload || {}
    dispatch('ad/update_campaign_id', payload.id || '', {root: true})
    dispatch('ad/update_campaign_name', payload.name || '', {root: true})

    dispatch('update_budget', payload.budget || '')
    if( payload.start_time ) {
      dispatch('update_start_date', payload.start_time)
      dispatch('update_end_date', payload.end_time)
    }
    // 时间设置默认为全时段
    dispatch('update_timeset_check', payload.timeset_check == '1' ? true : false)
    dispatch('update_timeset', payload.time_setting || "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")

    dispatch('update_local_check', payload.local_check == '1' ? true : false)
    dispatch('update_local', payload.local && payload.local.split(',') || [])

    dispatch('update_speed_check', payload.speed_check == '1' ? true : false)
    dispatch('update_speed', payload.speed || '1')

    dispatch('update_frequency_check', payload.frequency_check == '1' ? true : false)
    // 未选择 跨媒体曝光类型, 后台会返回0，这里把0转化为""
    var frequency_type = payload.frequency_type == '0' ? '' : payload.frequency_type
    dispatch('update_frequency_type', frequency_type || '')

    var frequency = payload.frequency == '0' ? '' : payload.frequency
    dispatch('update_frequency', frequency || '')

    var frequency_day = payload.frequency_day == '0' ? '' : payload.frequency_day
    dispatch('update_frequency_day', frequency_day || '')

    dispatch('update_media_check', payload.media_check == '1' ? true : false)
    dispatch('update_platform_id', payload.platform_id && payload.platform_id.split(',') || [])
    dispatch('update_mediatype_id', payload.mediatype_id && payload.mediatype_id.split(',') || [])
    dispatch('update_channel_id', payload.channel_id && payload.channel_id.split(',') || [])
    dispatch('update_position_id', payload.position_id && payload.position_id.split(',') || [])
    dispatch('update_adform_id', payload.adform_id && payload.adform_id.split(',') || [])

    dispatch('update_ad_pos_list', [])
    dispatch('update_ad_pos', payload.ad_pos && payload.ad_pos.split(',') || [])
    dispatch('update_ad_pos_except', payload.ad_pos_except && payload.ad_pos_except.split(',') || [])

    dispatch('update_advance_check', payload.advance_check == '1' ? true : false)
    dispatch('update_net_config', payload.net_config && payload.net_config.split(',') || [])
    dispatch('update_network', payload.network && payload.network.split(',') || [])
    dispatch('update_device_type', payload.device_type && payload.device_type.split(',') || [])
    dispatch('update_os', payload.os && payload.os.split(',') || [])
    dispatch('update_webview', payload.webview && payload.webview.split(',') || [])

    dispatch('update_group_id', payload.group || '')

    /*if( payload.zone_info && payload.zone_info.length) {
      var zone_info = [];
      if( typeof payload.zone_info == "string" ) {
        zone_info = JSON.parse(payload.zone_info)
      }
      zone_info = zone_info.map( item => {
       return item.data
      })
    }
    else {
      var zone_info = [];
    }
    dispatch('update_zone_info', zone_info)*/

  }
}

export default actions
