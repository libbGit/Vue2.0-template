<template>
    <div>
        <div class="hy-card">
            <div class="hy-card__content" v-loading="isLoading">
                <el-table size="mini" 
                    :data="mediaPosList" 
                    border 
                    stripe 
                    style="width: 100%" 
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="40">
                    </el-table-column>
                    <el-table-column label="点位ID" width="60" prop="id">
                    </el-table-column>
                    <el-table-column label="HY编码" width="200" prop="hy_code">
                    </el-table-column>
                    <el-table-column prop="media_name" width="100" label="媒体名称">
                    </el-table-column>
                    <el-table-column prop="name" label="点位名称">
                    </el-table-column>
                    <el-table-column prop="pos_description" width="250" label="描述">
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :open-delay='300' :content="scope.row.pos_description" placement="top">
                              <span class="ellipsis">{{scope.row.pos_description}}</span>
                            </el-tooltip> -->
                            <span class="ellipsis" :title='scope.row.pos_description'>{{scope.row.pos_description || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dealID" width="80" label="DealID">
                        <template slot-scope="scope">
                            <!-- <span v-if="scope.row['dealID'] === null">--</span> -->
                            <span>{{scope.row.dealID || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="LineID" width="80" label="LineID">
                        <template slot-scope="scope">
                            <!-- <span v-if="scope.row['LineID'] === null">--</span> -->
                            <span>{{scope.row.LineID || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" align="right" width="100" label="单价（CPM）">
                        <template slot-scope="scope">
                            ¥{{$formatPrice(scope.row['price'])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="price_conf" align="right" width="100" label="出价（元）">
                        <template slot-scope="scope">
                            ¥{{$formatPrice(scope.row['price_conf'])}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pos_spec" width="250" label="点位规格">
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :open-delay='300' :content="scope.row.pos_spec" placement="top">
                              <span class="ellipsis">{{scope.row.pos_spec}}</span>
                            </el-tooltip> -->
                            <span class="ellipsis" :title='scope.row.pos_spec'>{{scope.row.pos_spec}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" width="80" label="状态" align="center">
                        <template slot-scope="scope">
                            <el-tag :type="formatstatus(scope.row['status']).type" size="mini">
                                {{formatstatus(scope.row['status']).text}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width="180" label="操作" header-align="center" align="right">
                        <template slot-scope="scope">
                            <router-link :to="'/media/edit/' + scope.row.id">
                                <el-button size="mini" icon="el-icon-edit" title="编辑">
                                </el-button>
                            </router-link>
                            <el-button size="mini" 
                                v-if="scope.row['status'] === 1" 
                                icon="el-icon-remove-outline" 
                                title="停用" 
                                @click="OpeneditStatus(scope.row)">
                            </el-button>
                            <el-button size="mini" 
                                v-if="scope.row['status'] === 0" 
                                icon="el-icon-caret-right" 
                                title="启用" 
                                @click="OpeneditStatus(scope.row)">
                            </el-button>
                            <el-button 
                                size="mini" 
                                v-if="scope.row['status'] === 1" 
                                icon="el-icon-delete" 
                                title="删除" 
                                disabled>
                            </el-button>
                            <el-button 
                                size="mini" 
                                v-if="scope.row['status'] === 0" 
                                icon="el-icon-delete" 
                                title="删除" 
                                @click="OpenDelete(scope.row)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="clearfix" style="background:#fff;">
                    <el-pagination 
                        class="pull-right" 
                        layout="total, prev, pager, next" 
                        :total="total" 
                        :current-page="currentPage" 
                        :page-size="pageSize" 
                        @current-change="handle_page_change">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
export default {
  name: "MediaList",
  data() {
    return {
      // 报告列表
      mediaPosList: [],
      isLoading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selection: []
    };
  },
  props: {
    mediaName: {
      type: [String]
    },
    keyword: {
      type: [String]
    }
  },
  watch: {
    mediaName(n, o) {
      this.currentPage = 1;
      this.fetch_mediaPos_list();
    },
    keyword(n, o) {
      this.currentPage = 1;
      this.fetch_mediaPos_list();
    }
  },
  created() {
    this.fetch_mediaPos_list();
  },
  methods: {
    ...mapActions([]),
    // 处理选择多选框操作
    handleSelectionChange(val) {
      this.selection = val;
      this.$emit("selectedData", val);
    },
    fetch_mediaPos_list() {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        fetch.post("/mediaPos/getList", {
          page: this.currentPage,
          keyword: this.keyword,
          media_name: this.mediaName,
          limit: this.pageSize
        }).then(res => {
          this.isLoading = false;
          if (res.ret === 0 && res.data) {
            this.mediaPosList = res.data;
            this.total = parseInt(res.total);
          }
          resolve(res);
        }).catch(err => {
          this.isLoading = false;
          reject(err);
        });
      });
    },

    // 格式化列表的状态(status)信息
    formatstatus(status) {
      let result = {};
      switch (status) {
        case 0:
          result = {
            type: "danger",
            text: "停用"
          };
          break;

        case 1:
          result = {
            type: "success",
            text: "开启"
          };
          break;
      }
      return result;
    },
    OpeneditStatus(row) {
      let _id = parseInt(row.id);
      let _status;
      let str;

      if (row.status === 1) {
        _status = 0;
        str = "是否停用该点位?";
      } else {
        _status = 1;
        str = "是否启用该点位?";
      }

      this.editStatus(_id, _status);
    },

    editStatus(id, status) {
      return new Promise((resolve, reject) => {
        fetch.post("/mediaPos/editStatus", {
          id: id,
          status: status
        }).then(res => {
          if (res.ret === 0) {
            if(status==0){
              this.$message.success('点位停用成功');
            }else{
              this.$message.success('点位启用成功');
            }
            this.fetch_mediaPos_list();
          }else{
            this.$message.error(res.msg);
          }
          resolve(res);
        }).catch(err => {
          if(status==0){
              this.$message.error('点位停用失败');
            }else{
              this.$message.error('点位启用失败');
            }
          reject(err);
        });
      });
    },
    OpenDelete(row) {
      let _id = parseInt(row.id);

      this.$confirm("确定删除此点位?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deletePos(_id);
      }).catch(() => {});
    },
    deletePos(id) {
      return new Promise((resolve, reject) => {
        fetch.post("/mediaPos/del", {
          id: id
        }).then(res => {
          if (res.ret === 0) {
            this.fetch_mediaPos_list();
            this.$message.success('点位删除成功');
          }else{
            this.$message.error(res.msg);
          }
          resolve(res);
        }).catch(err => {
          this.$message.error("点位删除失败");
          reject(err);
        });
      });
    },
    // 处理分页操作
    handle_page_change(currentPage) {
      this.currentPage = currentPage;
      this.fetch_mediaPos_list();
    }
  },
  components: {}
};
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 250px;
  min-width: 5px;
}
</style>
