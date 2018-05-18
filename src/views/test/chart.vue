<template>
  <div class="chart-wrap">
    <div id="chart" ref="chart"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: 'AderChart',
    mounted () {
      this.createChart();
    },
    methods: {
      createChart() {
        var option = {
            color: ['#409EFF','#EB9E05'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '5%',
              bottom: '5%',
              top: '8%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                data : ['05-14', '05-15', '05-16', '05-17', '05-18', '05-19', '05-20']
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series :[
              {
                name:'消费预算',
                type:'line',
                barWidth: '30%',
                data:[10, 52, 200, 334, 390, 330, 220]
              },
              {
                name:'实际消费',
                type:'line',
                barWidth: '30%',
                data:[ 330,200,10,334,  52,  390, 220]
              }
            ]
        };
        var myChart = echarts.init(this.$refs.chart);
        myChart.setOption(option);
      }
    }
  }
</script>
<style scoped>
  .chart-wrap {
    background: #fff;
    box-shadow: 2px 2px 5px rgba(0,0,0,.3);
  }
  #chart {
    width: 100%;
    height: 250px;
  }
</style>
