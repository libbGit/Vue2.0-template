<template>
    <div class="m__content">
      <!-- 导航栏 -->
      <div class="clearfix nav-wrap">
        <div class="pull-left">
          <component :is='pageType'></component>
        </div>
        <div class="pull-right">
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-wrap">
        <!-- 数据显示 -->
        <div class="hy-card" >
          <!-- head start-->
          <div class="hy-card__header clearfix">

            <div class="pull-right">

              <el-select v-model="putStatus" placeholder="请选择" @change='onSelectChange' size="mini">
                <el-option
                  v-for="item in putOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                size="mini"
                v-model="dataDuration"
                type="daterange"
                align="right"
                unlink-panels
                @change='onChangedatepicker'
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
              <el-input style="width: 250px;"
                placeholder="请输入创意组名称"
                size="mini"
                @keyup.enter.native='handleSearch'
                v-model="searchVal">
              <el-button slot="append" icon="el-icon-search" @click='handleSearch'></el-button>
              </el-input>
            </div>

          </div>
          <!-- head start-->

          <!-- table start-->
          <div class="hy-card__content" v-loading="isLoading">
            <el-table size="mini"
              :data="tableData"
              border
              style="width: 100%">
                <el-table-column
                  prop="id"
                  width="80"
                  label="创意组ID">
                </el-table-column>
                
                <el-table-column
                  prop="status"
                  label="操作状态"
                  align='center'
                  width="150">
                  <template slot-scope="scope">
                    <el-tag :type="formatOperationStatus(scope.row['ad_status']).type">
                    {{formatOperationStatus(scope.row['ad_status']).text}}
                    </el-tag>
                    <el-button type="text" v-if="scope.row.ad_status==1"
                      @click='pause(scope.row)'
                      size="mini">暂停 -
                    </el-button>
                    <el-button type="text" size="mini" v-else
                      @click='open(scope.row)'>开启 -
                    </el-button>
                    <el-button type="text" size="mini" @click='archive(scope.row,scope.$index)'>归档</el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="run_status"
                  label="投放状态"
                  width="100">
                  <template slot-scope="scope">
                    <el-tag :type="formatPutStatus(scope.row['run_status']).type">
                      {{formatPutStatus(scope.row['run_status']).text}}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="status"
                  label="轮播状态"
                  width="100">
                  <template slot-scope="scope">
                    {{scope.row['status']==1?'否':'是'}}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="name"
                  label="创意组名称">
                </el-table-column>

                <el-table-column
                  width="120"
                  label="创意组内容">
                  <template slot-scope="scope">
                    {{scope.row.creative_counts}}个创意
                    <span>-</span>
                    <!-- <router-link :to="'/ad/creativegroup-pro/detail/' + scope.row.id +'?plan_id='+scope.row.plan_id " v-if='projectID'>
                      <el-button type="text" icon="el-icon-document" title="详情"  size="mimi"></el-button>
                    </router-link>
                    <router-link
                      :to="'/ad/creativegroup-atv/detail/' + scope.row.id  +'?plan_id='+scope.row.plan_id "
                      v-else>
                      <el-button type="text" icon="el-icon-document" title="详情"  size="mimi"></el-button>
                    </router-link> -->
                     <el-button type="text" icon="el-icon-document" title="详情" 
                     @click='toDetail(scope.row)' size="mimi"></el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="activity"
                  width="180"
                  label="关联活动">
                </el-table-column>

                <el-table-column
                  prop="plan"
                  width="180"
                  label="关联计划">
                </el-table-column>

                <el-table-column
                  prop="pv"
                  width="60"
                  label="展示数">
                </el-table-column>

                <el-table-column
                  prop="click"
                  width="60"
                  label="点击数">
                </el-table-column>CPM

                <el-table-column
                  prop="cpm"
                  width="60"
                  label="CPM">
                </el-table-column>
                <el-table-column
                  prop="cpc"
                  width="60"
                  label="CPC">
                </el-table-column>
                <el-table-column
                  prop="cpl"
                  width="60"
                  label="CPL">
                </el-table-column>

            </el-table>
            <div class="pagination-wrap clearfix" >
              <el-pagination class="pull-right"
                layout="total, prev, pager, next"
                :total="total"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="handle_page_change"
                >
              </el-pagination>
            </div>
          </div>
          <!-- table end-->
        </div>

      </div>
      <!-- 内容区域 end-->

    </div>

  <!-- </div> -->
</template>
<script>
import _ from "lodash";
import SidebarTree from "@/views/ad/public/sidebar-tree";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
import CheckboxDropdown from '@/views/public/checkbox-dropdown'
import ProjectNav from '@/views/ad/public/project-nav'
import ActivityNav from '@/views/ad/public/activity-nav'
import CampaignNav from '@/views/ad/public/campaign-nav'
import DaterangePicker from '@/views/public/daterange-picker'

  export default {
    name: 'CreativeGroupOverview',
    components: {
      SidebarTree,
      DaterangePicker,
      CheckboxDropdown,
      'activity':ActivityNav,
      'project':ProjectNav,
      'campaign':CampaignNav,
    },
    data() {
      return {
        pageType:'',
        activityID:'',//活动id
        projectID:'',//项目id
        currentPage: 1,
        pageSize: 10,
        total: 0,
        isLoading: false,
        tableData:[],
        searchVal: "",
        putStatus:0,
        putOptions:[{
          value: 0,
          label: '全部投放状态'
        },{
          value: 1,
          label: '未投放'
        },{
          value: 3,
          label: '已投放'
        },{
          value: 2,
          label: '投放中'
        }],
        pickerOptions2: {
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
        dataDuration: [moment().subtract(7, 'd').format('YYYY-MM-DD'),moment().subtract(1, 'd').format("YYYY-MM-DD")], //操作后变成数组
      };
    },
    computed:{
      ...mapState("ad", ["project_id","activity_id",'campaign_id']),
    },
    created() {
      this.setPageType();
      this.fetch_getList();
    },
    watch: {
      dataDuration(n, o) {
        this.fetch_getList();
      },
    },
    methods:{
      pause(item){
        this.fetch_set_status({/*ad_id:item.ad_id,*/ad_status:0,creative_group_id:item.id}).then(()=>{
          item.ad_status = '0';
        },()=>{
          this.$message.error('暂停失败请稍后重试');
        });
      },
      open(item){
        this.fetch_set_status({/*ad_id:item.ad_id,*/ad_status:1,creative_group_id:item.id}).then(()=>{
          item.ad_status = '1';
        },()=>{
          this.$message.error('开启失败请稍后重试');
        });
      },
      fetch_set_status(data){
        this.isLoading = true;
        return new Promise((resolve, reject) => {
          return fetch.post("/creative_group/status",data)
            .then(res => {
              this.isLoading = false;
              if (res.ret == 0) {//debugger
                resolve();
              } else {
                reject(res.msg||'操作失败');
              }
            })
            .catch(err => {
              this.isLoading = false;
              reject(err||'操作失败');
            });
        });
      },
      archive(item,index){
        // return this.$message.error("敬请期待，程序员下班了");
        this.isLoading = true;
        let params = {
          status:1,
          creative_group_id:item.id,
          ad_id:item.ad_id
        };
        fetch.post("/creative_group/archive",params)
          .then(res => {
            this.isLoading = false;
            if (res.ret == 0) {
              this.tableData.splice(index,1);

              // resolve();
            } else {
              this.$message.error('归档失败请稍后重试');
            }
          })
          .catch(err => {
            this.isLoading = false;
            this.$message.error('归档失败请稍后重试');
          });
      },
      setPageType(){
        if (this.campaign_id) {
          this.pageType = 'campaign'
	  //bug#10672
          this.$router.push({
            path: '/ad/campaign/creative-group/list',
          });
        }else if (this.activity_id) {
          this.pageType = 'activity'
        }else{
          this.pageType = 'project'
        }
      },
      //操作状态  1运行 0暂停
      formatOperationStatus(status) {
        if(status==null || status==""){
          return {
            type: "",
            text: "--"
          }
        }
        
        var status = status - 0;
        var result = {};
        switch (status) {
          case 1:
            result = {
              type: "success",
              text: "正常"
            };
            break;
          case 0:
            result = {
              type: "warning",
              text: "已暂停"
            };
            break;
          default:
        }
        return result;
      },
      //投放状态 1未投放 2投放中 3已完成
      formatPutStatus(status) {
        var status = status - 0;
        var result = {};
        switch (status) {
          case 2:
            result = {
              type: "success",
              text: "投放中"
            };
            break;
          case 1:
            result = {
              type: "warning",
              text: "未投放"
            };
            break;
          case 3:
            result = {
              type: "",
              text: "已完成"
            };
            break;
          default:
        }
        return result;
      },
      handle_page_change(currentPage){
        this.currentPage = currentPage;
        this.fetch_getList();
      },
      onChangedatepicker(){
        this.fetch_getList();
      },
      onSelectChange(){
        this.fetch_getList();
      },
      handleSearch() {
        this.fetch_getList();
      },
      fetch_getList(){
        let start = moment(this.dataDuration[0]).format('YYYY-MM-DD');
        let end = moment(this.dataDuration[1]).format('YYYY-MM-DD');
        let time = {start,end};

        let project_id = this.project_id;
        let activity_id = this.pageType=='project'?"":this.activity_id;
        let campaign_id = this.pageType=='campaign'?this.campaign_id:'';

        let name = this.searchVal;
        let status = this.putStatus;

        let page = this.currentPage;
        let limit = this.pageSize;


        fetch
        .post('/creative_group/list', {activity_id,project_id,campaign_id,name,status,page,limit,time})
        .then(res => {
          if (res.ret == 0&&Array.isArray(res.data)) {
            this.tableData = res.data;
            this.total = isNaN(res.total-0)?0:res.total-0;
          } else {
            this.$message.error("获取创意组列表失败，请稍后重试");
            console.error('res.ret不等于0');
          }
        })
        .catch(err => {
          this.$message.error("获取创意组列表失败，请稍后重试");
          console.error(err||'/creative_group/list');
        });
      },
      toDetail(obj){
        let id = obj.id;
        let plan_id = obj.plan_id;
        let routeName = '';
        let path = '';
        switch(this.pageType){
          case 'project':
            routeName = 'ProjectCreativeGroupDetail'
            path = '/ad/project/creative-group/detail';
            break
          case 'activity':
            routeName = 'ActivityCreativeGroupDetail'
            path = '/ad/activity/creative-group/detail';
            break
          case 'campaign':
            routeName = 'CampaignCreativeGroupDetail'
            path = '/ad/campaign/creative-group/detail';
            break
        }
        /*this.$router.push({
          name: routeName,
          params: {id,plan_id}
        });*/
        // debugger
        this.$router.push({
          path: path,
          query: {id,plan_id}
        });
      }


    }

  }
</script>
