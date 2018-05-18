<template>
<div>
  <div class="hy-card">
    <div class="hy-card__header clearfix">
      <span class="title">广告主列表</span>
    </div>
    <div class="hy-card__content" v-loading="isLoading">
      <el-table size="mini"
        :data="advertiserList"
        border
        max-height="510"
        style="width: 100%">
        <el-table-column
          prop="id"
          align="center"
          label="广告主ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告主名称"
         >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="redirect_project(scope.row)">
              {{scope.row['name']}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          width="200"
          align="center"
          label="录入时间">
        </el-table-column>
        <el-table-column
          prop="status"
          width="200"
          align="center"
          label="审批状态">
        <template slot-scope="scope">
          <el-tag :type="formatAuditStatus(scope.row['status']).type">
            {{formatAuditStatus(scope.row['status']).text}}
          </el-tag>
        </template>
        </el-table-column>
        <el-table-column
          width="220"
          align="right"
          label="操作">
        <template slot-scope="scope">
          <el-button @click="openDetailDialog(scope.row)"  size="mini" icon="el-icon-document" title="详情"></el-button>
          <router-link :to="'/advertiser/edit/' + scope.row.id+'?status='+scope.row.status"><el-button size="mini" icon="el-icon-edit" title="编辑"></el-button></router-link>
          <el-button @click="openBrandDialog(scope.row)"    size="mini" icon="el-icon-plus" title="品牌/产品线添加"></el-button>
          <router-link :to="'/advertiser/audit/' + scope.row.id"><el-button size="mini"  title="送至PBS审核" icon="iconfont delivery-o"></el-button></router-link>
        </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap clearfix">
        <el-pagination class="pull-right"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          @size-change="handle_size_change"
          @current-change="handle_page_change"
          >
        </el-pagination>
      </div>
    </div>
  </div>

  <!-- 客户详情 -->
  <el-dialog :visible.sync="dialogDetail" width="710px" :lock-scroll="true" title="广告主详情">
    <dialog-detail :data="advertiser"/>
    <span slot="footer" class="dialog-footer" >
    </span>
  </el-dialog>

  <!-- 添加品牌/产品线 -->
  <el-dialog :visible.sync="dialogBrand" :lock-scroll="false" title="品牌/产品线">
    <dialog-brand v-loading="dialogBrandLoading" :ader-id="aderId" ref="dialogbrand"/>
    <span slot="footer" class="dialog-footer" >
       <el-button size="mini" @click="addbrand"  type="primary">添加品牌/产品线</el-button>
    </span>
  </el-dialog>

</div>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions, mapMutations } from 'vuex'
  import dialogDetail from './dialog_detail'
  import dialogBrand from './dialog_brand'

  export default {
    name:'AderList',
    props: {
      keyword: {
        type: [String],
        required: true,
      },
    },
    data() {
      return {
        // 广告主列表
        advertiserList: [],
        isLoading: false,
        currentPage: 1,
        pageSize: 5,
        total: 0,
        // 媒体详情
        advertiser: {},

        dialogDetail: false,

        dialogBrand: false,
        dialogBrandLoading: false,

        dialogAudit: false,
        // 正在编辑的id
        aderId:'',
      }
    },
    watch:{
      keyword(){
        this.fetch_advertiser_list()
      }
    },
    created() {
      this.fetch_advertiser_list()
      this.fetch_industry_list();
    },
    methods: {
      ...mapMutations("report", [
        "UPDATE_ADVERTISER_ID",
      ]),
      ...mapActions('advertiser', [
        'fetch_brand_form',
        'fetch_industry_list',
      ]),
      ...mapActions('ad', [
        'update_ader_id',
        'update_ader_name',
        'update_ader_opera_status'
      ]),
      addbrand(){
        this.$refs.dialogbrand.addBrand();
      },
      fetch_advertiser_list() {
        this.isLoading = true;
        return new Promise((resolve, reject) => {
          fetch.post('/advertiser/getList', {
            keyword:this.keyword,
            page: this.currentPage,
            limit: this.pageSize,
          }).then( res => {
              this.isLoading = false;
              if (res.ret == 0 && res.data) {
                this.advertiserList = res.data;
                this.total = parseInt(res.total);
              }
              resolve(res);
            })
            .catch( err => {
              this.isLoading = false;
              reject(err);
            })
        })
      },
      // 处理分页操作
      handle_page_change(currentPage){
        this.currentPage = currentPage;
        this.fetch_advertiser_list();
      },
      handle_size_change(size){
        this.pageSize = size;
        this.fetch_advertiser_list();
      },
      // 打开 广告主详情 弹窗
      openDetailDialog (row) {
        fetch.post('/advertiser/get', {
          id: row.id
        }).then( res => {
            if( res.ret == 0 && res.data) {
              this.advertiser = res.data;
              this.dialogDetail = true;
            }
            else {
              this.$message.error('获取广告主信息失败' + res.msg);
            }
          }).catch( err => {
            console.error(err)
          });
      },
      // 打开 品牌/产品线 弹窗
      openBrandDialog (row) {
        this.aderId = row.id;
        this.dialogBrandLoading = true;
        this.dialogBrand = true;
        this.fetch_brand_form(row.id)
          .then( () => {
            this.dialogBrandLoading = false;
          })
          .catch( err=> {
            this.dialogBrandLoading = false;
            this.dialogBrand = false;
            alert(err.message)
          })
      },
      // 格式化列表的状态(status)信息
      formatAuditStatus (status) {
        var result = {};
        switch( status ) {
          case 0:
          result = {
            type: 'warning',
            text: '待审核'
          }
          break;
          case 1:
          result = {
            type: '',
            text: '审核中'
          }
          break;
          case 2:
          result = {
            type: 'success',
            text: '审核通过'
          }
          break;
          case 3:
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
      // 跳转到客户管理界面
      redirect_project(row){
        this.update_ader_id(row.id);
        this.update_ader_name(row.name);
        this.update_ader_opera_status(row.operation_status);

        this.UPDATE_ADVERTISER_ID(row.id);
        this.$router.push({
          path: '/ad/project'
        })
      }
    },
    components: {
      dialogDetail,
      dialogBrand
    }
  }
</script>


