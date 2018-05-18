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
              <el-input style="width: 200px;"
                 placeholder="请输入创意名称"
                 size="mini"
                 @keyup.enter.native='handleSearch'
                 v-model="searchVal">
                 <el-button slot="append" icon="el-icon-search" @click='handleSearch'></el-button>
              </el-input>

              <el-date-picker
                size="mini"
                v-model="dataDuration"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>

              <checkbox-dropdown
                placement="bottom"
                name="自定义列"
                :items="extral_column"
                v-model="check_columns" />
            </div>
          </div>
          <!-- head start-->

          <!-- table start-->
          <div class="hy-card__content" v-loading="isLoading">
            <el-table size="mini"
              :data="tableData"
              border
              style="width: 100%">

                <el-table-column v-if="check_columns.indexOf('brand_name') > -1"
                  prop="brand_name"
                  label="品牌"
                  width="100">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('product_line') > -1"
                  prop="product_line"
                  label="产品线"
                  width="100">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('activity_name') > -1"
                  prop="activity_name"
                  label="活动名称">
                </el-table-column>

                <el-table-column
                  prop="creative_name"
                  label="创意名称">
                </el-table-column>

                <el-table-column
                  prop="creative_group_name"
                  label="创意组名称">
                </el-table-column>

                <el-table-column
                  prop="status"
                  width="100"
                  label="审核状态">
                  <template slot-scope="scope">
                    <el-tag
                      :type="format_audit_status(scope.row['status']).type">
                      {{format_audit_status(scope.row['status']).text}}
                    </el-tag>

                  </template>
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('ad_type') > -1"
                  prop="ad_type"
                  label="广告形式"
                  width="100">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('media_name') > -1"
                  prop="media_name"
                  label="媒体"
                  width="80">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('pos_name') > -1"
                  prop="pos_name"
                  label="点位">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('creative_content') > -1"
                  width="80"
                  label="创意内容">
                  <template slot-scope="scope">
                    <!-- <router-link
                      :to="'/ad/creative-pro/detail/' + scope.row.creative_id +'?ad_id='+scope.row.ad_id"
                      v-if='projectID'>
                      <el-button type="text" size="small">详情</el-button>
                    </router-link>
                    <router-link
                      :to="'/ad/creative-atv/detail/' + scope.row.creative_id+'?ad_id='+scope.row.ad_id"
                      v-else>
                      <el-button type="text" size="small">详情</el-button>
                    </router-link> -->
                    <el-button type="text" size="small" @click='toDetail(scope.row)'>详情</el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="campaign_name"
                  label="挂接的计划">
                </el-table-column>

                <el-table-column
                  prop="pv"
                  width="100"
                  label="展现数">
                </el-table-column>

                <el-table-column
                  prop="click"
                  width="100"
                  label="点击数">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('ctr') > -1"
                  prop="ctr"
                  width="80"
                  label="CTR">
                  <template slot-scope="scope">
                    {{scope.row.ctr}}%
                  </template>
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cpc') > -1"
                  prop="cpc"
                  width="80"
                  label="CPC">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cpm') > -1"
                  prop="cpm"
                  width="80"
                  label="CPM">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('leads') > -1"
                  prop="leads"
                  width="80"
                  label="Leads">
                </el-table-column>

                <el-table-column v-if="check_columns.indexOf('cpl') > -1"
                  prop="cpl"
                  width="80"
                  label="CPL">
                </el-table-column>
                <el-table-column v-if="check_columns.indexOf('cr') > -1"
                  prop="cr"
                  align="center"
                  width="80"
                  label="CR">
                  <template slot-scope="scope">
                    {{scope.row.cr}}%
                  </template>
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
import ActivityNav from '@/views/ad/public/activity-nav'
import CampaignNav from '@/views/ad/public/campaign-nav'
import ProjectNav from '@/views/ad/public/project-nav'
import DaterangePicker from '@/views/public/daterange-picker'

  export default {
    name: 'CreativeOverview',
    components: {
      SidebarTree,
      DaterangePicker,
      CheckboxDropdown,
      'activity':ActivityNav,
      'project':ProjectNav,
      'campaign':CampaignNav
    },
    data() {
      return {
        pageType:'',//页面类型：项目、活动、计划
        activityID:'',//活动id
        projectID:'',//项目id
        currentPage:1,
        pageSize: 10,
        total: 0,
        isLoading: false,
        tableData:[],
        searchVal: "",
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
        check_columns: [],
        extral_column: [
          {
            label: "品牌",
            prop: "brand_name"
          },{
            label: "产品线",
            prop: "product_line"
          },{
            label: "活动名称",
            prop: "activity_name"
          },{
            label: "广告形式",
            prop: "ad_type"
          },{
            label: "媒体",
            prop: "media_name"
          },{
            label: "点位",
            prop: "pos_name"
          },{
            label: "创意内容",
            prop: "creative_content"
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
      setPageType(){
        if (this.campaign_id) {
          this.pageType = 'campaign'
	  //bug#10672
          this.$router.push({
            path: '/ad/campaign/creative/list',
          });
        }else if (this.activity_id) {
          this.pageType = 'activity'
          // console.log('activity')
        }else{
          this.pageType = 'project'
          // console.log('project')
        }
        /*this.pageType;
        let path = this.$route.path;
        //项目级别的创意组
        if (path == "/ad/creative-pro/overview") {
          this.projectID = this.project_id;
          // 活动级别的创意组
        }else if (path == "/ad/creative-pro/overview") {
          this.activityID = this.activity_id;
        }else{

        }*/
      },
      handle_page_change(currentPage){
        this.currentPage = currentPage;
        this.fetch_getList();
      },
      onSelectChange(){
        this.fetch_getList();
      },
      handleSearch() {
        this.fetch_getList();
      },
      toDetail(obj){
        console.log("obj===",obj)
        let plan_id = obj.plan_id;
        let creative_id = obj.creative_id;
        let creative_group_id = obj.creative_group_id;
        let routeName = '';
        let path = '';
        switch(this.pageType){
          case 'project':
            // routeName = 'ProjectCreativeDetail'
            path = '/ad/project/creative/detail'
            break
          case 'activity':
            // routeName = 'ActivityCreativeDetail'
            path = '/ad/activity/creative/detail'
            break
          case 'campaign':
            // routeName = 'CampaignCreativeDetail'
            path = '/ad/campaign/creative/detail'
            break
        }
        /*this.$router.push({
          name: routeName,
          params: {ad_id,creative_id}
        });*/
        this.$router.push({
          path: path,
          query: {plan_id,creative_id,creative_group_id}
        });
      },
      fetch_getList(){
        let start = moment(this.dataDuration[0]).format('YYYY-MM-DD');
        let end = moment(this.dataDuration[1]).format('YYYY-MM-DD');


        let keywords = this.searchVal;
        let page = this.currentPage;
        let limit = this.pageSize;

        let url = '';
        let param = {keywords,page,limit,start,end};

        if (this.pageType!='campaign') {
          param.activity_id = this.pageType=='project'?"":this.activity_id;
          param.project_id = this.project_id;
          url = '/creative/list2';
        }else{
          param.campaign_id = this.campaign_id
          url = '/campaign/creative';
        }

        fetch
        .post(url, param)
        .then(res => {
          if (res.ret == 0&&Array.isArray(res.data)) {
            this.tableData = res.data;
            this.total = isNaN(res.total-0)?0:res.total-0;
          } else {
            this.$message.error("获取创意列表失败，请稍后重试");
            console.error(res.ret);
          }
        })
        .catch(err => {
          this.$message.error("获取创意列表失败，请稍后重试");
          console.error(err||'/creative/list2');
        });
      },

    }

  }
</script>
