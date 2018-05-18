<template>
  <div>
    <div class="hy-card__header clearfix">
      <label>{{title}}</label>
      <div class="pull-right" :inline="true">
        <!-- 多选 -->
        <el-select popper-class="multi-select" v-if="values.multiaxis" v-model="multiFilterValue" size="mini" :multiple="values.multiaxis" :multiple-limit="values.multiaxis?2:0">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- 单选 -->
        <el-select v-else v-model="filterValue" size="mini">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="hy-card__content" style="min-height:300px">
      <chart-line :data="getData" :headers="getHeaders" :flag="filterValue" :multiFlag="getMultiAxisFlag" v-if="getData.series.length>0"></chart-line>
      <div v-else style="position: relative;left: 50%;font-size: 12px;transform: translate(-50%,-50%);text-align:center;color: #909399;">暂无数据</div>
    </div>

    <div class="divide"></div>
  </div>
</template>
<script>
import chartLine from "@/views/report/index/public/chart/chart-line";
export default {
  name: "data-trend", // 广告主数据趋势，品牌数据趋势，，，，等
  props: {
    title: {
      //标题
      type: String,
      required: true
    },
    headers: {
      //折线图标题
      type: Array,
      required: true
    },
    values: {
      //表格数据
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterValue: "1", //单选
      multiFilterValue: ["1"], //多选
      options: [
        {
          value: "1",
          checked: false,
          label: "消费"
        },
        {
          value: "2",
          checked: false,
          label: "展现"
        },
        {
          value: "3",
          checked: false,
          label: "点击"
        },
        {
          value: "4",
          checked: false,
          label: "转化"
        }
      ]
    };
  },
  computed: {
    getHeaders() {
      if (this.values.multiaxis) {
        return [];
      } else {
        return this.headers;
      }
    },

    getMultiAxisFlag() {
      if (this.values.multiaxis) {
        return this.multiFilterValue;
      } else {
        return [];
      }
    },

    getData() {
      let xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: this.values.xAxisData
        }
      ];

      let yAxis = [];

      let series = [];
      if (this.values.multiaxis) {
        /*一个或多指标*/
        if (this.multiFilterValue.length > 1) {
          //多指标
          yAxis = [
            {
              name: this.options.filter(
                item => item.value == this.multiFilterValue[0]
              )[0].label,
              nameLocation: "end",
              type: "value"
            },
            {
              name: this.options.filter(
                item => item.value == this.multiFilterValue[1]
              )[0].label,
              nameLocation: "end",
              type: "value"
            }
          ];
          //判断数据是否正确
          if (this.values.seriesData.length != 2) {
            // this.$message.error('返回数据不正确');
            return { xAxis: [], yAxis: [], series: [] };
          }
          series = [
            {
              name: this.options.filter(
                item => item.value == this.multiFilterValue[0]
              )[0].label,
              type: "line",
              data: this.formatLineData(this.values.seriesData[0].data)
            },
            {
              name: this.options.filter(
                item => item.value == this.multiFilterValue[1]
              )[0].label,
              type: "line",
              yAxisIndex: 1,
              data: this.formatLineData(this.values.seriesData[1].data)
            }
          ];
        } else {
          if (this.values.seriesData.length > 0) {
            //单指标
            yAxis = [
              {
                name: this.options.filter(
                  item => item.value == this.multiFilterValue
                )[0].label,
                nameLocation: "end",
                type: "value"
              }
            ];
            series = [
              {
                name: this.options.filter(item => {
                  return item.value == this.multiFilterValue;
                })[0].label,
                type: "line",
                yAxisIndex: 0,
                data: this.formatLineData(this.values.seriesData[0].data)
              }
            ];
          } else {
            xAxis = [];
            yAxis = [];
            series = []
          }
        }
      } else {
        yAxis = [
          {
            name: this.options.filter(item => item.value == this.filterValue)[0]
              .label,
            nameLocation: "end",
            type: "value"
          }
        ];
        series = this.values.seriesData.map(item => {
          return {
            ...item,
            type: "line"
          };
        });
        series.data = this.formatLineData(series.data);
      }

      return { xAxis, yAxis: yAxis, series: series };
    }
  },
  watch: {
    filterValue: function(val) {
      this.$emit("update");
    },

    multiFilterValue: {
      handler: function(val) {
        this.$emit("update");
      },
      deep: true
    }
  },
  methods: {
    formatLineData(data) {
      let newData = [];
      for (let i in data) {
        if (this.filterValue == "1") {
          newData.push(parseFloat(data[i]).toFixed(2));
        }
        if (this.filterValue == "2") {
          newData.push(parseFloat(data[i]).toFixed(0));
        }
        if (this.filterValue == "3") {
          newData.push(parseFloat(data[i]).toFixed(0));
        }
        if (this.filterValue == "4") {
          newData.push(parseFloat(data[i]).toFixed(0));
        }
      }
      return newData;
    }
  },
  updated() {},
  components: {
    chartLine
  }
};
</script>

<style scoped>
.hy-card__header {
  border-bottom: 0;
}

.hy-card__content {
  padding: 0;
}

.divide {
  padding: 5px;
  background-color: #f0f2f5;
}
</style>


