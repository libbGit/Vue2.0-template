<template>
<div>
<!-- 数据显示 -->
<div class="hy-card" >
  <div class="hy-card__header clearfix">
    <span class="title">数据显示</span>
    <el-button size="mini" style="margin-left:20px;" @click="handleStop">中止</el-button>
    <div class="pull-right">
      <span style="font-size:12px;color:#444;">开始月:</span>
      <el-date-picker size="mini"
        v-model="start_time"
        type="month"
        placeholder="选择月"
        value-format="yyyy-MM"
        @change="handleDateChange">
      </el-date-picker>
      <span style="font-size:12px;color:#444;">结束月:</span>
      <el-date-picker size="mini"
        v-model="end_time"
        type="month"
        placeholder="选择月"
        value-format="yyyy-MM"
        @change="handleDateChange">
      </el-date-picker>
      <checkbox-dropdown
        placement="bottom"
        name="自定义列"
        :items="extral_column"
        v-model="check_columns"
      />
    </div>
  </div>
  <div class="hy-card__content" v-loading="isLoading">
    <el-table size="mini"
      :data="advertiserData"
      border
      style="width: 100%"
      max-height="510"
      @selection-change="handleSelectionChange"
      >

        <el-table-column
          type="selection"
          width="40">
        </el-table-column>

        <el-table-column
          prop="name"
          label="广告主名称"
          fixed='left'
          width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="redirect_project(scope.row)">
              {{scope.row['name']}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="operation_status"
          fixed='left'
          label="操作状态"
          align='center'
          width="100">
          <template slot-scope="scope">
            <el-tag :type="formatOperationStatus(scope.row['operation_status']).type">
              {{formatOperationStatus(scope.row['operation_status']).text}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          fixed='left'
          label="投放状态"
          align='center'
          width="100">
          <template slot-scope="scope">
            <el-tag :type="formatadvertiserStatus(scope.row['status']).type">
              {{formatadvertiserStatus(scope.row['status']).text}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="budget_schedule"
          label="预算进度"
          width="220">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.budget_schedule">
            </el-progress>
          </template>
        </el-table-column>

        <el-table-column
          prop="cost_schedule"
          label="消费进度"
          width="220">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.cost_schedule>100?100:scope.row.cost_schedule" style="margin-right: 20px;">
            </el-progress>
            <el-tooltip effect="dark" content="消费与预算统计图" placement="right">
              <i class="el-icon-view icon-detail" @click="openChartDialog(scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="cost"
          width="120"
          label="已消耗">
        </el-table-column>

        <el-table-column
          prop="pv"
          width="120"
          label="展现">
        </el-table-column>

        <el-table-column
          prop="click"
          label="点击">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('ctr') > -1"
          prop="ctr"
          label="CTR">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('cpc') > -1"
          prop="cpc"
          label="CPC">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('cpm') > -1"
          prop="cpm"
          label="CPM">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('leads') > -1"
          prop="leads"
          label="Leads">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('cpl') > -1"
          prop="cpl"
          label="CPL">
        </el-table-column>
        <el-table-column v-if="check_columns.indexOf('cr') > -1"
          prop="cr"
          label="CR">
        </el-table-column>
    </el-table>
    <div class="pagination-wrap clearfix">
      <el-pagination class="pull-right"
        layout="total, sizes, prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        @size-change="handle_size_change"
        @current-change="handle_page_change"
        >
      </el-pagination>
    </div>
  </div>
</div>
<!-- 进度图表 -->
<el-dialog :visible.sync="dialogChart" :lock-scroll="false" title="消费与预算统计图">
  <dialog-chart :data="chart_data"/>
</el-dialog>

<!-- 中止提示框-->
<el-dialog :visible.sync="dialogStop" :lock-scroll="false" :title="ader_name + (projects.length?'已有':'没有') + '项目'">
  <div>
    {{ projects.map( item => {return item.name}).join(',') }}
  </div>
  <div style="color: red;">
    如中止将会把广告主全部项目，活动，计划中止，确定要进行此操作吗？
  </div>
  <div class="clearfix" style="text-align:right;">
    <el-button size="mini" @click="handleCancel">取消</el-button>
    <el-button type="primary" size="mini" @click="handleOk">确定</el-button>
  </div>
</el-dialog>

</div>
</template>
<script>
  import moment from 'moment'
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  import dialogChart from './dialog_chart'
  import CheckboxDropdown from '@/views/public/checkbox-dropdown'

  export default {
    name: 'ader-data',
    components: {
      dialogChart, CheckboxDropdown
    },
    props: {
      keyword: {
        type: [String],
        required: true,
      },
    },
    data () {
      return {
        selection: [],
        ader_id: '',
        ader_name: '',
        projects: [],
        dialogStop: false,

        dialogChart: false,
        chart_data: {},

        start_time: moment().format('YYYY-MM'),
        end_time: moment().format('YYYY-MM'),

        check_columns: [],
        extral_column: [
          {
            label: "CTR",
            prop: "ctr"
          },{
            label: "CPC",
            prop: "cpc"
          },{
            label: "CPM",
            prop: "cpm"
          },{
            label: "Leads",
            prop: "leads"
          },{
            label: "CPL",
            prop: "cpl"
          },{
            label: "CR",
            prop: "cr"
          }
        ],
        advertiserData: [],
        isLoading: false,
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    watch:{
      keyword(){
        this.fetch_advertiser_data()
      }
    },
    created() {
      this.fetch_advertiser_data()
    },
    methods: {
      ...mapActions('ad', [
        'update_ader_id',
        'update_ader_name',
        'update_ader_opera_status'
      ]),
      // 获取列表信息
      fetch_advertiser_data() {
        this.isLoading = true;
        return new Promise((resolve, reject) => {
          fetch.post('/advertiser/getData', {
            keyword:this.keyword,
            page: this.currentPage,
            limit: this.pageSize,
            start_time:this.start_time,
            end_time:this.end_time
          }).then( res => {
              this.isLoading = false;
              if (res.ret == 0) {
                this.advertiserData = res.data;
                this.total = parseInt(res.total);
                resolve(res);
              }
              else {
                reject( new Error(res.msg));
              }
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
        this.fetch_advertiser_data();
      },
      handle_size_change(size){
        this.pageSize = size;
        this.fetch_advertiser_data();
      },
      // 处理日期筛选
      handleDateChange (time) {
        if (this.start_time>this.end_time) {
          this.$message({
            message: '开始月不能晚于结束月',
            type: 'warning'
          });
          if (time==this.start_time) {
            this.start_time = this.end_time;
          }else{
            this.end_time = this.start_time;
          }
        }else{
          this.fetch_advertiser_data();
        }

      },
      // 处理选择多选框操作
      handleSelectionChange(val) {
        this.selection = val;
      },
      // 处理中止操作
      handleStop(){
        if(this.selection.length > 1) {
          this.$alert('一次只能中止一个广告主', '提示', {
            type: 'warning',
          })
        }
        else if (this.selection.length == 0) {
          this.$alert('请选择需要中止的广告主', '提示', {
            type: 'warning',
          })
        }
        else {
          var data = this.selection[0];
          var operation_status = data.operation_status;
          this.ader_id = data.id;
          this.ader_name = data.name;
          if( operation_status == 2 ){
            this.$alert('所选择的广告主已中止', '提示', {
              type: 'warning',
            })
          }
          else {
            this.fetch_advertiser_projects(data.id)
              .then( () => {
                this.dialogStop = true;
              })
          }
        }
      },
      handleOk(){
        this.dialogStop = false;
        this.$confirm('<span style="color: red;">如中止将会把广告主全部项目，活动，计划中止?</span>', '确定将此广告主-' + this.ader_name +'中止吗',{dangerouslyUseHTMLString: true
        }).then( ()=> {
            this.stop_advertiser(this.ader_id).then( ()=> {
              this.fetch_advertiser_data();
              this.$message('广告主已终止');
            }).catch( err => {
              this.$message(err.message);
            })
          .catch(err => {})
        })
      },
      handleCancel() {
        this.dialogStop = false;
      },
      fetch_advertiser_projects(ader_id){
        return new Promise( (resolve, reject) => {
          return fetch.post('/advertiser/getProjectAll', {
            ader_id: ader_id
          }).then( res => {
            if(res.ret == 0) {
              this.projects = res.data;
              resolve(res);
            }
            else {
              reject( new Error(res.msg))
            }
          }).catch( err => {
            reject( err )
          })
        })
      },
      stop_advertiser(ader_id){
        return new Promise( (resolve, reject) => {
          return fetch.post('/advertiser/stop', {
            ader_id: ader_id
          }).then( res => {
            if(res.ret == 0) {
              resolve();
            }
            else {
              reject( new Error(res.msg))
            }
          }).catch( err => {
            reject( err )
          })
        })
      },
      formatadvertiserStatus (status) {
        var result = {};
        switch( status ) {
          case 1:
          result = {
            type: 'success',
            text: '投放中'
          }
          break;
          case 2:
          result = {
            type: 'warning',
            text: '未投放'
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
      formatOperationStatus (status) {
        var result = {};
        switch( status ) {
          case 1:
          result = {
            type: 'success',
            text: '正常'
          }
          break;
          case 2:
          result = {
            type: 'info',
            text: '已中止'
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
      // 打开“消费和预算”弹窗
      openChartDialog (row) {
        fetch.post('/advertiser/getDataChart', {
          ader_id: row.id,
          start_time:this.start_time,
          end_time:this.end_time
        }).then( res => {
          if(res.ret == 0) {
            this.chart_data = res.data;
            this.dialogChart = true;
          }
          else {
            alert( res.msg);
          }
        }).catch( err => {
          alert(err.message);
        })
      },
      // 跳转到客户管理界面
      redirect_project(row){
        this.update_ader_id(row.id);
        this.update_ader_opera_status(row.operation_status);
        this.update_ader_name(row.name);
        this.$router.push({
          path: '/ad/project'
        })
      }
    }
  }
</script>
<style scoped>
  .icon-detail {
    position: absolute;
    right: 8px;
    font-size: 16px;
    top: 15px;
    cursor: pointer;
  }
</style>
