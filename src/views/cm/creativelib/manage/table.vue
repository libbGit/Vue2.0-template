<template>
    <!-- table start-->

      <el-table size="mini"
        :data="data"
        border
        style="width: 100%"
        @selection-change="onSelectionChange">
          <el-table-column
            prop="id"
            width="60"
            label="创意ID">
          </el-table-column>

          <!-- <el-table-column
            prop="is_connect"
            label="挂接状态"
            align='center'
            width="100">
            <template slot-scope="scope">
              <el-tag :type="formatConnectState(scope.row['is_connect']).type">
              {{formatConnectState(scope.row['is_connect']).text}}
              </el-tag>
            </template>
          </el-table-column> -->

          <el-table-column
            prop="brand_name"
            label="品牌"
            width="100">
          </el-table-column>

          <el-table-column
            prop="product_line"
            label="产品线"
            width="100">
            <template slot-scope="scope">
              {{scope.row['product_line']?scope.row['product_line']:'--'}}
            </template>
          </el-table-column>

          <el-table-column
            prop="project_name"
            label="项目名称">
          </el-table-column>

          <el-table-column
            prop="activity_name"
            label="活动名称"
            width="100">
            <template slot-scope="scope">
              {{scope.row['activity_name']?scope.row['activity_name']:'--'}}
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="创意名称">
            <template slot-scope="scope">
              {{scope.row['name']}}

            </template>
          </el-table-column>

          <el-table-column
            prop="ad_type"
            label="广告形式"
            width="100">
          </el-table-column>

          <el-table-column
            prop="media_name"
            label="媒体"
            width="100">
          </el-table-column>

          <el-table-column
            prop="pos_name"
            label="点位">
          </el-table-column>


          <el-table-column
            prop="create_time"
            label="创建时间"
            width="100">
          </el-table-column>

          <!-- 只有未归档的才显示操作一栏 -->
          <el-table-column label="操作"
          width="280"
          align="right">

            <template slot-scope="scope">
              <router-link :to="'/cm/creativelib/detail/'+scope.row['id']">
                <el-button   size="mini"  icon="el-icon-document" title="详情"></el-button>
              </router-link>
              <router-link :to="'/cm/creativelib/edit/'+scope.row['id']" v-if="scope.row['status']==1">
                <el-button size="mini" icon="el-icon-edit" title="编辑"></el-button>
              </router-link>

              <el-button  size="mini" title="复制"  @click="onCopy(scope.row.id)" v-if="scope.row['status']==1">
                <i class="iconfont copy-o"></i>
              </el-button>

              <el-button size="mini" title="归档" @click="onFile(scope.row)" v-if="scope.row['status']==1">
                <i class="iconfont archive-o"></i>
              </el-button>
              <el-button @click="onDelete(scope.row)"
                         size="mini" icon="el-icon-delete" title="删除" v-if="scope.row['status']==1">
              </el-button>
            </template>
          </el-table-column>

      </el-table>

    <!-- table end-->
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";

export default {
  name: "CreativelibTable",
  props: {
    placefile:{
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    };
  },
  watch: {

  },
  computed: {

  },
  created() {

  },
  methods: {
    confirmDialog(name,str){
      return new Promise((resolve, reject)=>{
        this.$confirm('确定将已选'+'【'+name+'】'+str+'？', str, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resolve();
        }).catch(()=>{
          reject();
        });
      });
    },
    onCopy(id){
      this.$router.push({
        name: "CreativeEdit",
        params:{id,isCopy:true}
      });
    },
    onFile(obj){
      this.confirmDialog(obj.name,'归档').then(()=>{
        this.fetch_file(obj.id);
      }).catch(()=>{});
    },
    fetch_file(id){
      fetch.post("/creative/archive",{id,status:2})
        .then(res => {
          if (res.ret == 0) {
            //如果当前是未归档
            if (this.placefile=='1') {
              this.$emit('refresh-list')
            }else{
              let obj = _.find(this.data,{id});
              obj.status = '2';
            }

            this.$message({
              type: 'success',
              message: '归档成功!'
            });
          } else {
            this.$message.error(res.msg);
            console.error(res.msg||'归档创意失败 返回值为空');
          }
        })
        .catch(err => {
          this.$message.error('归档失败，请稍后重试!');
          console.error(err||'归档创意失败 err');
        });
    },
    onDelete(obj){
      this.confirmDialog(obj.name,'删除').then(()=>{
        this.fetch_delete(obj.id);
      }).catch(()=>{});
    },
    fetch_delete(id){
      fetch.post("/creative/delete",{id })
        .then(res => {
          if (res.ret == 0) {
            this.$emit('refresh-list')
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message.error('删除失败，请稍后重试!');
            console.error(res.msg||'删除创意失败 返回值为空');
          }
        })
        .catch(err => {
          this.$message.error('删除失败，请稍后重试!');
          console.error(err||'删除创意失败 err');
        });
    },
    formatState(status){
      var result = {};
      status = status -0;
      switch( status ) {
        case 1:
          result = {
            type: 'warning',
            text: '待审核'
          }
          break;
        case 2:
          result = {
            type: '',
            text: '审核中'
          }
          break;
        case 3:
          result = {
            type: 'success',
            text: '审核通过'
          }
          break;
        case 4:
          result = {
            type: 'danger',
            text: '审核失败'
          }
          break;
        default:
          result = {
            type: 'info',
            text: '未知'
          }
      }
      return result;
    },
    //0 未挂接 1 已挂接
    formatConnectState(status){
      var result = {};
      switch( status ) {
        case 0:
          result = {
            type: 'warning',
            text: '未挂接'
          }
          break;
        case 1:
          result = {
            type: 'success',
            text: '已挂接'
          }
          break;
        default:
          result = {
            type: 'info',
            text: '未知'
          }
      }
      return result;
    },
    onSelectionChange(val){
      this.$emit('setSelection',val);
    },


  }
};
</script>
<style scoped>


</style>
