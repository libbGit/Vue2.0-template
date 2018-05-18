const mutations = {
  UPDATE_STEP_INDEX ( state, step_index) {
    state.step_index = step_index
  },
  UPDATE_CAMPAIGN_UPDATE_TYPE (state, campaign_update_type) {
    state.campaign_update_type = campaign_update_type
  },
  UPDATE_CAMPAIGN_AUDIT_STATUS (state, campaign_audit_status) {
    state.campaign_audit_status = campaign_audit_status
  },
  UPDATE_RUN_STATUS (state, run_status) {
    state.run_status = run_status
  },
  UPDATE_BUDGET (state, budget) {
    state.budget = budget
  },
  UPDATE_START_DATE (state, start_date) {
    state.start_date = start_date
  },
  UPDATE_END_DATE (state, end_date) {
    state.end_date = end_date
  },
  UPDATE_TIMESET_CHECK (state, timeset_check) {
    state.timeset_check = timeset_check
  },
  UPDATE_LOCAL_CHECK (state, local_check) {
    state.local_check = local_check
  },
  UPDATE_FREQUENCY_CHECK (state, frequency_check) {
    state.frequency_check = frequency_check
  },
  UPDATE_SPEED_CHECK (state, speed_check) {
    state.speed_check = speed_check
  },
  UPDATE_MEDIA_CHECK (state, media_check) {
    state.media_check = media_check
  },
  UPDATE_ADVANCE_CHECK (state, advance_check) {
    state.advance_check = advance_check
  },
  UPDATE_TIMESET( state, timeset ) {
    state.timeset = timeset;
  },
  UPDATE_LOCAL ( state, local) {
    state.local = local;
  },
  UPDATE_PLATFORM_ID ( state, platform_id) {
    state.platform_id = platform_id;
  },
  UPDATE_SPEED ( state, speed) {
    state.speed = speed
  },
  UPDATE_FREQUENCY_TYPE ( state, frequency_type) {
    state.frequency_type = frequency_type
  },
  UPDATE_FREQUENCY ( state, frequency) {
    state.frequency = frequency
  },
  UPDATE_FREQUENCY_DAY ( state, frequency_day) {
    state.frequency_day = frequency_day
  },
  UPDATE_MEDIATYPE_ID (state, mediatype_id) {
    state.mediatype_id = mediatype_id
  },
  UPDATE_CHANNEL_ID (state, channel_id) {
    state.channel_id = channel_id
  },
  UPDATE_POSITION_ID (state, position_id) {
    state.position_id = position_id
  },
  UPDATE_ADFORM_ID (state, adform_id) {
    state.adform_id = adform_id
  },
  UPDATE_AD_POS_LIST (state, ad_pos_list) {
    state.ad_pos_list = ad_pos_list
  },
  UPDATE_AD_POS (state, ad_pos) {
    state.ad_pos = ad_pos
  },
  UPDATE_AD_POS_EXCEPT (state, ad_pos_except) {
    state.ad_pos_except = ad_pos_except
  },
  UPDATE_WEBVIEW(state, webview){
    state.webview = webview
  },
  UPDATE_DEVICE_TYPE (state, device_type) {
    state.device_type = device_type
  },
  UPDATE_OS(state, os){
    state.os = os
  },
  UPDATE_NET_CONFIG(state, value){
    state.net_config = value
  },
  UPDATE_NETWORK(state, value){
    state.network = value
  },
  // 人群包
  UPDATE_GROUP_ID (state, group_id) {
    state.group_id = group_id
  },
  UPDATE_GROUP_NAME (state, group_name) {
    state.group_name = group_name
  },
  UPDATE_IS_SAVE_GROUP (state, is_save_group) {
    state.is_save_group = is_save_group
  },
  UPDATE_GROUP_TYPE (state, group_type) {
    state.group_type = group_type
  },
  UPDATE_GROUP_VALIDATY (state, group_validaty) {
    state.group_validaty = group_validaty
  },
  UPDATE_GROUP_INFO (state, group_info) {
    state.group_info = group_info
  },
  UPDATE_GROUP_KEYS (state, group_keys) {
    state.group_keys = group_keys
  },
  UPDATE_GROUP_COOKIE (state, group_cookie) {
    state.group_cookie = group_cookie
  },
  UPDATE_GROUP_ID_TYPE (state, group_id_type) {
    state.group_id_type = group_id_type
  },
  UPDATE_GROUP_DEVICE (state, group_device) {
    state.group_device = group_device
  },
  UPDATE_GROUP_ENCRYPT (state, group_encrypt) {
    state.group_encrypt = group_encrypt
  },
  UPDATE_ZONE_INFO (state, zone_info) {
    state.zone_info = zone_info
  },
}

export default mutations
