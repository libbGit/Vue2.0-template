<template>
  <div class="m__content">
    <!-- 导航栏 -->
    <div class="clearfix nav-wrap">
      <div class="pull-left">
        <ad-nav />
      </div>
      <div class="pull-right">
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
      </div>
    </div>

      <!-- 内容区域 -->
      <div class="content-wrap">
        <!-- 数据显示 -->
        <div class="hy-card" >
          <!-- head start-->
          <div class="hy-card__header clearfix">

            <div class="pull-left">
              <el-button type="primary" size="mini" @click='createProject' v-if='enableOpera' icon="el-icon-plus">新建项目</el-button>
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
                </el-dropdown-menu>
              </el-dropdown>

              <!--<el-select v-model="operation" placeholder="请选择" @change='handleOperationChange' @visible-change='handleVisibleChange' size="small">-->
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
              <el-input size="mini" style="width:200px;"
                 placeholder="请输入项目名称"
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
              :data="projectData"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">

                <el-table-column
                  type="selection"
                  :selectable='onSelectable'
                  width="40">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('project_id') > -1"
                  prop="project_id"
                  width="60"
                  label="项目ID">
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
                   <template slot-scope="scope">
                     {{scope.row['product_name']==null?'--':scope.row['product_name']==''?'--':scope.row['product_name']}}
                   </template>
                </el-table-column>

                <el-table-column
                  prop="status"
                  label="操作状态"
                  width="80">
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
                width="80">
                <template slot-scope="scope">
                  <el-tag :type="formatadvertiserStatus(scope.row['run_status']).type" v-if="scope.row.run_status!='--'">
                    {{formatadvertiserStatus(scope.row['run_status']).text}}
                  </el-tag>
                  <span v-else>{{scope.row.run_status}}</span>
                </template>
              </el-table-column>


                <el-table-column
                  prop="name"
                  label="项目名称"
                >
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click='goActivity(scope.row.project_id,scope.row.name)' :title="scope.row['name']">
                      {{scope.row['name']}}
                    </el-button>
                    <el-button v-if="scope.row.status!=2&&scope.row.status!='--'"
                               type="text"
                               size="mini"
                               icon="el-icon-edit"
                               title="编辑"
                               @click="handle_edit(scope.row)">

                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="budget"
                  label="预算"
                  align="right">
                  <template slot-scope="scope">
                    ¥{{$formatPrice($toDecimal2(scope.row['budget']))}}
                  </template>
                </el-table-column>

                <!-- <el-table-column v-if="check_columns.indexOf('budget_progress') > -1"
                  prop="budget_progress"
                  label="预算进度"
                  align="center"
                  width="220">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.budget_progress" v-if="scope.row.budget_progress!='--'">
                    </el-progress>
                    <span v-else>{{scope.row.budget_progress}}</span>
                  </template>
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cost_progress') > -1"
                  prop="cost_progress"
                  label="消费进度"
                  align="center"
                  width="220">
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
                </el-table-column>-->

                <el-table-column
                  prop="time_progress"
                  label="投放进度"
                  width="100">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.time_progress" v-if="scope.row.time_progress!='--'">
                    </el-progress>
                    <span v-else>{{scope.row.time_progress}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="start_time"
                  width="100"
                  label="开始时间">
                </el-table-column>

                <el-table-column
                  prop="end_time"
                  width="100"
                  label="结束时间">
                </el-table-column>

                <!-- <el-table-column
                  prop="cost"
                  width="120"
                  align="center"
                  label="已消耗">
                </el-table-column> -->

                <el-table-column
                  prop="pv"
                  width="80"
                  label="展现数"
                  align="right">
                </el-table-column>

                <el-table-column
                  align="right"
                  prop="click"
                  width="80"
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
                  align="right"
                  width="80"
                  label="CPM">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('leads') > -1"
                  prop="leads"
                                 align="right"
                  width="80"
                  label="Leads">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cpl') > -1"
                  prop="cpl"
                  align="right"
                  width="80"
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
          <dialog-chart :data="chart_data"/>
        </el-dialog>
        <!-- 进度图表 end -->
        <!-- 中止提示框 start-->
        <el-dialog width="30%" :title='dialogTitle' :visible.sync="outerVisible">
           <!-- <span>{{ campaigns.map( item => {return item.name}).join(',') }}</span> -->
           <span>{{ getCampaignsName}}</span>
           <p style="color: red;">如中止将会把项目下全部活动，计划中止，确定要进行此操作吗？</p>
           <el-dialog width="30%" :title="'确定将此项目 '+checkProjectName+' 中止吗？'" :visible.sync="innerVisible" append-to-body>
             <span style="color: red;">如中止将会把此项目下全部活动，计划中止</span>
             <div slot="footer" class="dialog-footer" >
               <el-button @click="innerCancel">取 消</el-button>
               <el-button type="primary" @click="innerOk">确认</el-button>
             </div>
           </el-dialog>
           <div slot="footer" class="dialog-footer">
             <el-button @click="outterCancel">取 消</el-button>
             <el-button type="primary" @click="outterOk">确认</el-button>
           </div>
         </el-dialog>
        <!-- 中止提示框 end-->
      </div>
    </div>

  <!-- </div> -->
</template>
<script>
import math from "mathjs";
import _ from "lodash";
import axios from "axios";
import dialogChart from "./dialog_chart";
import SidebarTree from "@/views/ad/public/sidebar-tree";
import AdNav from "@/views/ad/public/ad-nav";
import DaterangePicker from "@/views/public/daterange-picker";
import TestChart from "@/views/test/chart";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
import CheckboxDropdown from '@/views/public/checkbox-dropdown'

const openOperate = 1; //开启(正常)
const stopOperate = 2; //中止
const pauseOperate = 3; //暂停
math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});
export default {
  name: "ProjectManage",
  components: {
    SidebarTree,
    AdNav,
    DaterangePicker,
    TestChart,
    dialogChart,
    CheckboxDropdown
  },
  data() {
    return {
      enableOpera:true,
      isCreateProject:false,
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

      projectData: [],
      selection: [],
      date_range: [new Date(), new Date()],

      outerVisible: false,
      innerVisible: false,
      d_project_id: "",
      d_project_name: "",

      check_columns: [],
      extral_column: [
        {
          label: "项目ID",
          prop: "project_id"
        },{
          label: "品牌",
          prop: "brand_name"
        },{
          label: "产品线",
          prop: "product_name"
        },{
          label: "CTR",
          prop: "ctr"
        },{
          label: "CPC",
          prop: "cpc"
        },{
          label: "CPM",
          prop: "cpm"
        },{
          label: "Leads",
          prop: "leads"
        },{
          label: "CPL",
          prop: "cpl"
        },{
          label: "CR",
          prop: "cr"
        }
      ],

      dialogChart: false,
      chart_data: {},
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
    }
  },
  computed: {
    ...mapState("ad", ["projects","ader_id","ader_opera_status"]),
    ...mapState({
      brand_forms: state => state.advertiser.brand_forms
    }),
    checkProjectName() {
      if (this.selection.length == 1) {
        let name = this.selection[0]["name"];
        return name;
      }
    },
    dialogTitle() {
      let str = "项目包含活动：";
      if (this.getCampaignsName=='') {
        str = "项目下没有活动";
      }
      return this.checkProjectName+str;
    },
    getCampaignsName() {
      if (this.selection.length == 1) {//debugger
        let names = [];
        let project_id = this.selection[0]["project_id"];//debugger
        for (let i of this.projects) {
          if (i.id == project_id) {
            if (Array.isArray(i.children)) {
              for (const j of i.children) {
                names.push(j.activity_name);
              }
            }

          }
        }
        return names.join(",");
      }
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
    }
  },
  created() {
    this.fetch_project_data();
    this.fetch_brand_form(this.ader_id);
    this.fetch_getStatus({id:this.ader_id,type:'ader'}).then(data=>{
      this.enableOpera = data.status!=2;
    });
  },
  methods: {
    ...mapActions("advertiser",['fetch_brand_form']),
    ...mapActions("ad", [
      'update_project_id',
      'update_project_name',
      'fetch_getStatus'
    ]),
    onSelectable(row, index){
      if (index==0&&this.currentPage==1) {
        return false
      }
      return true;
    },
    handle_edit(obj){
      this.$router.push({
        path: "/ad/project/edit/"+obj['project_id']
      });
    },
    goActivity(id,name){
      if (id=='--') {return}
      this.update_project_id(id);
      this.update_project_name(name);
      this.$router.push({
        path: '/ad/activity/manage'
      });
    },
    createProject(){
      if (this.brand_forms.length) {
        this.$router.push({path:"/ad/project/create"})
      }else{
        this.$alert(' 您还未创建品牌，无法新建项目，请先创建品牌！', '提示', {
          confirmButtonText: '确定'
        });
      }
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
        default:
      }
      return result;
    },
    //操作状态 0中止 1运行 2暂停
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
       * @param  {[type]}  type [说明：1开启(正常)  2中止  3暂停]
       * @return {Boolean}      [description]
       */
    hasItmeByStatus(type) {
      let arr = this.getOperationStatus(); //数字中是number不是string
      return arr.indexOf(type - 0) != -1;
    },
    /**
       * 获取勾选后项目的操作状态
       * [getOperationStatus description]
       * @return {[type]} [1,2,3] 说明：1开启  2中止  3暂停
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
      let start = moment(this.dataDuration[0]).format("YYYY-MM-DD");
      let end = moment(this.dataDuration[1]).format("YYYY-MM-DD");
      let obj = {
        name: this.searchVal,
        time: {
          start,
          end
        }
      };
      this.fetch_project_data(obj);
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
      this.fetch_project_data();
    },
    // 处理日期筛选
    handleDateChange() {
      if (this.start_time > this.end_time) {
        this.$message({
          message: "开始月不能晚于结束月",
          type: "warning"
        });
      } else {
        this.fetch_project_data();
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
        default:
      }
    },
    //编辑
    edit() {
      if (this.selection.length == 1) {
        //中止的项目不可编辑  to do
        if (this.selection[0]["status"] == stopOperate) {
          this.$alert("中止的项目不可编辑", "提示", {
            type: "warning",
            center: true
          });
        } else {
          this.$router.push({
            path: "/ad/project/edit/"+this.selection[0]['project_id']
          });
        }
      } else if (this.selection.length == 0) {
        this.$alert("请选择需要编辑的项目", "提示", {
          type: "warning",
          center: true
        });
      } else {
        this.$alert("一次只能编辑一个项目", "提示", {
          type: "warning",
          center: true
        });
      }
    },
    //暂停
    pause() {
      if (this.selection.length == 0) {
        this.$alert("请选择需要暂停的项目", "提示", {
          type: "warning",
          center: true
        });
      } else {
        let result = [];
        for (let i of this.selection) {
          result.push({ id: i.project_id, status: pauseOperate });
        }
        this.fetch_operat_project(result)
          .then(res => {
            this.$message({
              message: "项目暂停成功",
              type: "success"
            });
          })
          .catch(err => {
            this.$message.error("暂停项目失败，请稍后重试");
          });
      }
    },
    // 开启
    open() {
      if (this.selection.length == 0) {
        this.$alert("请选择需要开启的项目", "提示", {
          type: "warning",
          center: true
        });
      } else {
        let result = [];
        for (let i of this.selection) {
          result.push({ id: i.project_id, status: openOperate });
        }
        this.fetch_operat_project(result)
          .then(res => {
            this.$message({
              message: "项目开启成功",
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
        this.$alert("一次只能中止一个项目", "提示", {
          type: "warning",
          center: true
        });
      } else if (this.selection.length == 0) {
        this.$alert("请选择需要中止的项目", "提示", {
          type: "warning",
          center: true
        });
      } else {
        var data = this.selection[0];
        if (data.status == stopOperate) {
          this.$alert("所选择的广告主已中止", "提示", {
            type: "warning",
            center: true
          });
        } else {
          this.outerVisible = true;
          return;
        }
      }
    },
    stopOperateFn() {
      let data = this.selection[0];
      this.fetch_operat_project([{ id: data.project_id, status: stopOperate }])
        .then(res => {
          this.$message({
            message: "项目中止启成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message.error("项目中止失败，请稍后重试");
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
        project_id: "--",
        name: "总计",
        budget: "100",
        start_time: "--",
        end_time: "--",
        brand_name: "总计",
        product_name: "--",
        status: "--",
        run_status: "--",
        budget_progress: "--",
        cost_progress: "--",
        time_progress: "--",
        pv: "0",
        click: "0",
        ctr: "0",
        cpc: "0",
        cpm: "0",
        cost: "0",
        cr:'0'
      };
      let tem2 = {
        time_progress:"--",
        run_status:"--"
      };
      obj.data.unshift(_.extend(tem, summary,tem2));
      this.projectData = obj.data;
    },
    formatProgressAllData() {
      for (let i of this.projectData) {
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
        this.projectData = res.data;
      }
      this.formatProgressAllData();
    },
    // 获取项目汇总信息
    fetch_project_data(obj) {
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
            "/project/index",
            _.extend(
              {
                page: this.currentPage,
                advertiser_id:this.ader_id-0,
                // advertiser_id:1,
                limit: this.pageSize,
                time:time
              },
              obj || {}
            )
          )
          .then(res => {
            this.isLoading = false;
            if (res.ret == 0) {
              this.formatData(res);

              this.total = res.total - 0;
              resolve();
            } else {
              this.projectData = [];
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
    // 操作码 1开启，2中止，3暂停
    fetch_operat_project(arr) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/project/status", { data: arr })
          .then(res => {
            //debugger
            if (res.ret == 0) {
              //debugger
              for (let i of arr) {
                let item = _.find(this.projectData, { project_id: i.id });
                item.status = i.status;
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
    // 打开“消费和预算”弹窗
    openChartDialog(row) {
      fetch
        .post("/project/cost", {
          project_id: row.project_id,
          time: {
            start: row.start_time,
            end: row.end_time
          }
        })
        .then(res => {
          //debugger
          if (res.ret == 0) {
            let series = res.series;
            let xdata = res.data.xdata;
            this.chart_data = { series, xdata };
            this.dialogChart = true;
          } else {
            alert(res.msg);
          }
        })
        .catch(err => {
          alert(err.message);
        });
    }
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
</style>
