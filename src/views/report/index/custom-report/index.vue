<template>
    <div class="hy-card">
        <div class="hy-card__header clearfix">
            <!-- 新建报告 -->
            <router-link :to='{path}'>
                <el-button type="primary" size="mini">新建报告</el-button>
            </router-link>
            <div class="pull-right" :inline="true">
                <el-form :inline="true" class="demo-form-inline" :model="form" size="mini">
                    <el-form-item label="生成时间">
                        <el-date-picker v-model="form.time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="searchReport">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="报告类型">
                        <el-select v-model="form.report_type" placeholder="请选择" @change="searchReport">
                            <el-option :key="0" label="全部" :value="0">
                            </el-option>
                            <el-option v-for="item in reportname " :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="请输入内容" v-model="form.name">
                            <el-button slot="append" icon="el-icon-search" @click="searchReport"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>

            </div>
        </div>

        <!-- 报告列表 -->
        <report-list ref="reportList" :queryOptions="getQueryOptions"/>
    </div>
</template>
<script>
import fetch from '@/services/fetch'

import ReportList from "./report-list";
export default {
  name: "custom-report",
  data() {
    return {
      form: {
        time: "",
        name: "",
        report_type: ""
      },
      reportname: [
        { name: "广告主报告", id: 1 },
        { name: "品牌报告", id: 2 },
        { name: "产品线报告", id: 3 },
        { name: "项目报告", id: 4 },
        { name: "活动报告", id: 5 },
        { name: "推广计划报告", id: 6 },
        { name: "创意组报告", id: 7 },
        { name: "创意报告", id: 8 },
        { name: "媒体报告", id: 9 },
        { name: "点位报告", id: 10 },
        { name: "地域报告", id: 11 },
        { name: "人群报告", id: 12 },
        { name: "平台设备报告", id: 13 }
      ],
      path: "",
      create_path: ""
    };
  },

  computed: {
    getQueryOptions(){
      return {
        time: this.form.time,
        report_type: this.form.report_type,
        name:this.form.name
      }
    }
  },
  mounted() {
    this.path = this.$route.path.substring(0,this.$route.path.lastIndexOf("/")) + "/create";
  },
  methods: {
    searchReport() {
      return new Promise((resolve, reject) => {
        fetch
          .post("/report/getList", {
            name: this.form.name,
            time: this.form.time,
            report_type: this.form.report_type,
            page: 1,
            limit: this.$refs.reportList.pageSize
          })
          .then(res => {
            if (res.ret == 0 && res.data) {
              this.$refs.reportList.reportList = res.data;
              this.$refs.reportList.total = parseInt(res.total);
              this.$refs.reportList.format_text();
              this.$message({
                message: "查询到" + this.$refs.reportList.total + "条结果",
                type: "success"
              });
            } else {
              this.$message({
                message: "查询不到信息！"
              });
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  },
  components: {
    ReportList
  }
};
</script>

