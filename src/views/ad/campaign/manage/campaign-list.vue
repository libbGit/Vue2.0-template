<template>
  <div class="hy-card">
    <div class="hy-card__header clearfix">

      <div class="pull-left">
        <el-button type="primary" size="mini" @click="jump_to_create_campaign" v-if='enableOpera'  icon="el-icon-plus">新建计划</el-button>

        <el-dropdown>
          <el-button type="primary" size="mini" plain icon="el-icon-menu">
            操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handle_archive" value="archive" label="归档" :disabled="is_disable_archive">归档</el-dropdown-item>
            <el-dropdown-item @click.native="handle_stop" value="stop" label="暂停" :disabled="is_disable_stop">暂停</el-dropdown-item>
            <el-dropdown-item @click.native="handle_start" value="start" label="开启" :disabled="is_disable_start">开启</el-dropdown-item>
            <el-dropdown-item @click.native="handle_copy" value="copy" label="复制" :disabled="is_disable_copy">复制</el-dropdown-item>
            <!-- <el-dropdown-item @click.native="handle_push" value="push" label="推送至pbs" :disabled="is_disable_push">推送至pbs</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="pull-right">
          <el-input placeholder="请输入推广计划名称查询" v-model="keywords" size="mini" style="width:200px;">
            <el-button slot="append" icon="el-icon-search" @click="fetch_campaign_list"></el-button>
          </el-input>

        <checkbox-dropdown
          placement="bottom"
          name="自定义列"
          :items="extral_column"
          v-model="check_columns"
        />

      </div>
    </div>
    <div class="hy-card__content">
      <el-table ref="table" size="mini" max-height="510"
        v-loading="loading"
                border
        :data="list_data"
        :highlight-current-row="true"
        @row-click="handle_row_click"
        @selection-change="handle_selection_change" >

        <el-table-column
          type="selection"
          :selectable='onSelectable'
          width="50">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('id') > -1"
          prop="id"
          width="100"
          label="推广计划ID" >
        </el-table-column>

        <el-table-column
          prop="status"
          width="100"
          label="操作状态" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.campaign_name != '总计'" :type="format_status(scope.row['status']).type">
              {{format_status(scope.row['status']).text}}
            </el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="run_status"
          width="100"
          label="投放状态" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.campaign_name != '总计'" :type="format_run_status(scope.row['run_status']).type">
              {{format_run_status(scope.row['run_status']).text}}
            </el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="audit_status"
          width="110"
          label="审核状态" >
          <template slot-scope="scope">
            <div v-if="scope.row.campaign_name != '总计'">
              <el-tag 
                :type="format_audit_status(scope.row['audit_status']).type">
                {{format_audit_status(scope.row['audit_status']).text}}
              </el-tag>
              <el-button v-if="scope.row.audit_status != '草稿'"
                  style="margin-left:-10px;"
                  type="text"
                  size="mini"
                  icon="el-icon-document"
                  title="详情"
                  @click.native="handle_check_audit(scope.row)">
                </el-button>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('brand_name') > -1"
          prop="brand_name"
          width="100"
          label="品牌" >
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('product_line') > -1"
          prop="product_line"
          width="100"
          label="产品线" >
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('activity_name') > -1"
          prop="activity_name"
          width="120"
          label="活动名称" >
        </el-table-column>

        <el-table-column
          prop="campaign_name"
          width="150"
          label="推广计划名称" >
          <template slot-scope="scope">
            <div>
              {{ scope.row.campaign_name }}
              <el-button v-if="is_editable(scope.row)"  type="text"
                size="mini"
                icon="el-icon-edit"
                title="编辑" @click="handle_edit(scope.row)">
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('start_time') > -1"
          prop="start_time"
          width="100"
          label="开始时间" >
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('end_time') > -1"
          prop="end_time"
          width="100"
          label="结束时间" >
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('budget') > -1"
          prop="budget"
          width="100"
          label="当日预算" >
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('group_name') > -1"
          prop="group_name"
          width="100"
          label="人群定向" >
          <template slot-scope="scope">
            {{ format_str(scope.row.group_name) }}
          </template>
        </el-table-column>

        <el-table-column
         prop="creative_count"
         width="140"
         label="创意" >
          <template slot-scope="scope">
            <div v-if="scope.row.campaign_name != '总计'">
              已关联{{scope.row.creative_count}}个创意,
              <el-button type="text"  size="mini" icon="el-icon-document" title="详情"
                @click="open_link_creative_dialog(scope.row)">
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="pv"
          label="展现数"
        align="right">
          <template slot-scope="scope">
            {{ format_num(scope.row.pv) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="click"
          label="点击数" align="right" >
          <template slot-scope="scope">
            {{ format_num(scope.row.click) }}
          </template>
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('ctr') > -1"
          prop="ctr"
          width="100"
          label="CTR"  align="right">
          <template slot-scope="scope">
            {{ format_ctr(scope.row.ctr) }}
          </template>
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('cpc') > -1"
          prop="cpc"
          width="100"
          label="CPC" align="right">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('cpm') > -1"
          prop="cpm"
          width="100"
          label="CPM" align="right">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('leads') > -1"
          prop="leads"
          width="100"
          label="Leads" align="right">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('cpl') > -1"
          prop="cpl"
          width="100"
          label="CPL" align="right">
        </el-table-column>

        <el-table-column v-if="check_columns.indexOf('cr') > -1"
           prop="cr"
           width="100"
           label="CR" align="right">
            <template slot-scope="scope">
            {{ scope.row.cr}}%
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

    <!-- 复制广告组 -->
    <dialog-copy
      :campaign="current_campagin"
      :campaign-id="copy_campaign_id"
      :visible="is_show_copy_dialog"
      @update:visible="value => is_show_copy_dialog = value"
      @success="fetch_campaign_list"
    />
    <!-- 中止提示框-->
    <el-dialog :visible.sync="dialog_archive" :lock-scroll="false" :title="current_archive_title">
      <div style="color: red;">
        确定要将此计划归档吗？
      </div>
      <div class="clearfix" style="text-align:right;">
        <el-button size="mini" @click="handle_archive_cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="handle_archive_ok">确定</el-button>
      </div>
    </el-dialog>
    <!-- 关联创意列表 -->
    <link-creative-list
      v-if="LinkCreativeListDialog"
      :start='start_time'
      :end='end_time'
      :visible="LinkCreativeListDialog"
      @update:visible="updateDialogVisible"
      :campaign-id="LinkCreativeListId"
      :campaign-name="LinkCreativeListName"
    />
  </div>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapGetters, mapActions } from "vuex"
  import moment from 'moment'
  import CheckboxDropdown from '@/views/public/checkbox-dropdown'
  import DialogCopy from './dialog-copy'
  import LinkCreativeList from '@/views/ad/campaign/public/link-creative-list'
  export default {
    name: 'campaign-list',
    data () {
      return {
        enableOpera:true,
        loading: false,
        list_data: [],
        check_columns: [],
        extral_column: [
          {
            label: "推广计划ID",
            prop: "id"
          },{
            label: "品牌",
            prop: "brand_name"
          },{
            label: "产品线",
            prop: "product_line"
          },{
            label: "活动名称",
            prop: "activity_name"
          },{
            label: "开始时间",
            prop: "start_time"
          },{
            label: "结束时间",
            prop: "end_time"
          },{
            label: "每日预算",
            prop: "budget"
          },{
            label: "人群定向",
            prop: "group_name"
          },{
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
        keywords: '',
        currentPage: 1,
        pageSize: 5,
        total: 0,
        selection: [],
        selectedOperation: '',
        is_show_copy_dialog: false,
        copy_campaign_id: '',
        current_campagin: {},
        dialog_archive: false,
        // 关联创意
        LinkCreativeListDialog: false,
        LinkCreativeListId: '',
        LinkCreativeListName: '',
      }
    },
    props: {
      searchVal:{
        type: [String]
      },
      activityId: {
        type: [String,Number],
        required: true
      },
      dateRange: {
        type: Array,
        required: true
      }
    },
    computed: {
      ...mapState("ad", ["ader_opera_status","activity_id"]),
      start_time () {
        return moment(this.dateRange[0]).format('YYYY-MM-DD');
      },
      end_time (){
        return moment(this.dateRange[1]).format('YYYY-MM-DD');
      },
      is_disable_archive() {
        var flag = false;
        // 如果没有选中计划，则禁用
        if ( this.selection.length !== 1) {
          flag = true;
        }
        // 如果操作状态有'中止','归档', 则禁用
        this.selection.forEach( item => {
          if( item.campaign_name == "总计" ) {
            flag = true;
          }
          if(  item.status == '2' || item.status == '3') {
            flag = true;
          }
        })
        return flag
      },
      is_disable_stop() {
        var flag = false;

        // 如果没有选中计划，则禁用
        if ( this.selection.length <= 0) {
          flag = true;
        }
        // 如果操作状态有'暂停','中止','归档', 则禁用
        this.selection.forEach( item => {
          if( item.campaign_name == "总计" ) {
            flag = true;
          }
          if( item.status == '0' || item.status == '2' || item.status == '3') {
            flag = true;
          }
        })
        return flag
      },
      is_disable_start() {
        var flag = false;
        // 如果没有选中计划，则禁用
        if ( this.selection.length <= 0) {
          flag = true;
        }
        // 如果操作状态有'运行','中止','归档', 则禁用
        this.selection.forEach( item => {
          if( item.campaign_name == "总计" ) {
            flag = true;
          }
          if( item.status == '1' || item.status == '2' || item.status == '3') {
            flag = true;
          }
        })
        return flag;
      },
      is_disable_copy() {
        var flag = false;
        // 如果没有选中计划，则禁用
        if ( this.selection.length !== 1) {
          flag = true;
        }
        this.selection.forEach( item => {
          if( item.campaign_name == "总计" ) {
            flag = true;
          }
        })
        return flag
      },
      is_disable_push() {
        var flag = false;
        // 如果没有选中计划，则禁用
        if ( this.selection.length <= 0) {
          flag = true;
        }else{
          flag = false;
        }
        // 如果操作状态有'中止','归档', 则禁用
        // this.selection.forEach( item => {
        //   if( item.campaign_name == "总计" ) {
        //     flag = true;
        //   }
        //   if(  item.status == '2' || item.status == '3') {
        //     flag = true;
        //   }
        // })
        // // 如果推送状态有'已推送'，则禁用
        // this.selection.forEach( item => {
        //   if( item.push_status == '4') {
        //     flag = true;
        //   }
        // })
        // return flag;
        return flag;
      },
      selection_ids () {
        return this.selection.map( item => item.id);
      },
      current_archive_title () {
        var campaign_name = this.current_campagin.campaign_name;
        var status = this.format_status(this.current_campagin.status).text;
        var run_status = this.format_run_status(this.current_campagin.run_status).text;
        var tpl = `推广计划 - ${campaign_name} 为${status}-${run_status}状态。`;
        return tpl;
      }
    },
    created (){
      this.init();
    },
    watch: {
      dateRange () {
        this.fetch_campaign_list();
      },
      activityId: function() {
        this.init();
      },
      searchVal(n,o){
        if (n) {
          this.keywords=n;
          this.fetch_campaign_list();
        }
      }
    },
    methods: {
      ...mapActions('ad', [
        'update_campaign_id',
        'update_campaign_name',
        'fetch_getStatus'
      ]),
      ...mapActions('ad/campaign', [
        'push_campaign',
        'update_campaign_update_type',
        'update_run_status',
        'update_campaign_audit_status'
      ]),
      onSelectable(row, index){
        if (index==0&&this.currentPage==1) {
          return false;
        }
        return true;
      },
      init(){
        this.fetch_campaign_list();
        this.fetch_getStatus({id:this.activity_id,type:'activity'}).then(data=>{
          this.enableOpera = data.status!=2;
        });
      },
      // 获取列表数据
      fetch_campaign_list() {
        this.loading = true;
        return new Promise( (resolve, reject) => {
          return fetch.post('/campaign/list', {
            activity_id: this.activityId,
            keywords: this.keywords,
            start: this.start_time,
            end: this.end_time,
            page: this.currentPage,
            limit: this.pageSize
          }).then( res => {
            this.loading = false;
            if( res.ret == 0) {
              var data = res.data;
              if( data.length ) {
                var summary = res.summary;
                summary.campaign_name = '总计';
                this.total = parseInt(res.total)
                this.list_data = [summary].concat(data);
                // 设置总计为默认选中行
                this.$nextTick( () => {
                  this.$refs.table&&this.$refs.table.setCurrentRow(summary);
                });
              }
              else {
                this.total = 0;
                this.list_data = [];
              }
              this.$emit('id-change', '');
              resolve();
            }
            else {
              this.$message.error(res||'获取计划列表失败，请稍后重试')
              reject( new Error(res.msg));
            }
          }).catch( err => {
            this.loading = false;
            this.$message.error(err||'获取计划列表失败，请稍后重试')
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
      // 处理选择多选框操作
      handle_selection_change(val) {
        this.selection = val;
      },

      // 处理列表单击事件
      handle_row_click(row, event, column){
        this.campaign_id = row.id;
        this.current_select_row = row;
        this.$refs.table.setCurrentRow(row);
        this.$emit('id-change', row.id);
      },
      // 是否可编辑
      is_editable(row) {
        var flag = true;
        if( row.campaign_name == '总计') {
          return false;
        }
        // 操作状态为 中止或归档 则不可编辑
        if( row.status == '2' || row.status == '3') {
          flag = false;
        }
        return flag;
      },
      update_status(status ){
        return new Promise( (resolve, reject) => {
          fetch.post('/campaign/status', {
            id: this.selection_ids.join(','),
            status: status
          }).then( res => {
            if( res.ret == 0) {
              resolve();
              this.fetch_campaign_list();
              this.$message.success('操作成功');
            }
            else {
              reject();
              this.$message.error(res.msg);
            }
          }).catch( err => {
            reject();
            this.message.error( err.message );
          })
        });
      },
      // 编辑
      handle_edit(row){
        if( this.is_disable_edit ) return false;
        this.selectedOperation = '';
        this.update_campaign_update_type('edit');
        this.update_campaign_audit_status(row.audit_status);
        this.update_run_status(row.run_status);
        this.update_campaign_id(row.id);
        this.update_campaign_name(row.campaign_name);
        this.$router.push('/ad/campaign/step1');
      },
      // 归档
      handle_archive(){
        if(this.is_disable_archive) return false;
        // this.update_status('3');
        this.selectedOperation = '';
        this.current_campagin = this.selection[0];
        this.dialog_archive = true;
      },
      handle_archive_cancel () {
        this.dialog_archive = false;
      },
      handle_archive_ok () {
        this.dialog_archive = false;
        this.$confirm('<span style="color: red;">如将此计划归档则将不能再开启投放</span>', '确定执行此操作吗？',{dangerouslyUseHTMLString: true
        }).then( ()=> {
          this.update_status('3');
        }).catch( err => {})
      },
      // 暂停
      handle_stop(){
        if(this.is_disable_stop) return false;
        this.update_status('0');
        this.selectedOperation = '';
      },
      // 开启
      handle_start(){
        if(this.is_disable_start) return false;
        this.update_status('1');
        this.selectedOperation = '';
      },
      // 复制
      handle_copy(row){
        if(this.is_disable_copy) return false;
        this.selectedOperation = '';
        this.copy_campaign_id = this.selection_ids[0];
        this.current_campagin = this.selection[0];
        this.is_show_copy_dialog = true;
      },
      // 推送至PBS
      handle_push(){
        if(this.is_disable_push) return false;
        this.selectedOperation = '';
        this.push_campaign({id:this.selection_ids.join(",")})
          .then( () => {
            this.$message.success('推送成功');
            this.fetch_campaign_list();
          })
          .catch( err => {
            this.$message({
              duration: 5000,
              showClose: false,
              type: 'error',
              message:'推送失败：' + err.message
            })
          })
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
        else if( status == '4') {
          return {
            type: 'danger',
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
        //需要增加吗
        else {
          return {
            type: 'info',
            text: '-'
          }
        }
      },
      jump_to_create_campaign () {
        fetch
          .post("/query", { activity_id: this.activityId })
          .then(res => {
            if (res.ret == 0&&res.data) {
              let activity_etime = moment(res.data.end_time);
              if(!moment(moment()-24 * 60 * 60 * 1000).isBefore(activity_etime)){
                this.$message.error('活动已结束，无法创建计划，请先调整活动周期！');
              }else{
                this.update_campaign_id('')
                this.update_campaign_update_type('create');
                this.update_campaign_audit_status('');
                this.$router.push('/ad/campaign/step1');
              }
            } else {//debugger
              this.$message.error('获取项目信息失败');
              console.error(res.ret || "获取项目信息失败");
            }
          })
          .catch(err => {
            this.$message.error('获取项目信息失败');
            reject(err);
          });

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
      // 触发创意列表弹窗
      handle_check_audit(row){
        if( row.audit_status != '草稿') {
          this.$emit('check', row.id, row.campaign_name)
        }
      },
      // 打开关联创意列表
      open_link_creative_dialog (row) {
        this.LinkCreativeListDialog = true;
        this.LinkCreativeListId = row.id;
        this.LinkCreativeListName = row.campaign_name;
      },

      //更新关联创意列表显示状态
      updateDialogVisible(value){
        this.LinkCreativeListDialog = value;

        //关闭关联创意列表后，强制刷新本页面，获取最新的状态
        this.init();

      }
    },
    components: {
      CheckboxDropdown,
      DialogCopy,
      LinkCreativeList
    }
  }
</script>
