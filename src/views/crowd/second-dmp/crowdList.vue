<template>
    <div>
        <!-- head start-->
        <div class="hy-card__header clearfix">
            <div class="pull-left">
                <router-link to="add">
                    <el-button type="primary"
                        size="mini">
                        新建人群包
                    </el-button>
                </router-link>
            </div>

            <div class="pull-right">
                <el-select v-model="isArchive"
                    size="mini"
                    style="width:100px;"
                    @change="initCorwdList">
                    <el-option value="0"
                        label="未归档"></el-option>
                    <el-option value="1"
                        label="已归档"></el-option>
                </el-select>
                <el-input placeholder="请输入名称"
                    v-model="keywords"
                    size="mini"
                    style="width:200px;">
                    <el-button slot="append"
                        icon="el-icon-search"
                        @click="initCorwdList">
                    </el-button>
                </el-input>
            </div>
        </div>
        <div class="hy-card__content" v-loading="isLoading">
            <el-table :data="dataTable"
                size="mini"
                border
                style="width: 100%">
                <el-table-column prop="name"
                    label="人群包名称"
                    align="center"
                    header-align="center">
                </el-table-column>
                <el-table-column label="类型"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                        秒针
                    </template>
                </el-table-column>
                <el-table-column prop="target"
                    label="内容"
                    width="400">
                    <template slot-scope="scope">
                        <div v-html="parseTarget(scope.row.target)"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="remark"
                    label="备注">
                </el-table-column>
                <el-table-column label="操作"
                    align="center"
                    header-align="center"
                    width="350">
                    <template slot-scope="scope">
                        <el-button @click="toCrowdComp('edit',scope.row.id)"
                            v-if="verdictOpeEdit(scope.row.status, scope.row.used)"
                            size="mini"
                            icon="el-icon-edit"
                            title="编辑">
                        </el-button>
                        <el-button @click="detailCrowd(scope.row.id)"
                            size="mini"
                            icon="el-icon-document"
                            title="查看">
                        </el-button>
                        <el-button @click="documentCrowd(scope.row.id)"
                            size="mini"
                            title="归档">
                            <i class="iconfont archive-o"></i>
                        </el-button>
                        <el-button @click="deleCrowd(scope.row.id)"
                            v-if="verdictOpeDelete(scope.row.status, scope.row.used)"
                            size="mini"
                            icon="el-icon-delete"
                            title="删除">
                        </el-button>
                        <!-- <el-button 
                            @click="makeCrowd(scope.row.id)" 
                            v-if="verdictOpeOth(scope.row.used)" 
                            size="mini" 
                            icon="el-icon-refresh" 
                            title="生成">
                        </el-button> -->
                        <el-button @click="toCrowdComp('copy',scope.row.id)"
                            index=""
                            size="mini"
                            title="复制">
                            <i class="iconfont copy-o"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-wrap clearfix">
            <el-pagination class="pull-right"
                layout="total, sizes, prev, pager, next"
                :current-page="currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20]"
                :page-size="10"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "CrowdList",
  computed: {
    ...mapState("ad", ["ader_id"])
  },
  components: {},
  created() {
    this.initCorwdList();
  },
  data() {
    return {
      isLoading: false,
      dataTable: [],
      keywords: "",
      isArchive: "0",  //是否已归档
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      //1 生成中   3生成失败  7生成成功
      showStName: [
        "",
        "草稿",
        "生成中",
        "生成失败",
        "生成中",
        "生成中",
        "生成中",
        "生成成功",
        "生成失败"
      ]
    };
  },
  methods: {
    parseTarget(target) {
      let contents = '';
      let num = 1;
      if (target) {
        contents += "token:" + target.token + "<br/>"
        for (let item of target.tagids) {
          contents += "标签id:" + item + (num % 3 == 0 ? "<br/>" : ', ');
          num++;
        }
      }
      return contents;
    },
    initCorwdList() {
      let pageData = {
        advertiser_id: this.ader_id,
        keywords: this.keywords,
        is_archive: this.isArchive,
        page: this.page,
        limit: this.limit,
        group_type: '3'
      };
      this.isLoading = true;
      fetch.post("/group/list", pageData).then(res => {
        this.isLoading = false;
        if (res.ret === 0 && res.data) {
          this.dataTable = res.data;
          this.total = Number(res.total) || 0;
        } else {
          this.dataTable = [];
        }
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.dataTable = [];
      this.initCorwdList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.dataTable = [];
      this.initCorwdList();
    },
    verdictOpeEdit(status, used) {
      //未挂接计划可以编辑。其他情况不能编辑
      if (used == 0) {
        return true;
      } else {
        return false;
      }
    },

    verdictOpeDelete(status, used) {
      //已挂接的不能删除。未挂接可以删除
      if (used == 1) {
        return false;
      } else {
        return true;
      }
    },

    // verdictOpeOth(k) {
    //   var ary = ["1", "3", "8"];
    //   if (ary.includes(k)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    toCrowdComp(type, id) {
      this.$router.push({
        name: "CrowdSecondEdit",
        params: { type: type, id: id }
      });
    },
    detailCrowd(id) {
      this.$router.push({
        name: "CrowdSecondDetail",
        params: { id: id }
      });
    },
    //归档操作
    documentCrowd(id) {
      this.$confirm("确定要归档吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            fetch.post("/group/archive", { id: id }).then(res => {
              if (res.ret === 0 && res.data) {
                this.$message({
                  message: "归档成功!",
                  type: "success",
                });
                // this.page = 1;
                this.initCorwdList();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          }
        }
      });
    },

    deleCrowd(id) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            fetch.post("/group/remove", { id: id }).then(res => {
              if (res.ret === 0 && res.data) {
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                // this.page = 1;
                this.initCorwdList();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          }
        }
      });
    },
    // makeCrowd(id) {
    //   fetch.post("/group/make", { id: id }).then(res => {
    //     if (res.ret === 0 && res.data) {
    //       this.$message({
    //         message: "生成操作成功!",
    //         type: "success"
    //       });
    //       this.initCorwdList();
    //     } else {
    //       this.$message({
    //         message: res.msg,
    //         type: "error",
    //         showClose: true
    //       });
    //     }
    //   });
    // }
  }
};
</script>
<style scoped>
/* @import "@views/crowd/crowd.css"; */
</style>
