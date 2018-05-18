<template>
    <div>
        <div>
            <div class="hy-card__header clearfix">
                <label>{{title}}</label>
                <div class="pull-right" :inline="true">
                    <el-radio-group v-model="indexValue" size="mini" class="checkbox-group">
                        <el-radio-button label="1">CPC</el-radio-button>
                        <el-radio-button label="2">CTR</el-radio-button>
                    </el-radio-group>
                    <el-select v-model="filterValue" size="mini">
                        <el-option label="消费" value="1"></el-option>
                        <el-option label="展现" value="2"></el-option>
                        <el-option label="点击" value="3"></el-option>
                        <el-option label="转化" value="4"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="hy-card__content">
                <chart-line :data="getData" :headers="lineHeaders" :flag="getLineFlag"  v-if="getData.series.length>0"></chart-line>
            </div>
        </div>
        <div>
            <div>
                <div class="hy-card__content">
                    <el-table border size="mini" :data="values.tabletData" style="width: 100%">
                        <el-table-column header-align="center" align="center" prop="top" label="Top" width="50">
                        </el-table-column>
                        <el-table-column header-align="center" align="left" prop="name" label="创意组名称">
                        </el-table-column>
                        <el-table-column header-align="center" align="left" prop="plan" label="关联计划">
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
import chartLine from "@/views/report/index/public/chart/chart-line";
export default {
  name: "creative-group",
  props: {
    title: {
      //标题
      type: String,
      required: false
    },
    lineHeaders: {
      //折线图标题
      type: Array,
      required: false
    },
    values: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      indexValue: "1",
      filterValue: "1" //自定义条件的值
    };
  },
  computed: {
    getLineFlag(){
      return this.indexValue==1?'5':'7';
    },
    getData() {
      let xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: this.values.xAxisData
        }
      ];

      let yAxis = [
        {
          name: this.indexValue==1?'CPC':'CTR',
          nameLocation: "end",
          type: "value"
        }
      ];

      let series = this.values.lineSeriesData.map(item => {
        return { ...item, type: "line" };
      });

      return { xAxis, yAxis, series };
      
    }
  },
  watch: {
    filterValue: function(val) {
      this.$emit("update");
    },
    indexValue: function(val) {
      this.$emit("update");
    }
  },
  mounted () {
    this.$emit("update");
  },
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

.checkbox-group {
  float: left;
  margin-right: 20px;
}

.divide {
  padding: 5px;
  background-color: #f0f2f5;
}
</style>


