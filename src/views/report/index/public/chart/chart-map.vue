<template>
  <div>
    <div>
      <div id="chart" ref="chart"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { pointData, geoCoordMap, convertData, chinaJson } from "./map";

export default {
  name: "chart-map",
  props: {
    data: {
      type: Array,
      required: false
    },
    mapMax: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      $chart: null
    };
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.data = val;
        this.createChart();
      },
      deep: true
    }
  },
  methods: {
    randomValue() {
      return Math.round(Math.random() * 2000);
    },

    createChart() {
      this.$chart.clear(); //清空当前实例
      this.$chart = echarts.init(this.$refs.chart);

      echarts.registerMap("china", chinaJson);

      var options = {
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [""]
        },
        visualMap: {
          min: 0,
          max: this.mapMax,
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
          inRange: {
            color: ["#e0ffff", "#006edd"]
          }
        },
        series: [
          {
            name: "地区",
            type: "map",
            mapType: "china",
            roam: false,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#9C4304"
                }
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                borderColor: "rgba(0, 0, 0, 0.2)",
                borderWidth: 0.5,
                color: "#E87320"
              }
            },
            data: this.data
          }
        ]
      };
      this.$chart.setOption(options);
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
  height: 500px;
  padding-left: 20px;
}
</style>


