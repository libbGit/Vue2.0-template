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
  name: "chart-pie",
  props: {
    data: {
      type: Array,
      required: false
    },
    flag:{
      type:String
    }
  },
  data() {
    return {};
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
    createChart() {
      let self = this;

      var option = {
        tooltip: {
          trigger: "item",
          formatter:function(params){
            let value = params.value;
            if(self.flag=="1"){
              value = self.$formatMoney(params.value,2,'');
            }
            if(self.flag=="2"){
              value = self.$formatMoney(params.value,0,'');
            }
            if(self.flag=="3"){
              value = self.$formatMoney(params.value,0,'');
            }
            if(self.flag=="4"){
              value = self.$formatMoney(params.value,0,'');
            }
            return params.seriesName+"<br/>"+params.name+" : "+value+" ("+params.percent+"%)";
          }     //   "{b} : {c} ({d}%)"
        },
        calculable : true,
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["55%","70%"],
            center: ["50%", "50%"],
            hoverAnimation:true,
            hoverOffset:3,
            label: {
                normal: {
                    formatter: '{b|{b}：}{per|{d}%}',
                    rich: {
                        b: {
                            fontSize: 16,
                            lineHeight: 18
                        },
                        per: {
                            // color: '#eee',
                            // backgroundColor: '#334455',
                            // padding: [1, 1],
                            height:18,
                        }
                    }
                }
            },
            labelLine:{
              normal:{
                length:10,
                lineStyle:{
                  type:'dotted',
                  width:2
                }
              }
              
            },
            data: this.data,
          }
        ]
      };
      this.$chart.setOption(option,true);
    }
  },
  mounted() {
    this.$chart = echarts.init(this.$refs.chart);
    this.createChart();
  },
};
</script>

<style scoped>
#chart {
  margin: 10px 0;
  height: 350px;
}
</style>


