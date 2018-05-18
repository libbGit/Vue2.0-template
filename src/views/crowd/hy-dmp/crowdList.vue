<template>
    <div>
        <!-- head start-->
        <div class="hy-card__header clearfix">
            <div class="pull-left">
                <router-link to="add">
                    <el-button type="primary" size="mini">
                        新建人群包
                    </el-button>
                </router-link>
            </div>

            <div class="pull-right">
                <!-- <el-select v-model="isArchive" size="mini" style="width:100px;" @change="initCorwdList">
                    <el-option value="0" label="未归档"></el-option>
                    <el-option value="1" label="已归档"></el-option>
                </el-select> -->
                <el-input placeholder="请输入名称" v-model="keywords" size="mini" style="width:200px;">
                    <el-button slot="append" icon="el-icon-search" @click="initCorwdList"></el-button>
                </el-input>
            </div>
        </div>
        <div class="hy-card__content" v-loading="isLoading">
            <el-table :data="dataTable" size="mini" border style="width: 100%">
                <el-table-column prop="name" label="人群包名称" align="center" header-align="center">
                </el-table-column>
                <el-table-column label="类型" width="300">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type == "1" ? "属性定向" : scope.row.type == "2"?"ID定向":"重定向" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="validaty" label="有效期(天)" width="200">
                </el-table-column>
                <el-table-column prop="count" label="覆盖用户数量" width="250">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="200">
                    <template slot-scope="scope">
                        <el-tag :type="format_status(scope.row.status).type">
                          {{format_status(scope.row.status).text}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" header-align="center" width="350">
                    <template slot-scope="scope">
                        <el-button 
                            v-if="verdictOpeEdit(scope.row.status, scope.row.used)" 
                            @click="toCrowdComp('edit',scope.row.id)" 
                            size="mini" 
                            icon="el-icon-edit" 
                            title="编辑">
                        </el-button>
                        <!-- <el-button 
                            @click="detailCrowd(scope.row.id)" 
                            size="mini" 
                            icon="el-icon-document" 
                            title="查看">
                        </el-button> -->
                        <!-- <el-button 
                            v-if="verdictOpeDocument(scope.row.status, scope.row.used)" 
                            @click="documentCrowd(scope.row.id)" 
                            size="mini" 
                            title="归档">
                            <i class="iconfont archive-o"></i>
                        </el-button> -->
                        <el-button 
                            v-if="verdictOpeGenerate(scope.row.status, scope.row.used)" 
                            @click="makeCrowd(scope.row.id)" 
                            size="mini" 
                            icon="el-icon-refresh" 
                            title="生成">
                        </el-button>
                        <el-button 
                            v-if="verdictOpeDelete(scope.row.status, scope.row.used)" 
                            @click="deleCrowd(scope.row.id)" 
                            size="mini" 
                            icon="el-icon-delete" 
                            title="删除">
                        </el-button>
                        <el-button 
                            @click="toCrowdComp('copy',scope.row.id)" 
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
            <el-pagination 
                class="pull-right" 
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
      isArchive:"0",  //0 未归档  1已归档
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
      ],
      
    };
  },
  methods: {
    initCorwdList() {
      let pageData = {
        advertiser_id: this.ader_id,
        keywords: this.keywords,
        is_archive: this.isArchive,
        page: this.page,
        limit: this.limit,
        group_type:'1'
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

    verdictOpeEdit(status, used) {  //status表示生成失败，成功等，  used表示是否挂接 0 未 1 已
      //草稿、生成成功的未挂接计划、生成失败可以编辑
      if (status == 1 || (status==7&&used==0) || status==3 || status==8) {
        return true;
      } else {
        return false;
      }
    },

    verdictOpeDocument(status, used){
     // 生成中的不可归档，其他情况都可以归档
     if(status==2 || status==4 || status==5 || status==6){
       return false;
     }else{
       return true;
     }
    },

    verdictOpeGenerate(status, used){
      //生成失败可以生成，重新编辑后可以生成
      if(status==1 || status==3 || status==8){
        return true;
      }else{
        return false;
      }
    },

    verdictOpeDelete(status, used) {
      //生成中的、生成成功的已挂接的不能删除。
      if (status==2 || status==4 || status==5 || status==6 || (status==7&&used==1)) {
        return false;
      } else {
        return true;
      }
    },
    
    toCrowdComp(type, id) {
      this.$router.push({
        name: "CrowdHyEdit",
        params: { type: type, id: id }
      });
    },

    detailCrowd(id){
      this.$router.push({
        name: "CrowdHyDetail",
        params: { id: id }
      });
    },
    //归档操作
    documentCrowd(id){
      this.$confirm("确定要归档吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: action => {
          if(action=="confirm"){
            fetch.post("/group/archive", { id: id }).then(res => {
              if (res.ret === 0 && res.data) {
                this.$message({
                  message: "归档成功!",
                  type: "success",
                });
                // this.page = 1;
                this.initCorwdList();
              }else{
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
          if(action=="confirm"){
            fetch.post("/group/remove", { id: id }).then(res => {
              if (res.ret === 0 && res.data) {
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                // this.page = 1;
                this.initCorwdList();
              }else{
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
    makeCrowd(id) {
      fetch.post("/group/make", { id: id }).then(res => {
        if (res.ret === 0 && res.data) {
           this.$message({
             message: "生成操作成功!",
             type: "success"
           });
          this.initCorwdList();
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },

    // 格式化状态
    //showStName: [ "", "草稿", "生成中", "生成失败", "生成中", "生成中", "生成中", "生成成功", "生成失败"],
      format_status( status ) {
        if( status == '1') {
          return {
            type: 'warning',
            text: '草稿'
          }
        }
        else if( status == '2' || status == '4' || status == '5' || status == '6') {
          return {
            type: '',
            text: '生成中'
          }
        }
        else if( status == '3' || status == '8') {
          return {
            type: 'danger',
            text: '生成失败'
          }
        }
        else if( status == '7') {
          return {
            type: 'success',
            text: '生成成功'
          }
        }
      },
  }
};
</script>
<style scoped>
/* @import "@views/crowd/crowd.css"; */
</style>
