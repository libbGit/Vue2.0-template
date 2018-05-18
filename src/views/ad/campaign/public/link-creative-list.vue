<template>
<el-dialog append-to-body
  :visible="visible"
  width="90%"
  @close="handle_dialog_close"
  @open="handle_dialog_open">
  <div class="hy-card" style="margin: -30px -20px;">
    <div class="hy-card__header clearfix">
      <div class="pull-left">
        <span class="title">{{campaignName}}计划关联创意</span>
      </div>
    </div>
    <div class="hy-card__content">
      <el-table ref="table" border size="mini" max-height="510" v-loading="loading"
        :data="list_data">

          <el-table-column
            prop="creative_name"
            label="创意名称" >
            <template slot-scope="scope">
              {{scope.row.creative_name}}
              <el-button  size="mimi" icon="el-icon-document" type="text" title="详情"  @click='openDetailDialog(scope.row)'></el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            width="100"
            label="审核状态" >
            <template slot-scope="scope">
              <el-tag
                :type="format_audit_status(scope.row['status']).type">
                {{format_audit_status(scope.row['status']).text}}
              </el-tag>

            </template>
          </el-table-column>

          <el-table-column
            prop="creative_group_name"
            width="100"
            label="所属创意组" >
          </el-table-column>

          <el-table-column
            prop="ad_type"
            width="100"
            label="广告形式" >
          </el-table-column>

          <el-table-column
            prop="media_name"
            width="100"
            label="媒体" >
          </el-table-column>

          <el-table-column
            prop="pos_name"
            width="150"
            label="点位" >
          </el-table-column>


          <el-table-column
            prop="pv"
            width="100"
            label="展示数" >
          </el-table-column>

          <el-table-column
            prop="click"
            width="100"
            label="点击数" >
          </el-table-column>

          <el-table-column
            prop="cpc"
            width="100"
            label="CPC"
            align="right">
          </el-table-column>

          <el-table-column
            prop="cpm"
            width="100"
            label="CPM"
            align="right">
          </el-table-column>

          <el-table-column
            prop="leads"
            width="100"
            label="Leads" >
          </el-table-column>

          <el-table-column
            prop="cpl"
            width="100"
            label="CPL"
            align="right">
          </el-table-column>
          <el-table-column
            prop="cr"
            width="100"
            label="CR"
            align="right">
            <template slot-scope="scope">
              {{scope.row.cr}}%
            </template>
          </el-table-column>
      </el-table>
      <div class="pagination-wrap clearfix">
        <el-pagination class="pull-right"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10,15]"
          @size-change="handle_size_change"
          @current-change="handle_page_change"
          >
        </el-pagination>
      </div>

      <el-dialog :visible="true" :lock-scroll="false" title="创意详情"  width="1100px" append-to-body v-if='visibleDetailCtv' @close='visibleDetailCtv=false'>
        <form-detail :creativeParam='detailParam' >
        </form-detail>
      </el-dialog>

    </div>
  </div>
</el-dialog>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapGetters, mapActions } from "vuex"
  import FormDetail from '@/views/cm/creativelib/create/form-detail'
  export default {
    name: 'campaign-list',
    data () {
      return {
        detailParam:{url:'/creative/view','param':{}},
        visibleDetailCtv:false,
        loading: false,
        list_data: [],
        keywords: '',
        currentPage: 1,
        pageSize: 5,
        total: 0,
      }
    },
    props: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      visible: {
        type: Boolean
      },
      campaignId: {
        type: String,
        required: true
      },
      campaignName: {
        type: String,
        required: true
      }
    },
    created (){
      if( this.campaignId ) {
        this.fetch_campaign_list();
      }
    },
    watch: {
      campaignId: function(value) {
        if( this.campaignId ) {
          this.fetch_campaign_list();
        }
      }
    },
    methods: {
      handle_dialog_close () {
        this.$emit('update:visible', false)
      },
      handle_dialog_open(){
      },
      // 获取列表数据
      fetch_campaign_list() {
        this.loading = true;
        return new Promise( (resolve, reject) => {
          return fetch.post('/campaign/creative', {
            start:this.start,
            end:this.end,
            campaign_id: this.campaignId,
            page: this.currentPage,
            limit: this.pageSize
          }).then( res => {
              this.loading = false;
              if( res.ret == 0) {
                var data = res.data;
                if( data.length ) {
                  this.total = parseInt(res.total)
                  this.list_data = data
                }
                else {
                  this.total = 0;
                  this.list_data = [];
                }
                resolve();
              }
              else {
                reject( new Error(res.msg));
              }
            }).catch( err => {
              this.loading = false;
              reject( err );
            })
        })
      },
      // 处理分页操作
      handle_page_change(currentPage){
        this.currentPage = currentPage;
        this.fetch_campaign_list();
      },
      handle_size_change(size){
        this.pageSize = size;
        this.fetch_campaign_list();
      },
      // 格式化操作状态 0 暂停 1 运行
      format_status( status ) {
        if( status == '0') {
          return {
            type: 'warning',
            text: '暂停'
          }
        }
        else if( status == '1') {
          return  {
            type: 'success',
            text: '正常'
          }
        }
        else if( status == '2') {
          return {
            type: 'danger',
            text: '中止'
          }
        }
        else if( status == '3') {
          return {
            type: 'danger',
            text: '归档'
          }
        }
        else {
          return {
            type: 'info',
            text: '-'
          }
        }
      },
      // 格式化推送状态 push_status (0 草稿 1 已推送)
      format_push_status( status ) {
        if( status == '0') {
          return {
            type: '',
            text: '草稿'
          }
        }
        else if( status == '1') {
          return {
            type: 'success',
            text: '已推送'
          }
        }
        else {
          return {
            type: 'info',
            text: '-'
          }
        }
      },
      // 格式化审核状态  (草稿，审核中，审核失败，审核成功)
      format_audit_status( status ) {
        if( status == '1') {
          return {
            type: '',
            text: '待审核'
          }
        }
        else if( status == '2') {
          return {
            type: '',
            text: '审核中'
          }
        }
        else if( status == '3') {
          return {
            type: 'success',
            text: '审核通过'
          }
        }
        else if( status == '4') {
          return {
            type: 'danger',
            text: '审核失败'
          }
        }
        else {
          return {
            type: 'info',
            text: '-'
          }
        }
      },
      // 格式化投放状态 run_status (0 未投放 1 投放中 2 已完成)
      format_run_status( status ) {
        if( status == '0') {
          return {
            type: 'warning',
            text: '未投放'
          }
        }
        else if( status == '1') {
          return {
            type: '',
            text: '投放中'
          }
        }
        else if( status == '2') {
          return {
            type: 'success',
            text: '已完成'
          }
        }
        else {
          return {
            type: 'info',
            text: '-'
          }
        }
      },
      format_num(num) {
        return num || 0;
      },
      format_str(value) {
        return value || '--';
      },
      format_ctr(value) {
        return value +'%';
      },
      openDetailDialog(row){
        let plan_id = this.campaignId;
        this.detailParam.param = {plan_id,creative_id:row.creative_id,creative_group_id:row.creative_group_id};
        this.visibleDetailCtv = true;

      }
    },
    components: {
      FormDetail
    }
  }
</script>
