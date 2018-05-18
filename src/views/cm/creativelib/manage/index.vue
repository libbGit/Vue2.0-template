<template>
  <div class="hy-card">
    <!-- 导航栏 -->
    <div class="clearfix nav-wrap">
        <creative-nav />
    </div>


      <div  class="hy-card__header clearfix">
        <div >

          <el-button size="mini"  @click='newCreative' type="primary">新建创意</el-button>
          <div class="pull-right" :inline="true">
            <el-date-picker
              size="mini"
              v-model="dataDuration"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2">
            </el-date-picker>

            <el-input style='width:193px;'
              placeholder="请输入创意名称"
              size="mini"
              @keyup.enter.native='onSearch'
              v-model="searchVal">
              <el-button slot="append" icon="el-icon-search" @click='onSearch' ></el-button>
            </el-input>
          </div>
        </div>

      </div>
      <div class="hy-card__content" v-loading="isLoading">
        <div style=' padding: 10px 20px'>
          <div class="filter">
            <div class="label">品牌:</div>
            <el-select v-model="brand"  size="mini">
              <el-option
                key=""
                label="全部品牌"
                value="">
              </el-option>
              <el-option
                v-for="item in brand_forms"
                :key="item.brand_id"
                :label="item.brand"
                :value="item.brand_id">
              </el-option>
            </el-select>
          </div>
          <div class="filter">
            <div class="label">产品线:</div>
            <el-select v-model="productLine" size="mini">
              <el-option
                key=""
                label="全部产品线"
                value="">
              </el-option>
              <el-option
                v-for="item in productListEx"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="filter">
            <div class="label">项目:</div>
            <el-select v-model="project" size="mini">
              <el-option
                key=""
                label="全部项目"
                value="">
              </el-option>
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="filter">
            <div class="label">活动:</div>
            <el-select v-model="activity" size="mini">
              <el-option
                key=""
                label="全部活动"
                value="">
              </el-option>
              <el-option
                v-for="item in activityList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="filter">
            <div class="label">状态:</div>
            <el-select v-model="placefile" size="mini" >
              <el-option
                v-for="item in placefileOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="filter">
            <div class="label">媒体:</div>
            <el-select v-model="media"  size="mini">
              <el-option
                key=""
                label="全部媒体"
                value="">
              </el-option>
              <el-option
                v-for="item in mediaList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="filter">
            <div class="label">点位:</div>
            <el-select v-model="point" size="mini">
              <el-option
                key=""
                label="全部点位"
                value="">
              </el-option>
              <el-option
                v-for="item in pointList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="pull-right" :inline="true">
          <div style="display: inline-block; margin-left: 10px;">
            <div class="label">尺寸:</div>
            <el-input style='width:70px;'
              placeholder="宽度"
              size="mini"
              v-model="width">
            </el-input>
            <span class="text">X</span>
            <el-input style='width:70px;'
              placeholder="高度"
              size="mini"
              v-model="height">

            </el-input>
            <el-button size="mini" icon="el-icon-search" type="info" @click='onSearch' plain ></el-button>
          </div>
          </div>

        </div>
      <creative-table
        :data='creativeData'
        :placefile='placefile'
        @refresh-list='getCreativeList'
        @setSelection='setSelection'></creative-table>
      <!-- 分页 start -->
      <div class="pagination-wrap clearfix" >
        <el-pagination class="pull-right"
          layout="total, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handle_page_change"
          >
        </el-pagination>
      </div>
      <!-- 分页 end -->
    </div>

  </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import CreativeNav from "@/views/cm/public/creative-nav";
import DaterangePicker from "@/views/public/daterange-picker";
import moment from "moment";
import CreativeTable from "./table";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";

export default {
  name: "CreativelibManage",
  components: {
    CreativeNav,
    DaterangePicker,
    CreativeTable
  },
  data() {
    return {
      width:'',
      height:'',
      selection:[],
      creativeData:[],
      currentPage: 1, //当前页
      total:0,
      pageSize: 10, //每页的数据条数
      isLoading:false,
      brand:'',
      productLine:'',
      media:'',
      point:'',
      activity:'',
      activityList:[],
      activityCache:{},//活动缓存
      project:'',
      projectList:[],
      projectsCache:{},//项目缓存
      searchVal:'',
      pickerOptions2: {
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, start]);
            }
          },
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date()- 3600 * 1000 * 24 * 1;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date()- 3600 * 1000 * 24 * 1;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }

        ]
      },
      dataDuration: [moment().subtract(6, 'd').format('YYYY-MM-DD'),moment().format("YYYY-MM-DD")], //操作后变成数组
      operation:"",
      placefile:'1',
      placefileOption:[{
          value: '0',
          label: '全部'
        },{
          value: '1',
          label: '未归档'
        },{
          value: '2',
          label: '已归档'
        }],
    };
  },
  watch: {
    //根据品牌id可以获取对应的产品线列表和项目列表
    brand:function(nVal,oVal){
      this.productLine = '';
      this.project = '';
      this.updateProject(nVal);
      this.getCreativeList();
    },
    // 根据项目id可以获取对应的活动列表
    project(nVal,oVal){
      this.activity = '';
      this.updateActivity(nVal);
      this.getCreativeList();
    },
    creativeData:{
      handler:function(val){
        // this.total = val.length;
      },
      deep: true
    },
    productLine(nVal,oVal){//console.log('productLine:',nVal)
      this.project = '';
      this.updateProject2(this.brand,nVal);
      this.getCreativeList();
    },
    // 根据媒体id可以获取对应的点位列表和尺寸列表
    media(){
      this.point = '';
      this.getCreativeList();
    },
    point(){
      this.getCreativeList();
    },
    activity(){
      this.getCreativeList();
    },
    placefile(){
      this.getCreativeList();
    },
    // size(){
    //   this.getCreativeList();
    // },
    dataDuration(n, o) {
      this.getCreativeList();
    }
  },
  computed: {
    ...mapState("ad", ["ader_id","ader_name"]),
    ...mapState("cm", ["mediaList"]),
    ...mapState("advertiser", ["brand_forms"]),
    size(){
      if (!isNaN(this.width)&&!isNaN(this.height)&&this.width!=''&&this.height!='') {
        return this.width+'x'+this.height
      }else{
        return '';
      }
    },
    productListEx () {
      var result = [];
      if( this.brand ){
        this.productLine = '';
        var brand = this.brand_forms.filter( item => {
          return item.brand_id == this.brand
        });

        if( brand && brand.length > 0) {
          result = brand[0].products;
        }
      }
      return result;
    },
    pointList(){
      var result = [];
      if( this.media ){
        this.point = '';
        var point = this.mediaList.filter( item => {
          return item.id == this.media
        });

        if( point && point.length > 0) {
          result = point[0].pos;
        }
      }
      return result;
    }
  },

  methods: {
    ...mapActions("advertiser", ["fetch_brand_form"]),
    ...mapActions("cm", ["fetch_getProjects","fetch_activities","fetch_media"]),
    /**
     * [hasStatus description]
     * @param  {[type]}  type [说明：1开启(正常)  2中止  3暂停]
     * @return {Boolean}      [description]
     */
    hasStatus(type) {
      let arr = this.getSelectionStatus(); //数字中是number不是string
      return arr.indexOf(type - 0) != -1;
    },
    /**
     * 获取勾选后项目的操作状态
     * [getSelectionStatus description]
     * @return {[type]} [1,2,3] 说明：1开启  2中止  3暂停
     */
    getSelectionStatus() {
      var status = [];
      for (let i of this.selection) {
        status.push(i.status - 0);
      }
      return _.uniq(status);
    },
    // 处理分页操作 点击操作回调
    handle_page_change(currentPage) {
      this.currentPage = currentPage;
      this.getCreativeList();
    },
    setSelection(val){
      this.selection = val;
    },
    updateProject(brand_id){//debugger
      if (this.projectsCache[brand_id]) {//console.log('if')
        this.projectList = this.projectsCache[brand_id];
      }else{
        this.fetch_getProjects({brand_id}).then(data=>{
          this.projectsCache[brand_id] = data;
          this.projectList = data;
        });
      }
    },
    updateProject2(brand_id,product_line){
      if (this.projectsCache[brand_id+''+product_line]) {
        this.projectList = this.projectsCache[brand_id+''+product_line];
      }else{
        let obj = { brand_id,product_line};
        this.fetch_getProjects(obj).then(data=>{
          this.projectsCache[brand_id+''+product_line] = data;
          this.projectList = data;
        });
      }
    },
    updateActivity(project_id){
      if (this.activityCache[project_id]) {
        this.activityList = this.activityCache[project_id];
      }else{
        this.fetch_activities({project_id}).then(data=>{
          this.activityCache[project_id] = data;
          this.activityList = data;
        });
      }
    },
    newCreative(){
      this.$router.push({path:"/cm/creativelib/create"})
    },
    getCreativeList(){
      let start = moment(this.dataDuration[0]).format("YYYY-MM-DD");
      let end = moment(this.dataDuration[1]).format("YYYY-MM-DD");
      let data = {
        advertiser_id:this.ader_id?this.ader_id-0:'',
        product_line_id:this.productLine?this.productLine-0:'',
        project_id:this.project?this.project-0:'',
        brand_id:this.brand?this.brand-0:'',
        media_id:this.media?this.media-0:'',
        pos_id:this.point?this.point-0:'',
        activity_id:this.activity?this.activity-0:'',
        status:this.placefile?this.placefile-0:'',
        start:start,
        end:end,
        size:this.size,
        page: this.currentPage,
        limit: this.pageSize,
        keywords:this.searchVal
      };
      this.isLoading = true;
      fetch.post("/creative/list",data)
        .then(res => {
          this.isLoading = false;
          if (res.ret == 0&&Array.isArray(res.data)) {//debugger
            this.creativeData = res.data;
            this.total = res.total?(res.total - 0):0;
          } else {
            this.creativeData = [];
            console.error(res.msg||'创意列表 返回值为空');
          }
        })
        .catch(err => {
          this.isLoading = false;
          console.error(err||'创意列表 err');
        });
    },
    onSearch(){
      this.getCreativeList();
    },


    onSelectionChange(){},


  },
  created() {
    this.fetch_brand_form(this.ader_id);
    this.fetch_media(this.ader_id);
    this.getCreativeList();
  },

};
</script>
<style scoped>
  .el-select {
    display: inline-block;
    position: relative;
    width: 110px;
  }
  .filter{
    display: inline-block;
  }
  .filter + .filter{
    margin-left: 10px;
  }
  .label{
    color: #999;font-size: 12px;
    display: inline-block;
  }
span.text{
  font-size: 12px;
}
</style>
