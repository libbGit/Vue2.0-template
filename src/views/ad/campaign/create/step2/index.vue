<template>
  <!-- <div class="m__wraper">
    <div class="m__sidebar">
      <sidebar-tree />
    </div> -->

    <div class="m__content">
      <!-- 导航栏 -->
      <div class="clearfix nav-wrap">
        <div class="pull-left">
          <activity-nav />
        </div>
      </div>

      <div class="campaign__wrap">
        <campaign-steps  @click:nav="gotoStep"/>

        <div class="form-wrap">
          <div class="center860">
            <el-form ref="form" label-position="left" label-width="130px" size="mini">

              <!-- 时段设置 -->
              <schedule-select />

              <!-- 地域定向 -->
              <location-tree />

              <!-- 投放速度 -->
              <speed-config />

              <!-- 跨媒体曝光类型 -->
              <frequency-config />

              <!-- 媒体定向 -->
              <media-tag @pos:status="getPosStatus"/>

              <!-- 高级设置 -->
              <advance-config />

            </el-form>
          </div>
        </div>

        <div class="btn-wrap">
          <el-button size="small" @click="resetForm('form')">上一步</el-button>
          <el-button size="small" @click="handle_reset" v-if="campaign_update_type == 'create'">重置</el-button>
          <el-button size="small" :disabled="!isMediaTagFinish" type="primary" @click="submitForm('form')">下一步</el-button>
        </div>
      </div>

    </div>
  <!-- </div> -->
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'

  import SidebarTree from '@/views/ad/public/sidebar-tree'
  import ActivityNav from '@/views/ad/public/activity-nav'

  import CampaignSteps from '../public/campaign-steps'

  import ScheduleSelect from './public/schedule-select'
  import LocationTree from './public/location-tree'

  import PlatformConfig from './public/platform-config'
  import SpeedConfig from './public/speed-config'
  import FrequencyConfig from './public/frequency-config'

  import MediaTag from './public/media-tag'

  import AdvanceConfig from './public/advance-config'


  export default {
    name: 'CampaignStep2',
    data () {
      return {
        isMediaTagFinish:false  
      }
    },
    computed: {
      ...mapState('ad/campaign', [
        'campaign_update_type',
        'timeset_check',
        'timeset',
        'local_check',
        'local',
        'platform',
        'speed',
        'frequency_check',
        'frequency_type',
        'frequency',
        'frequency_day',
        'ad_tag',
        'ad_pos',
        'ad_pos_except',
        'device_type',
        'webview',
        'os',
        'net_config',
        'network',
      ]),
      ...mapState('ad', [
        'campaign_id',
      ])
    },
    methods: {
      ...mapActions('ad/campaign', [
        'update_step_index',
        'create_campaign_step2',
        'update_timeset_check',
        'update_local_check',
        'update_frequency_check',
        'update_speed_check',
        'update_media_check',
        'update_advance_check',
        'update_ad_pos_list',
        'update_ad_pos',
      ]),
      // ...mapState('ad/campaign',[
      //   'campaign_update_type',
      //   'ad_pos_list',
      //   'ad_pos',
      //   'ad_pos_except',
      //   'platform_id',
      //   'mediatype_id',
      //   'channel_id',
      //   'position_id',
      //   'adform_id',
      // ]),
      handle_reset(){
        this.update_timeset_check(false);
        this.update_local_check(false);
        this.update_frequency_check(false);
        this.update_speed_check(false);
        this.update_media_check(false);
        this.update_advance_check(false);
      },
      valid () {
        var _this = this;
        return new Promise( (resolve, reject) => {
          if ( this.timeset_check &&
            (this.timeset == "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" || !this.timeset)
            )
          {
            reject( new Error('请选择时段'));
          }
          else if ( this.local_check && this.local.length == 0) {
            reject( new Error('请选择地域定向'));
          }
          else if ( this.frequency_check && !this.frequency_type ) {
            reject( new Error('请选择跨媒体曝光类型'));
          }
          else if (this.frequency_check && (this.frequency_type == '3') ) {
            if ( !this.frequency_day ) {
              reject( new Error('请输入跨媒体曝光类型的"天"选项'));
            }
            else if ( parseInt(this.frequency_day) != this.frequency_day || parseInt(this.frequency_day) <= 0 ) {
              reject( new Error('跨媒体曝光类型的"天"选项必须为大于0的整数'));
            }
            else if ( !this.frequency ) {
              reject( new Error('请输入跨媒体曝光类型的"次/人"选项'));
            }
            else if ( parseInt(this.frequency) != this.frequency || parseInt(this.frequency) <= 0 ) {
              reject( new Error('跨媒体曝光类型的"次/人"选项必须为大于0的整数'));
            }
            else {
              resolve();
            }
          }
          else if ( this.frequency_check && this.frequency_type) {
            if ( !this.frequency ) {
              reject( new Error('请输入跨媒体曝光类型的"次/人"选项'));
            }
            else if ( parseInt(this.frequency) != this.frequency || parseInt(this.frequency) <= 0 ) {
              reject( new Error('跨媒体曝光类型的"次/人"选项必须为大于0的整数'));
            }
            else {
              resolve();
            }
          }
          else {
            resolve();
          }
        })
      },
      submitForm() {
        this.valid().then( () => {
            this.create_campaign_step2().then( () => {
                this.$router.push('step3');
              }).catch( err => {
                this.$message.error(err.message);
              })
          }).catch( err => {
            this.$message.error(err.message)
          })
      },
      resetForm() {
        this.$router.push('step1');
      },

      gotoStep(step){
        this.valid().then( () => {
            this.create_campaign_step2().then( () => {
              if(step=="1"){
                this.$router.push("step1");
              }
              if(step=="2"){
                this.$router.push("step2");
              }
              if(step=="3"){
                this.$router.push("step3");
              }
              if(step=="4"){
                this.$router.push("step4");
              }
            }).catch( err => {
              this.$message.error(err.message);
            })
          }).catch( err => {
            this.$message.error(err.message)
          })
      },

      //点位是否加载完
      getPosStatus(status){
        if(status=="finished"){
          this.isMediaTagFinish = true;
        }else{
          this.isMediaTagFinish = false;
        }
      },

      fetch_campaign_info() {
        return new Promise((resolve, reject) => {
          fetch
            .post("/campaign/view", {
              id: this.campaign_id
            })
            .then(res => {
              if (res.ret == 0) {
                resolve(res.data);
              } else {
                reject(new Error(res.msg));
                console.error(res.msg);
              }
            })
            .catch(err => {
              reject(new Error(err));
              console.error(err);
            });
        });
      },
    },
    created () {
      this.update_step_index(1);
      console.log("23112");
      // this.update_ad_pos_list([]);
      // this.fetch_campaign_info().then(data => {
      //   this.update_ad_pos(data.ad_pos && data.ad_pos.split(',') || []);
      // })
      // .catch(err => {
      //   console.log(err);
      // });
      
    },

    components: {
      SidebarTree,
      ActivityNav,
      CampaignSteps,
      ScheduleSelect,
      LocationTree,
      PlatformConfig,
      SpeedConfig,
      FrequencyConfig,
      MediaTag,
      AdvanceConfig,
    }
  }
</script>
