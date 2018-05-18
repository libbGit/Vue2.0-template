<template>
    <div class="hy-cost-table clearfix">
        <div style="padding: 10px; " v-if="renderData.length>0">
            <el-button size="mini" type="success" @click='onClickAverage'>均分</el-button>
            <div class="warn">
                {{balancePrefix}} {{balancePercentPrefix}}
            </div>
        </div>
        <div class="clearfix">
            <table border="0" 
                bordercolor="black" 
                width="" 
                cellspacing="0" 
                cellpadding="0" 
                v-for='monthItem in renderData' 
                :key='monthItem.month'>
                <thead>
                    <td :colspan="monthItem.monthData.length" :class="isDisableThead(monthItem.monthData)">
                        {{getMonthZN(monthItem.month)}}
                    </td>
                </thead>

                <tr>
                    <template v-for='(item,index) in monthItem.monthData'>
                        <td :key="index" v-if='index==0' class="disable whiteSpace" >
                            {{item.day}}
                        </td>
                        <td :key="index" v-else :class="isDisableTbody(item)" class="disable whiteSpace" >
                            {{item.day}}
                            <el-checkbox :true-label=1 :false-label=0 :value='item.locked' @input='onCheck(item,$event)'></el-checkbox>
                        </td>
                    </template>
                </tr>
                <tr>
                    <template v-for='(item,index) in monthItem.monthData'>
                        <td :key="index" v-if='index==0' class="disable whiteSpace" >{{item.budget}}</td>
                        <table-budget :key="index" v-else 
                            :totalBudget='totalBudget' 
                            :time='item.time' 
                            :locked='item.locked' 
                            :budget.sync='item.budget' 
                            :percent.sync='item.percent'>
                        </table-budget>
                    </template>
                </tr>
                <tr>
                    <template v-for='(item,index) in monthItem.monthData'>
                        <td :key="index" v-if='index==0' class="disable whiteSpace">{{item.percentage}}</td>
                        <table-percent :key="index" v-else 
                            :totalBudget='totalBudget' 
                            :time='item.time'
                            :budget.sync='item.budget'
                            :locked='item.locked'
                            :percent.sync='item.percent'>
                        </table-percent>
                    </template>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import math from "mathjs";
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import TablePercent from "./table-percent";
import TableBudget from "./table-budget";

math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});

const tomorrowDate = moment().add(1, "days");

export default {
  name: "CostTable",
  props: {
    totalBudget: {
      //总预算
      type: [Number],
      required: true,
      default: 0
    },
    time: {
      //开始时间和结束时间
      type: Array,
      required: true
      // default: []
    },
    isNew: {
      //是新建
      type: Boolean,
      default: false
    },
    dataChunk: {
      //数据块，编辑时从服务端拿的或者上传excel的
      type: Array
      // required: true,
      // default: []
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  watch: {
    dataChunk(nVal, oVal) {
      if (nVal.length) {
        this.setTableDataByChunk(nVal);
      }
    },
    time(nVal, oVal) {
      if (this.isReady) {
        this.setDataByTime();
      }
    },
    tableData: {
      handler: function(newVal, oldVal) {
        this.sendScheduleData();
      },
      deep: true
    }
  },
  computed: {
    isReady() {
      let isReady = false;
      if (this.time.length && this.totalBudget) {
        isReady = true;
      }
      return isReady;
    },
    balance() {
      let total = 0;
      for (let item of this.tableData) {
        total = math.eval(total + "+" + item.budget);
      }
      let balance = math.eval(total + "-" + this.totalBudget) - 0;
      return balance != 0 ? balance : "";
    },
    balancePrefix() {
      let str = this.balance;
      return this.prefix(str);
    },
    balancePercentPrefix() {
      let str = this.balancePercent;
      return this.prefix(str);
    },
    balancePercent() {
      if (this.balance != 0) {
        return math.round(math.eval(this.balance+"/"+this.totalBudget+"*100"),2) + "%";
        // return (this.balance / this.totalBudget * 100).toFixed(2) + "%";
      } else {
        return "";
      }
    },
    //依赖数据是tableData
    renderData() {
      let months = this.getMonths(); //对象数组
      for (let i = 0; i < months.length; i++) {
        let month = months[i];
        for (let j = 0; j < month.monthData.length; j++) {
          let day = month.monthData[j]; //debugger
          let obj = _.find(this.tableData, { time: month.month + "-" + day });
          if (obj) {
            obj.day = day;
            obj.percent = obj.percent ? obj.percent : "0";
            // console.log('obj.percent',obj.percent);
            // this.$set(obj, "inputState", false);
            month.monthData.splice(j, 1, obj);
          }
        }
        //设置第一列
        month.monthData.unshift({
          percentage: "占比",
          day: "日期",
          budget: "预算"
        });
      }
      return months;
    }
  },
  methods: {
    onCheck(item, val) {
      item.locked = val;
    },
    formatDataChunk(arr) {
      for (let i of arr) {
        i.budget = i.budget + "";
        i.percent = i.percent + "";
        i.locked = i.locked == undefined ? 0 : i.locked;
      }
    },
    //通过整个数据块设置tableData
    setTableDataByChunk(arr) {
      this.formatDataChunk(arr);
      if (this.isNew) {
        //新建的话，直接将数据块(excel)全部覆盖即可
        // this.tableData = arr;
        this.setTableDataByChunk_new(arr);
      } else {
        //编辑的话
        this.setTableDataByChunk_edit(arr);
      }
    },
    setTableDataByChunk_new(arr) {
      if (this.tableData.length) {
        for (let i of arr) {
          let time = i.time;
          let obj = _.find(this.tableData, { time });
          if (obj) {
            i.locked = obj.locked;
          }
        }
      } else {
        this.tableData = arr;
      }
    },
    setTableDataByChunk_edit(arr) {
      // return this.tableData = arr;
      //编辑时上传的excel，只覆盖excel中时间段内的数据
      if (this.tableData.length) {
        this.setVacancyPosition(arr);
        for (let i of arr) {
          let time = i.time;
          if (moment(moment() - 24 * 60 * 60 * 1000).isBefore(time)) {
            let index = _.findIndex(this.tableData, { time });
            if (index != -1) {
              this.tableData.splice(index, 1, i);
            }
          }
        }
      } else {
        //空的，就直接覆盖。其实就是编辑获取信息后第一次
        this.tableData = arr;
      }
    },
    //设置空缺位置，因为编辑时上传的数据块可能和上传前的数据在时间上不连续
    setVacancyPosition(arr) {
      let etime_arr = arr[arr.length - 1]["time"];
      let etime_table = this.tableData[this.tableData.length - 1]["time"];
      let etime = etime_table;
      if (moment(etime_arr) - moment(etime_table) > 0) {
        etime = etime_arr;
        this.setDataByTime(moment(this.time[0]), moment(etime));
      }
    },
    /**
     * [getMonths description]
     * @return {[type]} [ { "month": "2017年12月", "monthData": [  "27", "28", "29", "30", "31" ] }, { "month": "2018年01月", "monthData": [ "01", "02", "03" ] } ]
     */
    getMonths() {
      let obj = {};
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        let month = moment(item.time).format("YYYY-MM");
        // obj[month] = obj[month] || [];
        obj[month] ? "" : (obj[month] = []);
        obj[month].push(moment(item.time).format("DD"));
      }

      let keys = Object.keys(obj);
      // keys.sort((a, b) => a - b);
      keys.sort((a, b) => moment(a) - moment(b));
      let result = [];
      for (let i of keys) {
        result.push({ month: i, monthData: obj[i] });
      }
      return result;
    },
    /**
     * [setDataByTime description]
     * @param  {[type]} data {budget:4,isAverage:false,time:[]}
     * @return {[type]}      [{"time":"2017-11-1","budget":"60000","percent":"0.033"},{"time":"2017-11-1","budget":"60000","percent":"0.033"}]
     */
    setDataByTime(stime = this.time[0], etime = this.time[1]) {
      // console.log('setDataByTime-start')
      // this.formatDataBlock(newVal.excelData);
      // let startTime = this.time[0];
      // let endTime = this.time[1];
      let startTime = stime;
      let endTime = etime;

      let len = moment(endTime).diff(startTime, "days") + 1; //总天数
      let day_i = moment(startTime);

      let arr = [];

      //遍历新的数据
      for (let i = 0; i < len; i++) {
        if (i != 0) {
          day_i = day_i.add(1, "day");
        }

        let time = day_i.format("YYYY-MM-DD");
        //新的时间点是否能在老的时间段里找到
        let oldData = _.find(this.tableData, { time });
        // console.log('oldData',oldData)
        if (oldData) {
          arr.push(_.cloneDeep(oldData));
        } else {
          arr.push({ time, budget: "0", locked: 0 });
        }
      }
      // debugger
      // this.tableData = [];
      this.tableData = _.cloneDeep(arr);
    },
    //是否禁用表头 渲染使用
    isDisableThead(arr) {
      let last = _.last(arr);
      if (!moment(moment() - 24 * 60 * 60 * 1000).isBefore(last.time)) {
        //只有当前单元格是在今天之后才能被编辑
        return "disable";
      } else {
        return "";
      }
    },

    //是否禁用表body  渲染使用
    isDisableTbody(item) {
      if (!moment(moment() - 24 * 60 * 60 * 1000).isBefore(item.time)) {
        //只有当前单元格是在今天之后才能被编辑
        return "disable";
      } else {
        return "";
      }
    },
    //发送数据到父组件
    sendScheduleData() {
      let balance = this.balance == "" ? 0 : this.balance;
      this.$emit("scheduleData", {
        balance: balance,
        schedule: this.tableData
      });
    },
    // 差额前面的前缀 + - 号  渲染使用
    prefix(str) {
      str = str + "";
      if (str[0] != "-" && str[0] != undefined) {
        return "+" + str;
      } else {
        return str;
      }
    },
    // 表头显示的日期
    getMonthZN(str) {
      return moment(str).format("YYYY年MM月");
    },
    //格式化用户上传的excel数据块或者编辑时从服务端拿过来的数据块 暂时不用
    formatDataBlock(arr) {
      for (let i of arr) {
        i.time = moment(i.time).format("YYYY-MM-DD");
        i.percent = (i.budget / this.totalBudget).toFixed(4); //因为百分比，用户上传的excel中的不一定正确，我们统一重新计算，忽略用户上传值。
      }
      return arr;
    },
    onClickAverage() {
      this.averageBudget();
    },
    getBudgetUsed() {
      let arr = _.cloneDeep(this.tableData);
      let budgetUsed = 0;
      let dayUsed = 0;
      for (let i of arr) {
        let time = i.time;
        let budget = i.budget;
        //明天之前（今天及今天之前）  还有  被锁定的数据
        if (
          !moment(moment() - 24 * 60 * 60 * 1000).isBefore(time) ||
          i.locked
        ) {
          dayUsed = dayUsed + 1;
          budgetUsed = math.eval(budgetUsed + "+" + budget); //已经消耗的费用
        }
      }
      return [budgetUsed, dayUsed];
    },
    //均分
    averageBudget() {
      // console.log('averageBudget-start')
      if (!this.tableData.length) {
        this.setDataByTime();
      }
      this.$nextTick(() => {
        let arr = _.cloneDeep(this.tableData);
        let [budgetUsed, dayUsed] = this.getBudgetUsed();

        let len = this.tableData.length - dayUsed; //剩余的天数
        let surplus = math.eval(this.totalBudget + "-" + budgetUsed); //剩余的金额
        if (surplus - 0 > 0) {
          let averageBudget = math.round(math.eval(surplus + "/" + len), 2);
          for (let i of arr) {
            if (
              moment(moment() - 24 * 60 * 60 * 1000).isBefore(i.time) &&
              !i.locked
            ) {
              i.budget = averageBudget + "";
            }
          }

          let tem = math.eval(averageBudget + "*" + len);
          let diff = math.eval(surplus + "-" + tem);
          let lastObj = arr[arr.length - 1];
          lastObj["budget"] = math.eval(lastObj["budget"] + "+" + diff) + "";
          this.tableData = arr;
          return arr;
        } else {
          this.$message.error("可分配金额不足，无法均分，请调整总预算后重试");
        }
      });
    }
  },
  created() {},
  components: { TablePercent, TableBudget }
};
</script>
<style scoped>
.cost input {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
}

.hy-cost-table table {
  font-size: 12px;
  margin: 10px 10px 0 10px;
  color: #5a5e66;
  border-bottom: 1px solid #d8dce5;
  display: inline-block;
}

.hy-cost-table table tr td:last-child {
  border-right: 1px solid #d8dce5;
}

.hy-cost-table table thead td {
  border: none;
  color: #333;
  font-size: 14px;
  text-align: left;
  background: transparent;
}

.hy-cost-table table td {
  overflow: hidden;
  padding: 4px;
  box-sizing: content-box;
  border-right: 0px solid #d8dce5;
  border-left: 1px solid #d8dce5;
  border-top: 1px solid #d8dce5;
  text-align: center;
}

.warn {
  color: red;
}

.warn span {
  margin: 0 5px;
}

.disable {
  background-color: #f5f7fa;
}

.white {
  color: #666;
  background: #fff;
}

.whiteSpace {
  white-space: nowrap;
}
</style>
