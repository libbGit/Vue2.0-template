<template>
    <div>
        <div class="hy-card__header clearfix">
            <label>{{title}}</label>
            <div class="pull-right" :inline="true">
                <el-select v-model="filterValue" size="mini">
                    <el-option label="消费" value="1"></el-option>
                    <el-option label="展现" value="2"></el-option>
                    <el-option label="点击" value="3"></el-option>
                    <el-option label="转化" value="4"></el-option>
                </el-select>
            </div>
        </div>
        <div class="hy-card__content clearfix">
            <div style="border-bottom:1px solid #eaeaea" class="clearfix">
                <chart-pie class="chart-pie pull-left" :data="getPieData" :flag="filterValue"></chart-pie>
                <div class="pull-left pie-table">
                    <el-table border size="mini" :data="values.tabletData" style="width: 100%;">
                        <el-table-column header-align="center" align="center" prop="top" label="TOP">
                        </el-table-column>
                        <el-table-column header-align="center" prop="adform" label="媒体">
                        </el-table-column>
                        <el-table-column header-align="center" align="right" prop="cost" label="消费">
                            <template slot-scope="scope">
                                {{$formatMoney(scope.row['cost'],2,'¥')}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="right" prop="pv" label="展现">
                            <template slot-scope="scope">
                                {{$formatMoney(scope.row['pv'],0,'')}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="right" prop="click" label="点击">
                            <template slot-scope="scope">
                                {{$formatMoney(scope.row['click'],0,'')}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="right" prop="ctr" label="CTR">
                            <template slot-scope="scope">
                                {{scope.row['ctr']}}%
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="right" prop="cpc" label="CPC">
                            <template slot-scope="scope">
                                {{$formatMoney(scope.row['cpc'],2,'¥')}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="right" prop="leads" label="Leads">
                            <template slot-scope="scope">
                                {{$formatMoney(scope.row['leads'],0,'')}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <div class="divide"></div>
    </div>
</template>
<script>
import chartPie from "@/views/report/index/public/chart/chart-pie";

export default {
  name: "media-type",
  props: {
    title: {
      //标题
      type: String,
      required: true
    },
    values: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterValue: "1" //自定义条件的值
    };
  },
  computed: {
    getPieData() {
      let newPieSeriesData = [];
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
      },
      deep: true
    }
  },
  mounted () {
    this.$emit("update");
  },
  components: {
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
</style>


