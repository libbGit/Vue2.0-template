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
                        <el-option label="转化" value="4"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="hy-card__content">
                <el-table border size="mini" :data="values" style="width: 100%">
                    <el-table-column header-align="center" align="center" prop="top" label="Top" width="50">
                    </el-table-column>
                    <el-table-column header-align="center" align="left" prop="creative_group_name" label="创意组">
                    </el-table-column>
                    <el-table-column header-align="center" align="left" prop="creative" label="创意">
                    </el-table-column>
                    <el-table-column header-align="center" align="left" prop="relate_plan" label="关联计划">
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

        <div class="divide"></div>
    </div>
</template>
<script>
export default {
  name: "creative-data",
  props: {
    title: {
      //标题
      type: String,
      required: false
    },
    values: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      filterValue: "1", //自定义条件的值
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
  mounted () {
    this.$emit("update");
  },
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




