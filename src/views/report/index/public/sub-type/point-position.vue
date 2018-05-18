<template>
    <div>
        <div>
            <div class="hy-card__header clearfix">
                <label>{{title}}</label>
                <div class="pull-right" :inline="true">
                    <el-select v-model="mediaValue"  size="mini">
                        <el-option label="全部媒体" value=""></el-option>
                        <el-option v-for="option in options" :key="option.id" :label="option.media_name" :value="option.id"></el-option>
                    </el-select>
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
                    <el-table-column header-align="center" align="left" prop="media" label="媒体">
                    </el-table-column>
                    <el-table-column header-align="center" align="left" prop="pos" label="点位">
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
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "point-position",
  props: {
    title: {
      //标题
      type: String,
      required: true
    },
    values: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      mediaValue: "",   //默认所有媒体
      options:[],
      filterValue: "1" //自定义条件的值
    };
  },
  watch: {
    mediaValue: {
      handler: function(val, oldVal) {
        this.$emit("update");
      },
      deep: true
    },

    filterValue: {
      //监听date的变化
      handler: function(val) {
        this.$emit("update");
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("report", ["fetch_point_position_media"])
  },
  mounted() {
    //查询媒体
    this.fetch_point_position_media({parentId:this.$route.query.parentId}).then(res => {
      this.options = res.data;
    });

    this.$emit("update");
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
</style>




