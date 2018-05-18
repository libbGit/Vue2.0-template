<template>
    <div class="hy-card__content"
        v-loading="isLoading">
        <el-table size="mini"
            border
            :data="reportList"
            style="width: 100%">
            <el-table-column label="报告名称"
                prop="name"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="time_ranges"
                label="时间范围"
                width="180">
            </el-table-column>
            <el-table-column prop="create_time"
                width="120"
                label="生成时间">
            </el-table-column>
            <el-table-column prop="email"
                label="发送邮箱">
                <template slot-scope="scope">
                    <span v-if="scope.row['email'] === null">--</span>
                    <span v-else>{{scope.row.email}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="report_type"
                width="100"
                label="报告类型">
            </el-table-column>
            <el-table-column prop="up_freq"
                width="80"
                label="更新频率">
            </el-table-column>
            <el-table-column prop="status"
                width="80"
                label="状态"
                align="center">
                <template slot-scope="scope">
                    <el-tag :type="formatstatus(scope.row['status']).type"
                        size="mini">
                        {{formatstatus(scope.row['status']).text}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="size"
                width="80"
                label="文件大小">
                <template slot-scope="scope">
                    <span v-if="scope.row['size'] === null">--</span>
                    <span v-else>{{scope.row.size}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作"
                width="170"
                align="right">
                <template slot-scope="scope">
                    <router-link :to="path + scope.row.id">
                        <el-button size="mini"
                            title="复制">
                            <i class="iconfont copy-o"></i>
                        </el-button>
                    </router-link>
                    <el-popover ref="popover1{{$index}}"
                        placement="left"
                        trigger="click"
                        v-model="scope.row.visible1">
                        <el-table :data="down_reprort_list"
                            style="width: 100%"
                            max-height="400"
                            :show-header=false>
                            <el-table-column width="150"
                                align="center">
                                <template slot-scope="scope">
                                    <a :href="downPath+scope.row.path">
                                        <el-button type="text"
                                            size="mini">{{scope.row.time}}</el-button>
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-popover>
                    <el-button v-if="scope.row['down'].length > 1"
                        size="mini"
                        icon="el-icon-download"
                        title="下载"
                        @click="format_report_path(scope.row.id)"
                        v-popover:popover1{{$index}}></el-button>
                    <a v-if="scope.row['down'].length === 1"
                        :href="downPath+scope.row['down'][0].path"
                        target="_blank">
                        <el-button size="mini"
                            icon="el-icon-download"
                            title="下载"></el-button>
                    </a>
                    <el-button v-if="scope.row['down'].length < 1"
                        size="mini"
                        icon="el-icon-download"
                        title="下载"
                        disabled></el-button>
                    <a href="javascript:void(0)">
                        <el-button @click="openDelete(scope.row)"
                            size="mini"
                            icon="el-icon-delete"
                            title="删除"></el-button>
                    </a>
                </template>
            </el-table-column>
        </el-table>
        <div class="clearfix"
            style="background:#fff;">
            <el-pagination class="pull-right"
                layout="total, prev, pager, next"
                :total="total"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="handle_page_change">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import fetch from '@/services/fetch'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ReportList',
  data() {
    return {
      // 报告列表
      reportList: [],
      down_reprort_list: [],
      path: '',
      isLoading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      downPath: "../",
    }
  },
  props: {
    queryOptions: {
      type: Object,
      required: true
    }
  },
  created() {
    this.fetch_report_list();
    this.path = this.$route.path.substring(0, this.$route.path.lastIndexOf("/")) + '/edit/';
  },
  methods: {
    ...mapActions([
    ]),
    openDelete(row) {
      this.$confirm('确定删除该报告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ReportDelete(row);
      }).catch(() => {

      });
    },
    fetch_report_list() {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        fetch.post('/report/getList', {
          page: this.currentPage,
          limit: this.pageSize,
          time: this.queryOptions.time,
          report_type: this.queryOptions.report_type,
          name: this.queryOptions.name
        }).then(res => {
          this.isLoading = false;
          if (res.ret === 0 && res.data) {
            this.reportList = res.data;
            this.total = parseInt(res.total);
            this.format_text();
          }
          resolve(res);
        })
          .catch(err => {
            this.isLoading = false;
            reject(err);
          })
      })

    },
    // 格式化下载地址
    format_report_path(id) {
      let _reportList = this.reportList.filter(function (data) { return data.id === id; });
      this.down_reprort_list = _reportList[0].down;

    },
    // 格式化报告类型、更新频率信息
    format_text() {
      for (let i in this.reportList) {
        this.reportList[i].time_ranges = this.reportList[i].start_time + ' 至 ' + this.reportList[i].end_time;
        switch (this.reportList[i].up_freq) {
          case 1:
            this.reportList[i].up_freq = "一次生成";
            break;
          case 2:
            this.reportList[i].up_freq = "每天";
            break;
        }

        switch (this.reportList[i].report_type) {
          case 1:
            this.reportList[i].report_type = this.$parent.reportname[0].name;
            break;
          case 2:
            this.reportList[i].report_type = this.$parent.reportname[1].name;
            break;
          case 3:
            this.reportList[i].report_type = this.$parent.reportname[2].name;
            break;
          case 4:
            this.reportList[i].report_type = this.$parent.reportname[3].name;
            break;
          case 5:
            this.reportList[i].report_type = this.$parent.reportname[4].name;
            break;
          case 6:
            this.reportList[i].report_type = this.$parent.reportname[5].name;
            break;
          case 7:
            this.reportList[i].report_type = this.$parent.reportname[6].name;
            break;
          case 8:
            this.reportList[i].report_type = this.$parent.reportname[7].name;
            break;
          case 9:
            this.reportList[i].report_type = this.$parent.reportname[8].name;
            break;
          case 10:
            this.reportList[i].report_type = this.$parent.reportname[9].name;
            break;
          case 11:
            this.reportList[i].report_type = this.$parent.reportname[10].name;
            break;
          case 12:
            this.reportList[i].report_type = this.$parent.reportname[11].name;
            break;
          case 13:
            this.reportList[i].report_type = this.$parent.reportname[12].name;
            break;
        }
      }
    },
    // 格式化列表的状态(status)信息
    formatstatus(status) {
      var result = {};
      switch (status) {
        case 1:
          result = {
            type: 'warning',
            text: '生成中'
          }
          break;
        case 2:
          result = {
            type: 'success',
            text: '已生成'
          }
          break;
      }
      return result;
    },
    ReportDelete(row) {
      var _reportId = row.id;
      return new Promise((resolve, reject) => {
        fetch.post('/report/del', {
          id: _reportId
        }).then(res => {

          if (res.ret == 0) {
            row.visible = false;
            this.fetch_report_list();
            this.$message({
              message: '报告删除成功',
              type: 'success'
            });
          }
          resolve(res);
        })
          .catch(err => {
            reject(err);
          })
      })


    },
    // 处理分页操作
    handle_page_change(currentPage) {
      this.currentPage = currentPage;
      this.fetch_report_list();
    },
  },
  components: {}
}
</script>

