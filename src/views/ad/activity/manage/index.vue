<template>
  <!-- <div class="m__wraper">
    <div class="m__sidebar">
        <sidebar-tree />
    </div> -->

    <div class="m__content">
      <!-- 计划预警  -->
      <alert-list
        url='/activity/warn'
        :param='alertParam'
        @onView='viewWarn' 
      />
      <!-- 导航栏 -->
      <div class="clearfix nav-wrap">
        <div class="pull-left">
          <project-nav />
        </div>
        <div class="pull-right">
          <!-- <daterange-picker size="mini" :value="date_range"/> -->
          <el-date-picker
            size="mini"
            v-model="dataDuration"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2" @change="handle_date_change">
          </el-date-picker>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-wrap">

        <!-- <el-alert
          style="margin-top:10px;"
          title="预警消息"
          type="warning"
          show-icon>
          <a href="#" class="el-alert__description" style="padding-left: 10px;">三个活动终止</a>
        </el-alert>
        <test-chart style="margin-top:10px;" />
         -->


        <!-- 数据显示 -->
        <activity-chart  style="margin-top:10px;"
          v-if="chart_data"
          :data="chart_data"
        />
        <div class="hy-card" >
          <!-- head start-->
          <div class="hy-card__header clearfix">

            <div class="pull-left">
              <el-button type="primary" size="mini" @click='createProject' v-if='enableOpera' icon="el-icon-plus">新建活动</el-button>
              <el-dropdown @command='handleOperationChange' @visible-change='handleVisibleChange'>
                <el-button type="primary" size="mini" plain icon="el-icon-menu">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="pause"
                    label="暂停"
                    :disabled='isDispausable'>暂停
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="open"
                    label="暂停"
                    :disabled='isDisopenable'>开启
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="stop"
                    label="暂停"
                    :disabled='isDisstopable'>中止
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="push"
                    label="推送"
                    :disabled='isDispushable'>推送pbs
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <!--<el-select v-model="operation" placeholder="操作"-->
                         <!--@change='handleOperationChange' @visible-change='handleVisibleChange' size="mini">-->
                  <!--<el-option-->
                    <!--key="pause"-->
                    <!--label="暂停"-->
                    <!--:disabled='isDispausable'-->
                    <!--value="pause">-->
                  <!--</el-option>-->
                  <!--<el-option-->
                    <!--key="open"-->
                    <!--label="开启"-->
                    <!--:disabled="isDisopenable"-->
                    <!--value="open">-->
                  <!--</el-option>-->
                  <!--<el-option-->
                    <!--key="stop"-->
                    <!--label="中止"-->
                    <!--:disabled="isDisstopable"-->
                    <!--value="stop">-->
                  <!--</el-option>-->
              <!--</el-select>-->
            </div>

            <div class="pull-right">
              <el-input style="width: 250px;"
                 placeholder="请输入活动名称"
                 size="mini"
                 @keyup.enter.native='handleSearch'
                 v-model="searchVal">
                 <el-button slot="append" icon="el-icon-search" @click='handleSearch'></el-button>
               </el-input>
              <checkbox-dropdown
                placement="bottom"
                name="自定义列"
                :items="extral_column"
                v-model="check_columns" />
            </div>

          </div>
          <!-- head start-->

          <!-- table start-->
          <div class="hy-card__content" v-loading="isLoading">
            <el-table size="mini"
              :data="listData"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange" @row-click="nodeThandel">

                <el-table-column
                  type="selection"
                  :selectable='onSelectable'
                  width="40">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('project_id') > -1"
                  prop="project_id"
                  width="60"
                  label="活动ID">
                </el-table-column>

                <el-table-column
                  prop="status"
                  label="操作状态"
                  align='center'
                  width="100">
                  <template slot-scope="scope">
                      <el-tag :type="formatOperationStatus(scope.row['status']).type" v-if="scope.row.status!='--'">
                      {{formatOperationStatus(scope.row['status']).text}}
                      </el-tag>
                      <span v-else>{{scope.row.status}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="run_status"
                  label="投放状态"
                  align='center'
                  width="100">
                  <template slot-scope="scope">
                    <el-tag :type="formatadvertiserStatus(scope.row['run_status']).type" v-if="scope.row.run_status!='--'">
                      {{formatadvertiserStatus(scope.row['run_status']).text}}
                    </el-tag>
                    <span v-else>{{scope.row.run_status}}</span>
                  </template>
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('brand_name') > -1"
                  prop="brand_name"
                  label="品牌"
                  width="100">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('product_name') > -1"
                  prop="product_name"
                  label="产品线"
                  width="100">
                </el-table-column>

                <el-table-column
                  prop="name"
                  label="活动名称"
                  width="150">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="Urlhandel(scope.row)" :title="scope.row['name']">
                      {{scope.row['name']}}
                    </el-button>
                    <el-button v-if="is_editable(scope.row)"
                     type="text"
                     size="mini"
                     icon="el-icon-edit"
                     title="编辑"
                     @click="edit(scope.row)">

                    </el-button>
                  </template>
                </el-table-column>

               <el-table-column v-if="check_columns.indexOf('time') > -1"
                  prop="start_time"
                  width="80"
                  label="开始时间">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('time') > -1"
                  prop="end_time"
                  width="80"
                  label="结束时间">
                </el-table-column>

                <el-table-column
                  prop="budget"
                  label="预算"
                  align="right"
                  width="120">
                  <template slot-scope="scope">
                    ¥{{$formatPrice($toDecimal2(scope.row['budget']))}}
                  </template>
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('budget_progress') > -1"
                  prop="budget_progress"
                  label="预算进度"
                  width="100">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.budget_progress" v-if="scope.row.budget_progress!='--'">
                    </el-progress>
                    <span v-else>{{scope.row.budget_progress}}</span>
                  </template>
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cost_progress') > -1"
                  prop="cost_progress"
                  label="消费进度"
                  width="240">
                  <template slot-scope="scope">
                    <template v-if="scope.row.cost_progress!='--'">
                      <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.cost_progress"  style="margin-right: 20px;">
                      </el-progress>
                      <el-tooltip effect="dark" content="消费与预算统计图" placement="right">
                        <i class="el-icon-view icon-detail" @click="openChartDialog(scope.row)"></i>
                      </el-tooltip>
                    </template>
                    <span v-else>{{scope.row.cost_progress}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="time_progress"
                  label="投放进度"
                  width="220">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.time_progress" v-if="scope.row.time_progress!='--'">
                    </el-progress>
                    <span v-else>{{scope.row.time_progress}}</span>
                  </template>
                </el-table-column>



                <!-- <el-table-column
                  prop="kpi"
                  width="120"
                  align="center"
                  label="KPI">
                </el-table-column> -->

                <el-table-column
                  prop="cost"
                  width="120"
                  align="right"
                  label="已消耗">
                </el-table-column>

                <el-table-column
                  prop="pv"
                  width="80"
                  align="right"
                  label="展现数">
                </el-table-column>

                <el-table-column
                  prop="click"
                  align="right"
                  label="点击数">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('ctr') > -1"
                  prop="ctr"
                  width="80"
                                 align="right"
                  label="CTR">
                  <template slot-scope="scope">
                    {{scope.row.ctr}}%
                  </template>
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cpc') > -1"
                  prop="cpc"
                  width="80"
                                 align="right"
                  label="CPC">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cpm') > -1"
                  prop="cpm"
                  width="80" align="right"
                  label="CPM">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('leads') > -1"
                  prop="leads"
                  width="80" align="right"
                  label="Leads">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cpl') > -1"
                  prop="cpl"
                  width="80" align="right"
                  label="CPL">
                </el-table-column>
                <el-table-column v-if="check_columns.indexOf('cr') > -1"
                  prop="cr"
                                 align="right"
                  width="80"
                  label="CR">
                  <template slot-scope="scope">
                    {{scope.row.cr}}%
                  </template>
                </el-table-column>
            </el-table>
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
          </div>
          <!-- table end-->
        </div>
              <!-- 进度图表 start -->
        <el-dialog :visible.sync="dialogChart" :lock-scroll="false" title="消费与预算统计图">
          <dialog-chart :data="chart_data_x"/>
        </el-dialog>
        <!-- 进度图表 end -->
        <!-- 中止提示框 start-->
        <el-dialog width="50%" :title='dialogTitle' :visible.sync="outerVisible">
           <span>{{ campaignsName}}</span>
           <el-dialog width="30%" :title="'确定将此项目 '+checkProjectName+' 中止吗？'" :visible.sync="innerVisible" append-to-body>
             <span style="color: red;">如中止将会把此活动下全部计划中止</span>
             <div slot="footer" class="dialog-footer" >
               <el-button @click="innerCancel" size="mini">取 消</el-button>
               <el-button type="primary" @click="innerOk"  size="mini">确认</el-button>
             </div>
           </el-dialog>
           <div slot="footer" class="dialog-footer">
             <p class='dialog-text'>如中止将会把活动下全部计划中止，确定要进行此操作吗？
             </p>
             <div>
               <el-button @click="outterCancel"  size="mini">取 消</el-button>
               <el-button type="primary" @click="outterOk"  size="mini">确认</el-button>
             </div>
           </div>
         </el-dialog>
        <!-- 中止提示框 end-->

      </div>
    </div>

  <!-- </div> -->
</template>
<script>
import math from "mathjs";
import DaterangePicker from "@/views/public/daterange-picker";
import SidebarTree from "@/views/ad/public/sidebar-tree";
import dialogChart from '@/views/advertiser/index/ader-data/dialog_chart'
import ProjectNav from "@/views/ad/public/project-nav";
import activityChart from "@/views/ad/activity/manage/chart";
import _ from "lodash";
import axios from "axios";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
import CheckboxDropdown from "@/views/public/checkbox-dropdown";
import AlertList from '@/views/public/alert-list'
const openOperate = 1; //开启(正常)
const stopOperate = 2; //中止
const pauseOperate = 3; //暂停
const pushOperate = 4; //已推送
math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});
export default {
  name: "activity-manage",
  data() {
    return {
      enableOpera:true,
      campaignsName:'',
      chart_data: null,
      chart_data_x:null,
      isCreateProject: false,
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
      dataDuration: [moment().subtract(7, 'd').format('YYYY-MM-DD'),moment().subtract(1, 'd').format("YYYY-MM-DD")], //操作后变成数组
      searchVal: "",
      operation: "",

      listData: [],
      selection: [],

      outerVisible: false,
      innerVisible: false,
      d_project_id: "",
      d_project_name: "",

      check_columns: [],
      extral_column: [
        {
          label: "活动ID",
          prop: "project_id"
        },
        {
          label: "品牌",
          prop: "brand_name"
        },
        {
          label: "产品线",
          prop: "product_name"
        },
        {
          label: "活动周期",
          prop: "time"
        },
        {
          label: "预算进度",
          prop: "budget_progress"
        },
        {
          label: "消费进度",
          prop: "cost_progress"
        },
        {
          label: "CTR",
          prop: "ctr"
        },
        {
          label: "CPC",
          prop: "cpc"
        },
        {
          label: "CPM",
          prop: "cpm"
        },
        {
          label: "Leads",
          prop: "leads"
        },
        {
          label: "CPL",
          prop: "cpl"
        },{
          label: "CR",
          prop: "cr"
        }
      ],

      dialogChart: false,
      isLoading: false,
      currentPage: 1, //当前页
      pageSize: 10, //每页的数据条数
      start_time: moment().format("YYYY-MM"),
      end_time: moment().format("YYYY-MM"),
      total: 0 //页面总数
    };
  },
  watch: {
    dataDuration(n, o) {
      this.handleSearch();
    },
    project_id: function(n,o) {
      this.init();
    }
  },
  computed: {
    ...mapState("ad", ["projects", "ader_id", "project_id",'project_opera_status']),
    alertParam(){
      return {
        project_id:this.project_id
      }
    },
    checkProjectName() {
      if (this.selection.length == 1) {
        let name = this.selection[0]["name"];
        return name;
      }
    },
    dialogTitle() {
      let str = "活动包含计划：";
      if (this.campaignsName == "") {
        str = "活动下没有计划";
      }
      return this.checkProjectName + str;
    },
    // 是否禁用中止
    isDisstopable() {
      if (this.selection.length==0) {
        return true;
      }
      if (this.hasSummaryCheckBox()) {
        return true;
      }
      let result = false;
      if (this.selection.length > 1) {
        result = true;
      } else {
        //无法中止已中止的项目
        result = this.hasItmeByStatus(stopOperate);
      }
      return result;
    },
    // 是否禁用暂停
    isDispausable() {
      if (this.selection.length==0) {
        return true;
      }
      if (this.hasSummaryCheckBox()) {
        return true;
      }
      let result =
        this.hasItmeByStatus(stopOperate) || this.hasItmeByStatus(pauseOperate);
      return result;
    },
    // 是否禁用开启
    isDisopenable() {
      if (this.selection.length==0) {
        return true;
      }
      if (this.hasSummaryCheckBox()) {
        return true;
      }
      let result =
        this.hasItmeByStatus(openOperate) || this.hasItmeByStatus(stopOperate);
      return result;
    },
    isDispushable(){
      if (this.selection.length==0) {
        return true;
      }
      // if (this.hasSummaryCheckBox()) {
      //   return true;
      // }
      // let result =
      //   this.hasItmeByStatus(pushOperate) //选择的条目状态不包含 已推送
      // return result;
      return false;

    }
  },
  // activated(){debugger},
  created() {
    this.init();
  },
  methods: {
    ...mapActions("advertiser", ["fetch_brand_form"]),
    ...mapActions("ad", [
      "update_brand_name",
      "update_product_name",
      "update_activity_id",
      "update_activity_name",
      "fetch_getStatus"
    ]),
    viewWarn(obj){
      this.searchVal = obj.name;
      this.fetch_activity_data();
    },
    onSelectable(row, index){
      return row.status!='--';
    },
    init(){
      this.fetch_activity_data();
      this.fetch_activity_chart();
      this.fetch_getStatus({id:this.project_id,type:'project'}).then(data=>{
        this.enableOpera = data.status!=2;
      });
    },
    handle_date_change() {
      this.fetch_activity_chart();
    },
    fetch_activity_chart() {
      return new Promise((resolve, reject) => {
        let start = moment(this.dataDuration[0]).format("YYYY-MM-DD");
        let end = moment(this.dataDuration[1]).format("YYYY-MM-DD");
        return fetch
          .post("/activity/chart", {
            //activity_id: this.activity_id,
            project_id: this.project_id,
            start: start,
            end: end
          })
          .then(res => {
            if (res.ret == 0) {
              // console.log('res.data',res.data)
              this.chart_data = res.data;
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    nodeThandel(row) {
      //console.log(row);
      return new Promise((resolve, reject) => {
        let start = moment(this.dataDuration[0]).format("YYYY-MM-DD");
        let end = moment(this.dataDuration[1]).format("YYYY-MM-DD");
        return fetch
          .post("/activity/chart", {
            //activity_id: this.activity_id,
            project_id: this.project_id,
            activity_id:row.project_id,
            start: start,
            end: end
          })
          .then(res => {
            if (res.ret == 0) {
              this.chart_data = res.data;
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    Urlhandel(row) {
      //console.log(row);
      if (row.project_id=='--') {return}
      this.update_activity_id(row.project_id);
      this.update_activity_name(row.name);
      this.$router.push({
        path: "/ad/campaign/manage"
      });
      event.stopPropagation();
    },

    createProject() {
      if (this.isCreateProject) {
        return;
      }
      this.isCreateProject = true;
      this.fetch_project_info().then(res=>{
        this.fetch_brand_form(this.ader_id)
          .then(data => {
            //debugger
            this.isCreateProject = false;
            if (data.length) {
              this.$router.push({ path: "/ad/activity/create" });
            } else {
              this.$alert(" 您还未创建品牌，无法新建项目，请先创建品牌！", "提示", {
                confirmButtonText: "确定"
              });
            }
          })
          .catch(err => {
            this.isCreateProject = false;
            console.log(new Error(err));
          });
      });
    },
    fetch_project_info() {
      this.isCreateProject = true;
      return new Promise((resolve, reject) => {
        fetch
          .post("/query", { project_id: this.project_id })
          .then(res => {
            if (res.ret == 0&&res.data) {
              let project_etime = moment(res.data.end_time);
              let restBudget = res.data.budget;
              if (restBudget==0) {
                this.$message.error('项目已无预算，无法创建活动，请先调整项目预算!');
              }else if(!moment(moment()-24 * 60 * 60 * 1000).isBefore(project_etime)){
                this.$message.error('项目已结束，无法创建活动，请先调整项目周期！');
              }
              if (restBudget==0||moment(moment()-24 * 60 * 60 * 1000).isAfter(project_etime)) {
                this.isCreateProject = false;
                reject();
              }else{
                this.isCreateProject = false;
                resolve();
              }

            } else {//debugger
              this.isCreateProject = false;
              this.$message.error('获取项目信息失败');
              reject(res.ret || "获取项目信息失败");
            }
          })
          .catch(err => {
            this.isCreateProject = false;
            this.$message.error('获取项目信息失败');
            reject(err);
          });
      });

    },
    innerCancel() {
      this.innerVisible = false;
    },
    innerOk() {
      this.stopOperateFn();
      this.innerVisible = false;
      this.outerVisible = false;
    },
    outterOk() {
      this.innerVisible = true;
    },
    outterCancel() {
      this.outerVisible = false;
    },
    //投放状态 1未投放 2投放中 3已完成
    formatadvertiserStatus(status) {
      var status = status - 0;
      var result = {};
      switch (status) {
        case 2:
          result = {
            type: "success",
            text: "投放中"
          };
          break;
        case 1:
          result = {
            type: "warning",
            text: "未投放"
          };
          break;
        case 3:
          result = {
            type: "",
            text: "已完成"
          };
          break;

          //需要增加吗？
        default:
      }
      return result;
    },
    //操作状态 1开启(正常)  2中止  3暂停  4 已推送
    formatOperationStatus(status) {
      var status = status - 0;
      var result = {};
      switch (status) {
        case openOperate:
          result = {
            type: "success",
            text: "正常"
          };
          break;
        case stopOperate:
          result = {
            type: "danger",
            text: "已中止"
          };
          break;
        case pauseOperate:
          result = {
            type: "warning",
            text: "已暂停"
          };
          break;
        case pushOperate:
          result = {
            type: "warning",
            text: "已推送"
          };
          break;
        default:
      }
      return result;
    },
    hasSummaryCheckBox() {
      let arr = this.getOperationStatus();
      for (let i of arr) {
        if (isNaN(i)) {
          return true;
        }
      }
      return false;
    },
    /**
       * [hasItmeByStatus description]
       * @param  {[type]}  type [说明：1开启(正常)  2中止  3暂停 4已推送]
       * @return {Boolean}      [description]
       */
    hasItmeByStatus(type) {
      let arr = this.getOperationStatus(); //数字中是number不是string
      return arr.indexOf(type - 0) != -1;
    },
    /**
       * 获取勾选后项目的操作状态
       * [getOperationStatus description]
       * @return {[type]} [1,2,3,4] 说明：1开启  2中止  3暂停 4已推送
       */
    getOperationStatus() {
      var status = [];
      for (let i of this.selection) {
        status.push(i.status - 0);
      }
      return _.uniq(status);
    },
    //搜索
    handleSearch() {
      this.fetch_activity_data();
    },
    //下拉菜单隐藏显示的回调
    handleVisibleChange(visible) {
      var self = this;
      if (visible) {
        this.operation = "";
      }
    },
    // 处理分页操作 点击操作回调
    handle_page_change(currentPage) {
      this.currentPage = currentPage;
      this.fetch_activity_data();
    },
    // 处理日期筛选
    handleDateChange() {
      if (this.start_time > this.end_time) {
        this.$message({
          message: "开始月不能晚于结束月",
          type: "warning"
        });
      } else {
        //this.fetch_activity_chart();
        this.fetch_activity_data();
      }
    },
    // 处理选择多选框操作
    handleSelectionChange(val) {
      this.selection = val;
    },

    //下拉选择操作
    handleOperationChange(val) {
      switch (val) {
        case "edit":
          this.edit();
          break;
        case "stop":
          this.stop();
          break;
        case "pause":
          this.pause();
          break;
        case "open":
          this.open();
          break;
        case "push":
          this.push();
          break;
        default:
      }
    },
    // 是否可编辑
    is_editable( row ) {
      var flag = true;
      if( row.name == '总计') {
        return false;
      }
      // 操作状态为 中止或归档 则不可编辑
      if( row.status == '2') {
        flag = false;
      }
      return flag;
    },
    //编辑
    edit(row) {
      this.$router.push({
        path: "/ad/activity/edit/" + row.project_id
      });
    },
    //暂停
    pause() {
      if (this.selection.length == 0) {
        this.$alert("请选择需要暂停的活动", "提示", {
          type: "warning",
        });
      } else {
        let result = [];
        for (let i of this.selection) {
          result.push({ id: i.project_id, status: pauseOperate });
        }
        this.fetch_operat_project(result)
          .then(res => {
            this.$message({
              message: "活动暂停成功",
              type: "success"
            });
          })
          .catch(err => {
            this.$message.error("暂停活动失败，请稍后重试");
          });
      }
    },
    // 开启
    open() {
      if (this.selection.length == 0) {
        this.$alert("请选择需要开启的活动", "提示", {
          type: "warning",
        });
      } else {
        let result = [];
        for (let i of this.selection) {
          result.push({ id: i.project_id, status: openOperate });
        }
        this.fetch_operat_project(result)
          .then(res => {
            this.$message({
              message: "活动开启成功",
              type: "success"
            });
          })
          .catch(err => {
            this.$message.error("暂停开启失败，请稍后重试");
          });
      }
    },
    // 处理中止操作
    stop() {
      if (this.selection.length > 1) {
        this.$alert("一次只能中止一个活动", "提示", {
          type: "warning",
        });
      } else if (this.selection.length == 0) {
        this.$alert("请选择需要中止的活动", "提示", {
          type: "warning",
        });
      } else {
        var data = this.selection[0];
        if (data.status == stopOperate) {
          this.$alert("所选择的广告主已中止", "提示", {
            type: "warning",
          });
        } else {
          this.getCampaigns(data.project_id);

          return;
        }
      }
    },
    
    /**
      推送pbs
     */
    push() {
      if (this.selection.length == 0) {
        this.$alert("请选择需要推送的活动", "提示", {
          type: "warning",
        });
      } else {
        let result = [];  //值为 “1,2,3,5,65,89”
        for (let i of this.selection) {
          result.push(i.project_id);
        }

        this.fetch_push_project(result.join(","),result)
          .then(res => {
            this.$message({
              message: "推送pbs成功",
              type: "success"
            });
          },
          err=>{
            this.$message.error(err);
          })
          .catch(err => {
            this.$message.error("推送pbs失败，请稍后重试");
          });
      }
    },
    /*stopNOCampaign(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '活动下没有计划', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },*/
    getCampaigns(activityID){
      this.campaignsName = '';
      fetch
        .post("/query", { activity_id: activityID })
        .then(res => {
          if (res.ret == 0&&res.data) {

            let names = res.data.plan_name;
            this.campaignsName = names?names:'';
            this.outerVisible = true;
            /*if (names) {
              this.outerVisible = true;
            }else{
              this.stopNOCampaign();
            }*/

          } else {//debugger
            this.$message.error('获取活动信息失败');
            console.error('获取活动信息失败')
          }
        })
        .catch(err => {
          this.$message.error('获取活动信息失败');
          console.error(err||'获取活动信息失败')
        });
    },
    stopOperateFn() {
      let data = this.selection[0];
      this.fetch_operat_project([{ id: data.project_id, status: stopOperate }])
        .then(res => {
          this.$message({
            message: "活动中止启成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message.error("活动中止失败，请稍后重试");
        });
    },
    //to do
    formatFirstPageData(obj) {
      let summary = obj.count_nums[0];
      /*summary.ctr=='0.00'?summary.ctr='0':'';
      summary.cpc=='0.00'?summary.cpc='0':'';
      summary.cpm=='0.00'?summary.cpm='0':'';
      summary.cpl=='0.00'?summary.cpl='0':'';*/
      let tem = {
        
        name: "总计",
        budget: "0",
        
        brand_name: "--",
        product_name: "--",
        
        
        pv: "0",
        click: "0",
        ctr: "0",
        cpc: "0",
        cpm: "0",
        cost: "0",
        cpl:'0',
        cr:'0'
      };
      let tem2 = {
        project_id: "--",
        status: "--",
        run_status: "--",
        start_time: "--",
        end_time: "--",
        budget_progress: "--",
        cost_progress: "--",
        time_progress: "--",
      };
      obj.data.unshift(_.extend(tem, summary,tem2));
      this.listData = obj.data;
    },
    formatProgressAllData() {
      for (let i of this.listData) {
        this.formatProgressData(i);
      }
    },
    //将百分百数据格式化，因为服务端说他改不了，改不了就算了  我来改
    formatProgressData(obj) {
      let arr = ["budget_progress", "cost_progress", "time_progress"];
      for (let i of arr) {
        //debugger
        if (!isNaN(obj[i] - 0)) {
          obj[i] = math.eval(obj[i]+"*"+100)-0;
          obj[i] = obj[i] < 0 ? 0 : obj[i];
          obj[i] = obj[i] > 100 ? 100 : obj[i];
        } else {
          // debugger
        }
      }
    },
    formatData(res) {
      if (this.currentPage == 1) {
        //如果是第一页，会把汇总信息合并到data数组中
        this.formatFirstPageData(res);
      } else {
        this.listData = res.data;
      }
      this.formatProgressAllData();
    },
    // 获取项目汇总信息
    fetch_activity_data() {
      let start = moment(this.dataDuration[0]).format("YYYY-MM-DD");
      let end = moment(this.dataDuration[1]).format("YYYY-MM-DD");
      let time = {
        start,
        end
      };
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        return fetch
          .post(
            "/activity/index",
              {
                page: this.currentPage,
                project_id: this.project_id,
                // advertiser_id:1,
                limit: this.pageSize,
                time: time,
                name: this.searchVal
              }
          )
          .then(res => {
            this.isLoading = false;
            if (res.ret == 0) {
              //存储产品线和品牌的名称
              this.update_brand_name(res.brand_name);
              this.update_product_name(res.product_name);
              this.formatData(res);

              this.total = res.total - 0;
              resolve();
            } else {
              this.listData = [];
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            this.isLoading = false;
            reject(err);
          });
      });
    },
    //对项目的操作 arr [{"id":1,"status":1},{"id":2,"status":1}]
    // 操作码 1开启，2中止，3暂停 4推送pbs
    fetch_operat_project(arr) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/activity/status", { data: arr })
          .then(res => {
            //debugger
            if (res.ret == 0) {
              //debugger
              for (let i of arr) {
                let item = _.find(this.listData, { project_id: i.id });
                item.status = i.status
              }
              resolve();
            } else {
              //debugger
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            //debugger
            reject(err);
          });
      });
    },
    fetch_push_project(params,arr) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/activity/push", { activity_ids: params })
          .then(res => {
            if (res.ret == 0) {
              //debugger
              for (let i of arr) {
                let item = _.find(this.listData, { project_id: i });
                // item.status = pushOperate;
              }
              resolve();
            } else {
              //debugger
              reject(res.msg);
            }
          })
          .catch(err => {
            //debugger
            reject(err);
          });
      });
    },

    // 打开“消费和预算”弹窗
    openChartDialog(row) {
      fetch
        .post("/project/cost", {
          activity_id: row.project_id,
          time: {
            start: moment(this.dataDuration[0]).format('YYYY-MM-DD'),
            end: moment(this.dataDuration[1]).format('YYYY-MM-DD')
          }
        })
        .then(res => {
          if (res.ret == 0) {
            let series = res.data.series;
            let xdata = res.data.xdata;
            this.chart_data_x = { series, xdata };
            this.dialogChart = true;
          } else {
            this.$message.info(res.msg)
          }
        })
        .catch(err => {
          alert(err.message);
        });
    }
  },
  components: {
    SidebarTree,
    ProjectNav,
    DaterangePicker,
    activityChart,
    dialogChart,
    CheckboxDropdown,
    AlertList
  }
};
</script>
<style scoped>

.icon-detail {
  position: absolute;
  right: 8px;
  font-size: 16px;
  top: 15px;
  cursor: pointer;
}
.dialog-text{
  color: red;
  font-size: 14px;
  text-align: left;
}
</style>
