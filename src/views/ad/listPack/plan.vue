<template>
  <div class="m__content">
    <div class="clearfix nav-wrap">
      <div class="pull-left">
        <project-nav />
      </div>
    </div>
    <div class="content-wrap">
      <div class="hy-card" >
        <div class="hy-card__header clearfix">
          <div class="pull-right">
            <el-input placeholder="请输入计划名称" v-model="keywords" size="mini" style="width:200px;">
              <el-button slot="append" icon="el-icon-search" @click="keySerach"></el-button>
            </el-input>
            <el-date-picker size="mini" :clearable="false"
              type="daterange"
              align="right"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="dataDuration"
              :picker-options="pickerOptions"
              @change="handle_date_change">
            </el-date-picker>
            <checkbox-dropdown
              placement="bottom"
              name="自定义列"
              :items="extral_column"
              v-model="check_columns"
            />
          </div>
        </div>
        <div class="hy-card__content">
          <el-table ref="table" border size="mini" 
            :data="listData"
            style="width: 100%"
            :highlight-current-row="true">
            <el-table-column v-if="check_columns.indexOf('id') > -1" prop="id" label="推广计划ID" ></el-table-column>
            <el-table-column prop="status" label="操作状态" >
              <template slot-scope="scope">
                  <el-tag :type="format_status(scope.row['status']).type">
                    {{format_status(scope.row['status']).text}}
                  </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="run_status" label="投放状态" >
              <template slot-scope="scope">
                  <el-tag :type="format_run_status(scope.row['run_status']).type">
                    {{format_run_status(scope.row['run_status']).text}}
                  </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="audit_status" label="审核状态" >
              <template slot-scope="scope">
                <el-tag :type="format_audit_status(scope.row['audit_status']).type">
                  {{format_audit_status(scope.row['audit_status']).text}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="check_columns.indexOf('brand_name') > -1" prop="brand_name" width="100" label="品牌" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('product_line') > -1" prop="product_line" width="100" label="产品线" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('start_time') > -1" prop="start_time" width="100" label="开始时间" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('end_time') > -1" prop="end_time" width="100" label="结束时间" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('budget') > -1" prop="budget" width="100" label="每日预算" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('group_name') > -1" prop="group_name" width="100" label="人群定向" >
              <template slot-scope="scope">
                {{scope.row.group_name?scope.row.group_name:'--'}}
              </template>
            </el-table-column>
            
            <el-table-column prop="campaign_name" label="推广计划名称" ></el-table-column>
            <el-table-column prop="activity_name" label="活动名称" ></el-table-column>
            <el-table-column prop="pv" label="展现数" ></el-table-column>
            <el-table-column prop="click" label="点击数" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('ctr') > -1" prop="ctr" width="100" label="CTR" >
              <template slot-scope="scope">
                {{scope.row.ctr}}%
              </template>
            </el-table-column>
            
            <el-table-column v-if="check_columns.indexOf('cpc') > -1" prop="cpc" width="100" label="CPC" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('cpm') > -1" prop="cpm" width="100" label="CPM" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('leads') > -1" prop="leads" width="100" label="Leads" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('cpl') > -1" prop="cpl" width="100" label="CPL" ></el-table-column>
            <el-table-column v-if="check_columns.indexOf('cr') > -1" prop="cr" width="100" label="CR" >
              <template slot-scope="scope">
                {{scope.row.cr}}%
              </template>
            </el-table-column>
          </el-table>
          <div class="listpage clearfix">
            <el-pagination
              class="pull-right"
              layout="total, sizes, prev, pager, next"
              :current-page="page"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20]"
              :page-size="10"
              :total="total">
            </el-pagination>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
  import SidebarTree from '@/views/ad/public/sidebar-tree'
  import ProjectNav from '@/views/ad/public/project-nav'
  import CheckboxDropdown from '@/views/public/checkbox-dropdown'
  import fetch from "@/services/fetch"
  import {mapState} from 'vuex'
  import moment from 'moment'

  export default {
    name: "ProPopuPan",
    components:{
      SidebarTree,
      ProjectNav,
      CheckboxDropdown
    },
    data(){
      return {
        keywords:"",
        dataDuration:[moment().subtract(7, 'd').format('YYYY-MM-DD'),moment().subtract(1, 'd').format("YYYY-MM-DD")],
        pickerOptions:{
          shortcuts: [
            {
              text: "昨天",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit("pick", [start, start]);
              }
            },
            {
              text: "近7天",
              onClick(picker) {
                const end = new Date()- 3600 * 1000 * 24 * 1;
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "近30天",
              onClick(picker) {
                const end = new Date()- 3600 * 1000 * 24 * 1;
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        extral_column:[
          {label: "推广计划ID",prop: "id"},
          {label: "品牌",prop: "brand_name"},
          {label: "产品线",prop: "product_line"},
          {label: "开始时间",prop: "start_time"},
          {label:"结束时间",prop:"end_time"},
          {label:"每日预算",prop:"budget"},
          {label:"人群定向",prop:"group_name"},
          {label:"CTR",prop:"ctr"},
          {label:"CPC",prop:"cpc"},
          {label:"CPM",prop:"cpm"},
          {label:"Leads",prop:"leads"},
          {label:"CPL",prop:"cpl"},
          {label:"CR",prop:"cr"}
        ],
        check_columns:[],
        page: 1,
        limit: 10,
        total: 0,
        currentPage: 0,
        listData:[],
        statusAry:["暂停","正常","中止","归档"],
        runStatusAry:["未投放 ","投放中","已完成"]
      }
    },
    computed:{
      ...mapState('ad', [
        'project_id'
      ]),
    },
    watch: {
      dataDuration(n, o) {
        this.initList();
      }
    },
    created(){
      this.initList();
    },
    methods:{
      initList(){
        let setData = {
          project_id: this.project_id,
          keywords:this.keywords,
          start: moment(this.dataDuration[0]).format("YYYY-MM-DD"),
          end: moment(this.dataDuration[1]).format("YYYY-MM-DD"),
          page: this.page,
          limit: this.limit,
        };
        fetch.post("/campaign/list",setData).then(res=>{
          if(res.ret==0 && res.data){
            this.listData = res.data;
            this.total =  Number(res.total) || 0;
          }
        })
      },
      keySerach(){
        this.page = 1;
        this.initList();
      },
      handle_date_change(){
        this.page = 1;
        this.initList();
      },
      handleSizeChange(val){
        this.page = 1;
        this.limit = val;
        this.initList();
      },
      handleCurrentChange(val){
        this.page = val;
        this.initList();
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

      //格式化推送状态
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
    }
  }

</script>
<style scoped>
  /*@import "liststyle.css";*/
</style>
