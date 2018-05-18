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
        let self = this;

        var series  = this.data.series.map( item => {
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
            formatter: function(param) {
              //param[0]  param[1]
              let newParam = "";
              newParam = param[0].seriesName+":"+ self.$formatMoney(param[0].data, 2, "")+"<br/>"+
                         param[1].seriesName+":"+ self.$formatMoney(param[1].data, 2, "")

              return newParam;
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
                data : this.data.xdata
              }
            ],
            yAxis : [
              {
                type : 'value'
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
    margin: -50px -10px -30px;
  }
  #chart {
    width: 100%;
    height: 400px;
  }
</style>
