<template>
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
        <div class="hy-card__content clearfix">
            <div style="border-bottom:1px solid #eaeaea" class="clearfix">
                <chart-map class="chart-pie pull-left" :data="values.mapData" :map-max="visualMapMax(values.mapMax)"></chart-map>
                <div class="pull-left pie-table">
                    <el-table border size="mini" :data="values.tableData" style="width: 100%;">
                        <el-table-column header-align="center" align="center" prop="top" label="TOP">
                        </el-table-column>
                        <el-table-column header-align="center" align="left" prop="name" label="地区">
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
                        <el-table-column v-if="filterValue=='4'" header-align="center" align="right" prop="value" label="转化">
                            <template slot-scope="scope">
                                {{scope.row['value']}}
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

        <div class="divide"></div>
    </div>
</template>
<script>
import chartMap from "@/views/report/index/public/chart/chart-map";

export default {
  name: "region-type",
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
  watch: {
    filterValue: {
      handler: function(val) {
        this.$emit("update");
      },
      deep: true
    }
  },
  methods: {
    visualMapMax(num) {
      let length = (Math.round(num) + "").length;
      if (length > 3) {
        let top = Math.floor(num / Math.pow(10, length - 1));
        let maxNum =
          top * Math.pow(10, length - 1) + 5 * Math.pow(10, length - 2);
        if (num > maxNum) {
          return (top + 1) * Math.pow(10, length - 1);
        }
        return maxNum;
      }else{
        if(num<100){
            return 100;
        }else if(num<500){
            return 500;
        }else{
            return 1000;
        }
      }
    }
  },
  mounted () {
    this.$emit("update");
  },
  components: {
    chartMap
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