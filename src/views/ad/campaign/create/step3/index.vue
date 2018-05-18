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
        <campaign-steps @click:nav="gotoStep"/>

        <div class="form-wrap">
          <div class="center860" style="max-width: 1200px;">
            <!--<el-tabs v-model="active_tab">-->
              <!--<el-tab-pane label="可用人群包" name="list">-->
                <group-list :active-tab="active_tab" />
              <!--</el-tab-pane>-->
              <!--<el-tab-pane label="新建人群包" name="create">-->
                <!--<group-create :active-tab="active_tab" style="width: 600px;margin: 0 auto;"/>-->
              <!--</el-tab-pane>-->
            <!--</el-tabs>-->
          </div>
        </div>

        <div class="btn-wrap">
          <!-- <el-button size="small" @click="create_group">创建人群包</el-button> -->
          <el-button size="small" @click="resetForm()">上一步</el-button>
          <el-button size="small" @click="handle_reset" v-if="campaign_update_type == 'create'">重置</el-button>
          <el-button size="small" type="primary" @click="submitForm()">下一步</el-button>
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
  import GroupCreate from './group-create'
  import GroupList from './group-list'

  export default {
    name: 'CampaignStep3',
    created () {
      this.update_step_index(2);
    },
    data() {
      return {
        active_tab: 'list'
      }
    },
    computed : {
      ...mapState('ad', [
        'ader_id'
      ]),
      ...mapState('ad/campaign',[
        'campaign_update_type',
        'group_id',
        'group_name',
        'is_save_group',
        'group_type',
        'group_validaty',
        'group_info',
        'group_keys',
        'group_cookie',
        'group_device',
      ])
    },
    methods: {
      ...mapActions('ad/campaign', [
        'update_step_index',
        'padding_group',
        'create_group',
        'update_group_id',
        'create_campaign_step3',
      ]),
      handle_reset(){
        this.active_tab == 'list'
        this.update_group_id('')
      },
      valid () {
        var _this = this;
        return new Promise( (resolve, reject) => {
          if( _this.active_tab == 'list' ) {
            resolve();
          }
          else if( _this.active_tab == 'create' ) {
            if( !_this.group_name ) {
              reject( new Error('请输入人群包名称'));
            }
            else if( _this.group_type == '1' && !_this.group_keys.length) {
              reject( new Error('请选择完善人群属性定向信息'));
            }
            else if( _this.group_type == '2' && (!_this.group_cookie || !_this.group_device )) {
              reject( new Error('请选择完善人群ID定向信息'));
            }
            else {
              _this.create_group()
                .then( () => {
                  resolve();
                })
                .catch( err => {
                  reject( err)
                })
            }
          }
          else {
            resolve();
          }
        })
      },
      submitForm() {
        this.valid()
          .then( () => {
            this.create_campaign_step3()
              .then( () => {
                this.$router.push('step4');
              })
              .catch( err => {
                this.$message.error(err.message);
              })
          })
          .catch( err => {
            this.$message.error(err.message)
          })
      },
      resetForm() {
        this.$router.push('step2');
      },

      gotoStep(step){
        this.valid()
        .then( () => {
          this.create_campaign_step3()
            .then( () => {
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
            })
            .catch( err => {
              this.$message.error(err.message);
            })
        })
        .catch( err => {
          this.$message.error(err.message)
        })
      },
    },
    
    components: {
      SidebarTree,
      ActivityNav,
      CampaignSteps,
      GroupCreate,
      GroupList
    }
  }
</script>
