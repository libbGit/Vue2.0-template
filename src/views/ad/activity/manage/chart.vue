<template>
  <div class="dialog-wrap">
    <div id="chart" ref="chart"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: 'AderChart',
    mounted () {
      this.$chart = echarts.init(this.$refs.chart);
      this.createChart();
    },
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    watch: {
      data: {
        handler: function(data){
          if(data) {
            this.createChart();
          }
        },
        deep: false
      }
    },
    methods: {
      createChart() {
        var series  = this.data.series.map( item => {
          if( item.name == 'pv' ) {
            item.yAxisIndex = 1
            item.name = "展现数"
          }
          else {
            item.yAxisIndex = 0
            item.name = "点击数"
          }
          item.barWidth = "30%"
          item.type = "line";
          return item
        });
        var option = {
            color: ['#409EFF','#EB9E05'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: 20,
              right: 20,
              bottom: 20,
              top: 40,
              containLabel: true,
              height: 180
            },
            legend: {
              data:['点击数','展现数'],
              itemHeight:10
            },
            xAxis : [
              {
                type : 'category',
                data : this.data.xdata
              }
            ],
            yAxis : [
              {
                splitLine: {
                  show: false
                },
                name: '',
                type : 'value',
                axisLine: {
                  show: false
                },
                axisTick:{
                  show:false
                }
              },
              {
                splitLine: {
                  show: true
                },
                name: '',
                type : 'value',
                axisLine: {
                  show: false
                },
                axisTick:{
                  show:false
                }
              }
            ],
            series : series
        };
        this.$chart.setOption(option);
      }
    }
  }
</script>
<style scoped>
  .dialog-wrap {
    background: #fff;
  }
  #chart {
    width: 100%;
    height: 240px;
  }
</style>
