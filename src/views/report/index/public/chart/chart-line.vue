<template>
  <div>
    <div>
      <div id="chart" ref="chart"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "chart-line",
  props: {
    headers: {
      type: Array,
      required: false
    },
    data: {
      type: Object,
      required: false
    },
    flag: {
      type: String
    },
    multiFlag: {
      type: Array
    }
  },
  data() {
    return {
      $chart: null,
      chartData: this.data
    };
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.chartData = val;
        this.createChart();
      },
      deep: true
    }
  },
  methods: {
    formatByFlag(flag, paramData) {
      let formatName = "";
      if (flag == "1") {
        //消费
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 2, "") +
          "<br/>";
      }
      if (flag == "2") {
        //展现
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 0, "") +
          "<br/>";
      }
      if (flag == "3") {
        //点击
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 0, "") +
          "<br/>";
      }
      if (flag == "4") {
        //转化
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 0, "") +
          "<br/>";
      }
      if (flag == "5") {
        //cpc
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 2, "") +
          "<br/>";
      }
      if (flag == "6") {
        //CPM
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 2, "") +
          "<br/>";
      }
      if (flag == "7") {
        //CTR
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 2, "") +
          "%<br/>";
      }
      if (flag == "8") {
        //CR
        formatName =
          paramData.seriesName +
          " : " +
          this.$formatMoney(paramData.data, 2, "") +
          "%<br/>";
      }

      return formatName;
    },
    createChart() {
      let self = this;

      // this.$chart.clear(); //清空当前实例
      // this.$chart = echarts.init(this.$refs.chart);

      let option = {
        legend: {
          data: this.headers
        },
        // color: ["black", "red"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(param) {
            let newParam = param[0].axisValue + "<br/>";

            if (self.multiFlag && self.multiFlag.length > 0) {
              //多指标
              for (let i in self.multiFlag) {
                newParam += self.formatByFlag(self.multiFlag[i], param[i]);
              }
            } else {
              for (let i in param) {
                newParam += self.formatByFlag(self.flag, param[i]);
              }
            }

            return newParam;
          }
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "5%",
          top: "15%",
          containLabel: true
        },
        xAxis: this.chartData.xAxis,
        yAxis: this.chartData.yAxis,
        series: this.chartData.series
      };
      this.$chart.setOption(option, true); //设置true，重新绘制
    }
  },
  mounted() {
    this.$chart = echarts.init(this.$refs.chart);
    this.createChart();
  },
  components: {}
};
</script>

<style scoped>
#chart {
  margin: 10px 0;
  width: 100%;
  height: 250px;
}
</style>


