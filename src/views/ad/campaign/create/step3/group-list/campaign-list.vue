<template>
<el-dialog
  title="关联计划列表"
  :visible="visible"
  width="1000px"
  @close="handle_dialog_close"
  @open="handle_dialog_open">
  <div class="hy-card" style="margin: -30px -20px;">
    <div class="hy-card__header clearfix">
      <div class="pull-right">
        <el-input v-model="keywords" size="small" style="width: 150px" placeholder="请输入推广计划名称查询" />
        <el-button type="primary" icon="el-icon-search" size="small" @click="fetch_campaign_list"></el-button>
      </div>
    </div>
    <div class="hy-card__content">
      <el-table ref="table" border size="mini" max-height="510" v-loading="loading"
        :data="list_data">

          <el-table-column
            prop="id"
            width="100"
            label="推广计划ID" >
          </el-table-column>

          <!-- <el-table-column
            prop="status"
            width="100"
            align="center"
            label="操作状态" >
            <template slot-scope="scope">
              <el-tag :type="format_status(scope.row['status']).type">
                {{format_status(scope.row['status']).text}}
              </el-tag>
            </template>
          </el-table-column> -->

          <el-table-column
            prop="run_status"
            width="100"
            align="center"
            label="投放状态" >
            <template slot-scope="scope">
              <el-tag :type="format_run_status(scope.row['run_status']).type">
                {{format_run_status(scope.row['run_status']).text}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="audit_status"
            width="100"
            align="center"
            label="审核状态" >
            <template slot-scope="scope">
              <el-tag :type="format_audit_status(scope.row['audit_status']).type">
                {{format_audit_status(scope.row['audit_status']).text}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="brand_name"
            width="100"
            label="品牌" >
          </el-table-column>

          <el-table-column
            prop="product_line"
            width="100"
            label="产品线" >
          </el-table-column>

          <el-table-column
            prop="activity_name"
            width="120"
            label="活动名称" >
          </el-table-column>

          <el-table-column
            prop="campaign_name"
            width="150"
            label="推广计划名称" >
          </el-table-column>

          <el-table-column
            prop="start_time"
            width="100"
            label="开始时间" >
          </el-table-column>

          <el-table-column
            prop="end_time"
            width="100"
            label="结束时间" >
          </el-table-column>

          <el-table-column
            prop="budget"
            width="100"
            label="当日预算" >
          </el-table-column>

          <el-table-column
            prop=""
            width="100"
            label="人群定向" >
            <template slot-scope="scope">
              {{ format_str(scope.row.group_name) }}
            </template>
          </el-table-column>

          <el-table-column
            width="140"
            label="创意" >
            <template slot-scope="scope">
              <div v-if="scope.row.campaign_name != '总计'">
                已关联{{scope.row.creative_count}}个创意,
                <el-button type="text" size="mimi"  @click="open_link_creative_dialog(scope.row)">详情</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="pv"
            width="100"
            label="展现数" >
            <template slot-scope="scope">
              {{ format_num(scope.row.pv) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="click"
            label="点击数" >
            <template slot-scope="scope">
              {{ format_num(scope.row.click) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="ctr"
            width="100"
            label="CTR" >
            <template slot-scope="scope">
              {{ format_ctr(scope.row.ctr) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="cpc"
            width="100"
            label="CPC" >
          </el-table-column>

          <el-table-column
            prop="cpm"
            width="100"
            label="CPM" >
          </el-table-column>

          <el-table-column
            prop="leads"
            width="100"
            label="Leads" >
          </el-table-column>

          <el-table-column
            prop="cpl"
            width="100"
            label="CPL" >
          </el-table-column>

          <el-table-column
            prop="cr"
            width="100"
            label="CR" >
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
    </div>
    <!-- 关联创意列表 -->
    <link-creative-list
      :visible="LinkCreativeListDialog"
      @update:visible="value => LinkCreativeListDialog = value"
      :campaign-id="LinkCreativeListId"
      :campaign-name="LinkCreativeListName"
    />
  </div>
</el-dialog>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapGetters, mapActions } from "vuex"
  import LinkCreativeList from '@/views/ad/campaign/public/link-creative-list'
  export default {
    name: 'campaign-list',
    data () {
      return {
        loading: false,
        list_data: [],
        keywords: '',
        currentPage: 1,
        pageSize: 5,
        total: 0,
        // 关联创意
        LinkCreativeListDialog: false,
        LinkCreativeListId: '',
        LinkCreativeListName: '',
      }
    },
    props: {
      visible: {
        type: Boolean
      },
      groupId: {
        type: String,
        required: true
      }
    },
    created (){
      this.fetch_campaign_list();
    },
    watch: {
      groupId: function() {
        this.fetch_campaign_list();
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
          return fetch.post('/campaign/list', {
            group: this.groupId,
            keywords: this.keywords,
            page: this.currentPage,
            limit: this.pageSize
          }).then( res => {
              this.loading = false;
              if( res.ret == 0) {
                var data = res.data;
                if( data.length ) {
                  this.total = isNaN(res.total)?0:parseInt(res.total)
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
      // 格式化审核状态  (草稿，审核中，审核失败，审核通过)
      format_audit_status( status ) {
        if( status == '草稿') {
          return {
            type: '',
            text: '草稿'
          }
        }
        else if( status == '审核通过') {
          return {
            type: 'success',
            text: '审核通过'
          }
        }
        else if( status == '审核失败') {
          return {
            type: 'danger',
            text: '审核失败'
          }
        }
        else if( status == '审核中') {
          return {
            type: '',
            text: '审核中'
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
      // 打开关联创意列表
      open_link_creative_dialog (row) {
        this.LinkCreativeListDialog = true;
        this.LinkCreativeListId = row.id;
        this.LinkCreativeListName = row.campaign_name;
      }
    },
    components: {
      LinkCreativeList
    }
  }
</script>
