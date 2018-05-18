import fetch from '@/services/fetch'
import moment from 'moment'

import mutations from './mutations'
import actions from './actions'

const state = {
  // 当前步骤索引值
  step_index: 0,

  //状态(新建or编辑)
  campaign_update_type: 'create',
  campaign_audit_status:'',//审核状态  只有编辑时才有效
  // 投放状态 (0 未投放 1 投放中 2 已完成)
  run_status: '0',
  // 每日预算
  budget: '',
  // 开始日期
  start_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
  // 结束日期
  end_date: moment().subtract(0, 'days').format('YYYY-MM-DD'),

  // 时段设置
  timeset_check: false,
  timeset: '',
  // 地域定向
  local_check: false,
  local: [],
  // 投放速度 1 匀速 2 加速
  speed_check: false,
  speed: '1',
  // 跨媒体曝光类型
  frequency_check: false,
  frequency_type: '1',
  // 跨媒体曝光次数/人
  frequency: '',
  // 跨媒体曝光自定义周期天数，曝光方式为3时必填, 1-60
  frequency_day: '',

  media_check: false,
  // 平台定向
  platform_id: [],
  // 媒体类型
  mediatype_id: [],
  // 频道
  channel_id: [],
  // 页面位置
  position_id: [],
  // 广告形式
  adform_id: [],

  //点位列表
  ad_pos_list: [],
  // 点位选择
  ad_pos: [],
  // 点位排除
  ad_pos_except: [],

  advance_check:false,
  // 设备定向
  device_type: [],
  // 浏览器定向 1 ie 2 chrome 3 firefox 4safari 5 opera 6 uc 7qq 8 baidu
  webview: [],
  // 操作系统定向 1 IOS 2 Andoird 3 Linux 4 Windows
  os: [],
  // 网络类型 1 2g 2 3g 3 4g 5 wifi 6 Ethernet
  net_config: [],
  // 运营商 1 移动 2 联通 3 电信
  network: [],


  // 人群包 id
  group_id: '',
  // 人群包名称
  group_name: '',
  //  是否保存为常用人群包
  is_save_group: false,
  // 人群包 - 定向类型类型(1 属性定向, 2 ID 定向)
  group_type: '1',
  // 人群包有效期 (30天 60天)
  group_validaty : '30',
  // 所选择属性定向字符串
  group_info: '',
  // 所选择属性定向 keys 值
  group_keys: [],
  // ID 定向 cookie 文件
  group_cookie: '',
  // 设备号类型 1 IDFA 2 IMEI
  group_id_type: '1',
  // 设备号文件ID
  group_device: '',
  // 是否使用md5加密
  group_encrypt: '0',

  // 点位和创意组信息
  zone_info: [],
}

const getters = {
  ad_pos_selected: (state) => {
    return state.ad_pos.filter( item => {
      return state.ad_pos_except.indexOf(item) == -1;
    })
  },
  group_data: (state, getters, rootState) => {
    var data = {
      advertiser_id: rootState.ad.ader_id,
      id: state.group_id,
      name: state.group_name,
      is_common: state.is_save_group ? '1' : '0',
      type: state.group_type,
    }
    if( state.group_type == '1' ) {
      data.info =  state.group_info;
      data.validaty =  state.group_validaty;
      data.group_keys = state.group_keys.join(',');
      data.cookie =  '';
      data.id_type =  '1';
      data.device = '';
      data.encryption = '0';
    }
    else {
      data.info =  '';
      data.group_keys = '';
      data.validaty =  '30';
      data.cookie =  state.group_cookie;
      data.id_type =  state.group_id_type;
      data.device = state.group_device;
      data.encryption = state.group_encrypt ? '1' : '0';
    }
    return data;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
