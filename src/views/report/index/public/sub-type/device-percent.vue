<template>
  <div>
    <div>
      <div class="hy-card__header clearfix">
        <label>{{title}}</label>
        <div class="pull-right" :inline="true">
          <el-select v-model="filterValue" size="mini">

            <el-option label="消费" value="1"></el-option>
            <el-option label="展现" value="2"></el-option>
            <el-option label="点击" value="3"></el-option>
            <!-- <el-option label="转化" value="4"></el-option> -->
          </el-select>
        </div>
      </div>
      <div class="hy-card__content clearfix" v-loading="isloading.pie">
        <div style="border-bottom:1px solid #eaeaea" class="clearfix">
          <chart-pie class="chart-pie pull-left" :data="getPieData" :flag="filterValue"></chart-pie>

          <div class="pull-left pie-table">
            <el-table border size="mini" :data="values.tabletData" style="width: 100%;">
              <el-table-column header-align="center" align="center" prop="top" label="TOP">
              </el-table-column>
              <el-table-column header-align="center" align="left" prop="name" label="终端">
              </el-table-column>
              <el-table-column v-if="filterValue=='1'" header-align="center" align="right" prop="value" label="消费">
                <template slot-scope="scope">
                  {{$formatMoney(scope.row['value'],2,'¥')}}
                </template>
              </el-table-column>
              <el-table-column v-if="filterValue=='2'" header-align="center" align="right" prop="value" label="展现">
                <template slot-scope="scope">
                  {{$formatMoney(scope.row['value'],0,'')}}
                </template>
              </el-table-column>
              <el-table-column v-if="filterValue=='3'" header-align="center" align="right" prop="value" label="点击">
                <template slot-scope="scope">
                  {{$formatMoney(scope.row['value'],0,'')}}
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="left" prop="percent" label="占比">
                <template slot-scope="scope">
                  <el-progress :show-text="false" :percentage="Number.parseFloat(scope.row['percent'])" :stroke-width="10"></el-progress>
                  <span>{{scope.row['percent']}}%</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="hy-card__header clearfix">
        <label>终端指标趋势</label>
        <div class="pull-right" :inline="true">
          <el-select v-model="indexValue" placeholder="CPC" size="mini">
            <el-option label="CPC" value="5"></el-option>
            <el-option label="CPM" value="6"></el-option>
            <el-option label="CTR" value="7"></el-option>
            <!-- <el-option label="CR" value="8"></el-option> -->
          </el-select>
        </div>
      </div>
      <div class="hy-card__content" v-loading="isloading.line" style="min-height:70px;">
        <chart-line :data="getLineData" :headers="lineHeaders" :flag="indexValue" v-if="getLineData.series.length>0"></chart-line>
        <div v-else-if="!isloading.line && getLineData.series.length==0" style="position: relative;left: 50%;font-size: 12px;transform: translate(-50%,-50%);text-align:center;color: #909399;">暂无数据</div>
      </div>
    </div>

    <div class="divide"></div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import _ from "lodash";

import chartLine from "@/views/report/index/public/chart/chart-line";
import chartPie from "@/views/report/index/public/chart/chart-pie";

export default {
  name: "device-percent",
  props: {
    title: {
      //标题
      type: String,
      required: true
    },
    loading: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterValue: "1", //默认消费  1,2,3,4
      indexValue: "5", // 5,6,7,8
      isloading: this.loading,
      lineHeaders: ["CPC"]
    };
  },
  computed: {
    /*...mapState({
      el_selects_value: state => state.report.el_selects_value, //每次获取settings都会执行此箭头函数
    }),*/
    getLineData() {
      let xAxis = [
        {
          type: "category",
          boundaryGap: false,
          data: this.values.xAxisData
        }
      ];

      let yAxis = [
        {
          // name: this.getIndexName(this.indexValue),
          // nameLocation: "end",
          type: "value"
        }
      ];

      let series = this.values.lineSeriesData.map(item => {
        for(let i in item.data){
          // if(this.filterValue=='1'){
            item.data[i] = parseFloat(item.data[i]).toFixed(2);
          // }
          // if(this.filterValue=='2'){
          //   item.data[i] = parseFloat(item.data[i]).toFixed(0);
          // // }
          // // if(this.filterValue=='3'){
          //   item.data[i] = parseFloat(item.data[i]).toFixed(0);
          // // }
          // // if(this.filterValue=='4'){
          //   item.data[i] = parseFloat(item.data[i]).toFixed(0);
          // }
        }
        return { ...item, type: "line" };
      });

      return { xAxis, yAxis, series };
    },

    getPieData() {
      let newPieSeriesData  = [];
      if (this.values.pieSeriesData.length > 0) {
        for (let i in this.values.pieSeriesData) {
          let item = this.values.pieSeriesData[i];
          if (this.filterValue == "1") {
            newPieSeriesData.push({
              name: item.name,
              value: parseFloat(item.value).toFixed(2)
            });
          }
          if (this.filterValue == "2") {
            newPieSeriesData.push({
              name: item.name,
              value: parseFloat(item.value).toFixed(0)
            });
          }
          if (this.filterValue == "3") {
            newPieSeriesData.push({
              name: item.name,
              value: parseFloat(item.value).toFixed(0)
            });
          }
          if (this.filterValue == "4") {
            newPieSeriesData.push({
              name: item.name,
              value: parseFloat(item.value).toFixed(0)
            });
          }
        }
      }
      return newPieSeriesData;
    }
  },
  watch: {
    filterValue: {
      handler: function(val) {
        this.$emit("update");
        this.isloading.pie = true;
      },
      deep: true
    },
    indexValue: {
      handler: function(val) {
        // this.getIndexName(val);
        let name = this.getIndexName(val);
        this.lineHeaders = [name];

        this.$emit("updateIndex");
        this.isloading.line = true;
      },
      deep: true
    }
  },
  methods: {
    getIndexName(val) {
      let name = "";
      switch (val) {
        case "5":
          name = "CPC";
          break;
        case "6":
          name = "CPM";
          break;
        case "7":
          name = "CTR";
          break;
        case "8":
          name = "CR";
          break;
      }
      return name;
    },

    /** 获取下拉框选择的值 */
    // setElSelectsValue() { 
    //   let route = this.$route.path.substring(
    //     this.$route.path.lastIndexOf("/") + 1
    //   );

    //   let el_selects = {
    //     filterValue:'',
    //     indexValue:'',
    //     headerName:''
    //   }
    //   switch (route) {
    //     case "advertiser":
    //       el_selects = _.cloneDeep(this.el_selects_value.advertiser_el_selects.device_percent);
    //       break;
    //     case "brand":
    //       break;
    //     case "productline":
    //       break;
    //     case "project":
    //       break;
    //     case "activity":
    //       break;
    //     case "campaign":
    //       break;
    //   }

    //   this.filterValue = el_selects.filterValue?el_selects.filterValue:this.filterValue;
    //   this.lindexValue = el_selects.indexValue?el_selects.indexValue:this.lindexValue;
    //   this.lineHeaders = el_selects.headerName?[ el_selects.headerName]:this.lineHeaders;
    // },
  },

  // mounted () {
  //   this.setElSelectsValue();
  // },

  mounted () {
    //更换slot位置后，重新渲染，组件
    this.$emit("update");
    this.isloading.pie = true;
    
    this.$emit("updateIndex");
    this.isloading.line = true;
  },
  

  components: {
    chartLine,
    chartPie
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

.chart-pie {
  width: 50%;
}
.pie-table {
  width: 50%;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  top: 50px;
}

.el-progress {
  width: 68%;
  display: inline-block;
  margin-right: 5px;
}
</style>


