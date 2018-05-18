<template>
    <div class="m__content">
      <div class="clearfix nav-wrap">
        <div class="pull-left">
          <component :is='pageType'></component>
        </div>
      </div>
      
      <div class="content-wrap">
        <div class="hy-card" >
          <div class="hy-card__header clearfix">
            <div class="pull-right">
              <el-input placeholder="请输入人群包名称" v-model="keywords" size="mini" style="width:200px;">
                <el-button slot="append" icon="el-icon-search" @click="keySerach"></el-button>
              </el-input>
              <el-date-picker size="mini" :clearable="false"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="dataDuration"
                :picker-options="campCrowdDROptions"
                @change="handle_date_change"
              >
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
            <div v-loading="isLoading">
                <el-table ref="table" border size="mini" 
                  :data="listData"
                  style="width: 100%"
                  :highlight-current-row="true">
                  <el-table-column
                    prop="crowdName"
                    min-width="150"
                    label="人群包名称" >
                  </el-table-column>
                  <!-- PD上线后恢复 -->
                  <!-- <el-table-column
                    prop="group_type"
                    width="150"
                    label="类型"
                    :formatter="format_type" >
                  </el-table-column> -->
                  <el-table-column
                    prop="planName"
                    min-width="150"
                    label="挂接的计划" >
                  </el-table-column>
                  <el-table-column
                    prop="pv"
                    label="展示数" >
                  </el-table-column>
                  <el-table-column
                    prop="click"
                    label="点击数" >
                  </el-table-column>
                  <el-table-column v-if="check_columns.indexOf('ctr') > -1"
                      prop="ctr"
                      label="CTR" >
                    <template slot-scope="scope">
                      {{ scope.row.ctr}}%
                    </template>
                  </el-table-column>
                  <el-table-column v-if="check_columns.indexOf('cpc') > -1"
                      prop="cpc"
                      width="100"
                      label="CPC" >
                  </el-table-column>
                  <el-table-column v-if="check_columns.indexOf('cpm') > -1"
                      prop="cpm"
                      label="CPM" >
                  </el-table-column>
                  <el-table-column v-if="check_columns.indexOf('leads') > -1"
                      prop="leads"
                      label="Leads" >
                  </el-table-column>
                  <el-table-column v-if="check_columns.indexOf('cpl') > -1"
                      prop="cpl"
                      label="CPL" >
                  </el-table-column>
                  <el-table-column v-if="check_columns.indexOf('cr') > -1"
                      prop="cr"
                      label="CR" >
                    <template slot-scope="scope">
                      {{ scope.row.cr}}%
                    </template>
                  </el-table-column>
                </el-table>
             </div>
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
  import CampaignNav from '@/views/ad/public/campaign-nav'
  import ActivityNav from '@/views/ad/public/activity-nav'
  import CheckboxDropdown from '@/views/public/checkbox-dropdown'
  import fetch from "@/services/fetch"
  import {mapState} from 'vuex'
  import moment from 'moment'

  export default {
    name: "Crowd",
    components:{
      campaign:CampaignNav,
      activity:ActivityNav,
      CheckboxDropdown
    },
    data(){
      return {
        isLoading:false,
        dataDuration:[moment().subtract(7, 'd').format('YYYY-MM-DD'),moment().subtract(1, 'd').format("YYYY-MM-DD")],
        pageType:'',
        keywords:"",
        campCrowdDR:[],
        campCrowdDROptions:{
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
          {label: "CTR",prop: "ctr"},
          {label: "CPC",prop: "cpc"},
          {label: "CPM",prop: "cpm"},
          // {label: "Leads",prop: "leads"},
          // {label:"CPL",prop:"cpl"},
          // {label:"CR",prop:"cr"}
        ],
        check_columns:[],
        page: 1,
        limit: 10,
        total: 0,
        listData:[],

        typeAry:["","华扬DMP","腾讯DMP","秒针DMP"],
      }
    },
    computed:{
      ...mapState('ad', [
        'activity_id','campaign_id'
      ]),
    },
    watch: {
      dataDuration(n, o) {
        this.initList();
      },
      '$route':function(n, o){
        this.setPageType();
        this.initList();
      },
      activity_id(){
        this.setPageType();
        this.initList();
      },
      campaign_id(){
        this.setPageType();
        this.initList();
      }
    },
    created(){
      this.setPageType();
      this.initList();
    },
    methods:{
      format_type(row, column, value){
        return this.typeAry[Number(value)];
      },
      setPageType(){
        if (this.$route.path.indexOf('ad/campaign/crowd')!=-1) {
          this.pageType = 'campaign'
        }else {
          this.pageType = 'activity'
        }
      },
      initList(){
        let setData = {
          keywords:this.keywords,
          start: moment(this.dataDuration[0]).format("YYYY-MM-DD"),
          end: moment(this.dataDuration[1]).format("YYYY-MM-DD"),
          page: this.page,
          limit: this.limit,
        };
        let url = '';
        if (this.pageType=='activity') {
          url = '/campaign/crowd';
          setData.activity_id = this.activity_id;
        }else{
          url = '/campaign/crowed';
          setData.campaign_id = this.campaign_id;
        }
        this.isLoading = true;
        fetch.post(url,setData).then(res=>{
          this.isLoading = false;
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
      }
    }
  }

</script>
<style scoped>
</style>
