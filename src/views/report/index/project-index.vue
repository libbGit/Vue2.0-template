<template>
  <div class="report-content">
    <div class="hy-card">
      <div class="clearfix nav-wrap">
        <el-menu size="mini" class="sub-menu-nav pull-left" mode="horizontal" :default-active="$route.path" :router="true">
          <!-- <el-menu-item index="/ad/report/advertiser">
            广告主报告
          </el-menu-item> -->
          <el-menu-item index="/ad/report/brand">
            品牌报告
          </el-menu-item>
          <el-menu-item index="/ad/report/productline">
            产品线报告
          </el-menu-item>
          <el-menu-item index="/ad/report/project">
            项目报告
          </el-menu-item>
          <el-menu-item index="/ad/report/activity">
            活动报告
          </el-menu-item>
          <el-menu-item index="/ad/report/campaign">
            推广计划报告
          </el-menu-item>
          <el-menu-item index="/ad/report/custom">
            定制报告
          </el-menu-item>
        </el-menu>
        <div class="pull-right">
            <el-popover ref="setting" 
              v-model="isSettingShow" 
              placement="bottom-end" 
              title="自定义模块"
              width="200" 
              trigger="click" 
              @show="getsettings"
              transition="el-zoom-in-top">
              <div>
                <transition-group 
                  mode="out-in"
                  move-class="sort-item"
                  tag="div">
                  <div v-for="item in settings" :key="item.id" class="setting-item">
                    <el-checkbox v-model="item.checked" ></el-checkbox>
                    <label style="font-size: 12px;">{{item.name}}</label>
                    <div class="up-and-down">
                      <span class="up" @click="toUp(item)">
                        <i class="el-icon-sort-up"></i>
                      </span>
                      <span class="down" @click="toDown(item)">
                        <i class="el-icon-sort-down"></i>
                      </span>
                    </div>
                  </div>
                </transition-group>

                <div style="float:right;margin-top: 10px;">
                  <el-button type="primary" size="mini" @click="save">保存</el-button>
                  <el-button size="mini" @click="cancel">取消</el-button>
                </div>
              </div>
            </el-popover>
          <el-button v-popover:setting icon="el-icon-setting" size="mini" v-show="settingDisplay()"></el-button>
        </div>
      </div>

      <div class="hy-card hy-card-report">
        <keep-alive>
          <router-view :advertiserId="selectedId"/>
        </keep-alive>
      </div>
    </div>

  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import _ from "lodash";

export default {
  name: "Report-manage",
  data() {
    return {
      isSettingShow: false,
      settings: []
    };
  },

  computed: {
    ...mapState({
      settingState: state => state.report.settings, //每次获取settings都会执行此箭头函数
      advertiserId: state => state.report.advertiserId //获取项目中选择的广告主id
    }),
    selectedId(){
      return this.advertiserId;
    }
  },
  methods: {
    ...mapMutations("report", [
      "ADD_ADVERTOSER_SETTING",
      "ADD_BRAND_SETTING",
      "ADD_PRODUCTLINE_SETTING",
      "ADD_PROJECT_SETTING",
      "ADD_ACTIVITY_SETTING",
      "ADD_CAMPAIGN_SETTING"
    ]),

    settingDisplay(){
      if(this.$route.path.indexOf('custom')>-1){
        return false;
      }else{
        return true;
      }
    },

    save() {
      this.isSettingShow = false;

      let route = this.$route.path.substring(
        this.$route.path.lastIndexOf("/") + 1
      );
      switch (route) {
        case "advertiser":
          this.ADD_ADVERTOSER_SETTING(this.settings);
          break;
        case "brand":
          this.ADD_BRAND_SETTING(this.settings);
          break;
        case "productline":
          this.ADD_PRODUCTLINE_SETTING(this.settings);
          break;
        case "project":
          this.ADD_PROJECT_SETTING(this.settings);
          break;
        case "activity":
          this.ADD_ACTIVITY_SETTING(this.settings);
          break;
        case "campaign":
          this.ADD_CAMPAIGN_SETTING(this.settings);
          break;
      }
    },

    cancel() {
      this.isSettingShow = false;
    },

    /**
     * 从state获取最新数据
     */
    getsettings() {
      let route = this.$route.path.substring(
        this.$route.path.lastIndexOf("/") + 1
      );
      switch (route) {
        case "advertiser":
          this.settings = _.cloneDeep(this.settingState.advertiser);
          break;
        case "brand":
          this.settings = _.cloneDeep(this.settingState.brand);
          break;
        case "productline":
          this.settings = _.cloneDeep(this.settingState.productline);
          break;
        case "project":
          this.settings = _.cloneDeep(this.settingState.project);
          break;
        case "activity":
          this.settings = _.cloneDeep(this.settingState.activity);
          break;
        case "campaign":
          this.settings = _.cloneDeep(this.settingState.campaign);
          break;
      }
    },

    //向上移动一个位置
    toUp(item) {
      let index = this.settings.indexOf(item);
      if (index != 0) {
        //第一个不允许上移
        let prevItem = this.settings[index - 1];
        this.settings.splice(index - 1, 2, item, prevItem); //交换数组项，用于在settings中的显示顺序
      }
    },

    //向下移动一个位置
    toDown(item) {
      let index = this.settings.indexOf(item);
      if (index != this.settings.length - 1) {
        //最后一个不允许下移
        let nextItem = this.settings[index + 1];
        this.settings.splice(index, 2, nextItem, item);
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if(to.name=="CustomReport"){
      next();
    }else{
      //设置state id
      next();
    }
    
    
  },
  beforeRouteLeave: (to, from, next) => {
    if(from.name=="CustomReport"){
      next();
    }else{
      //清空state id
      next();
    }
    next();
  },
  components: {
    // ReportList
  }
};
</script>
<style scoped>
.report-content{
  min-height:86vh;
}

.setting-option .el-form-item{
  margin-bottom: 0;
}

.hy-card-report {
  margin-top:0;
  overflow-x:hidden;
}

.el-popover{
  padding-left:0;
  padding-right:0;
}

.setting-item{
  line-height: 2;
}

.setting-item .el-checkbox{
  margin-right:10px
}

.setting-item .up-and-down{
  display:inline-block;
  float: right;
  margin-right: 20px;
}

.setting-item .up-and-down .el-icon-sort-up,
.setting-item .up-and-down .el-icon-sort-down{
  font-size: 16px;
  font-weight: bold;
}

.setting-item .up-and-down .up{
  margin-right: 10px;
}

.setting-item .up-and-down .up,
.setting-item .up-and-down .down{
  cursor:pointer;
}

.sort-item{
  transition: all .5s;
}


</style>

