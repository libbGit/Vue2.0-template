<template>
  <!-- <div class="m__wraper"> -->
    <!-- 侧边栏 -->
    <!-- <div class="m__sidebar">
      <sidebar-tree />
    </div> -->

    <div class="m__content">
      <!-- 导航栏 -->

      <!-- 内容区域 -->
      <div class="clearfix nav-wrap">
        <div class="pull-left">
          <ad-nav />
        </div>
      </div>
      <div class="content-wrap">
        <div class="hy-card">
          <div class="developing-area hy-card__content ">
            <div class="developing-area  ">
              <i class="iconfont developing"></i>
              <p>开发中，敬请期待...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- </div> -->
</template>
<script>
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
const openOperate = 1; //开启(正常)
const stopOperate = 2; //中止
const pauseOperate = 3; //暂停
export default {
  name: "ProjectOverview",
  components: {
    SidebarTree,
    AdNav,
    DaterangePicker,
    TestChart,
    dialogChart
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dataDuration: "", //操作后变成数组
      searchVal: "",
      operation: "",

      projectData: [],
      selection: [],
      date_range: [new Date(), new Date()],

      outerVisible: false,
      innerVisible: false,
      d_project_id: "",
      d_project_name: "",

      dialogChart: false,
      chart_data: {},
      isLoading: false,
      currentPage: 1, //当前页
      pageSize: 10, //每页的数据条数
      start_time: moment().format("YYYY-MM"),
      end_time: moment().format("YYYY-MM"),
      total: 12 //页面总数
    };
  },
  watch: {
    dataDuration(n, o) {
      this.handleSearch();
    }
  },
  computed: {
    ...mapState("ad", ["projects","ader_id"]),
  },
  created() {
    // this.fetch_project_data();
  },
  methods: {
    innerCancel() {
      this.innerVisible = false;
    },
    innerOk() {
      this.stopOperate();
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
        case 1:
          result = {
            type: "success",
            text: "投放中"
          };
          break;
        case 2:
          result = {
            type: "warning",
            text: "未投放"
          };
          break;
        case 1:
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
          // to do
          this.$router.push({
            path: "/project/edit"
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
    stopOperate() {
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
      let tem = {
        project_id: "--",
        name: "--",
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
        cost: "0"
      };
      obj.data.unshift(_.extend(tem, summary));
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
          obj[i] = (obj[i] - 0) * 100;
          obj[i] = obj[i] < 0 ? -obj[i] : obj[i];
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
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        return fetch
          .post(
            "/project/index",
            _.extend(
              {
                page: this.currentPage,
                advertiser_id:this.ader_id-0,
                limit: this.pageSize
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
