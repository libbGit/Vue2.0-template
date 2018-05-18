<template>
<!-- <div class="m__wraper">
  <div class="m__sidebar">
      <sidebar-tree />
  </div> -->

  <div class="m__content">
    <!-- 计划预警  -->
    <alert-list
      :param='alertParam'
      url='/plan/warn'
      @onView='viewWarn' 
    />
    <!-- 导航栏 -->
    <div class="clearfix nav-wrap">
      <div class="pull-left">
        <activity-nav />
      </div>
      <div class="pull-right">
        <el-date-picker size="mini" :clearable="false"
          type="daterange"
          align="right"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="date_range"
          :picker-options="pickerOptions"
          @change="handle_date_change"
          >
        </el-date-picker>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrap">

      <!-- 创意列表 -->
      <creative-list
        :visible="creative_campaign_dialog"
        @update:visible="value => creative_campaign_dialog = value"
        :campaign-id="creative_campaign_id"
        :campaign-name="creative_campaign_name"
        @editCyMoudel="openEditCyMoudelBox"
       />

      <!-- 图表 -->
      <campaign-chart  style="margin-top:10px;"
        v-if="chart_data"
        :data="chart_data"
      />

      <!-- 列表 -->
      <campaign-list
        :activity-id="activity_id"
        :date-range="date_range"
        :searchVal='searchVal'
        @id-change="handle_id_change"
        @check="handle_check"
      />
     <!-- <cy-edit
      :editCyModelId="editId"
      :editCyPlanId="planId"
      :popcyVisible="popCyModelDialog"
      @closeCyModleEditBox="() => {popCyModelDialog = false;editId='';planId=''}"
      >
     </cy-edit> -->

      <create-edit-creative-group 
        v-if="popCyModelDialog"
        :isOpen.sync='popCyModelDialog' 
        :creativeGroupid='editId'
        :exPlanId='planId'
        :posId="posId"
        type='editAfter'
      />
    </div>
    <!-- /内容区域 -->
  </div>

<!-- </div> -->
</template>
<script>
  import $ from 'jquery'
  import moment from 'moment'
  import fetch from '@/services/fetch'
  import { mapState, mapGetters, mapActions } from "vuex"
  import SidebarTree from '@/views/ad/public/sidebar-tree'
  import ActivityNav from '@/views/ad/public/activity-nav'

  import DaterangePicker from '@/views/public/daterange-picker'

  import CampaignChart from './campaign-chart'
  import CampaignList from './campaign-list'
  import CreativeList from './creative-list'

  import CyEdit from './cy-edit'
  import CreateEditCreativeGroup from "@/views/ad/campaign/create/step4/create-edit-creative-group";
  import AlertList from '@/views/public/alert-list'

  var default_start_date = moment().subtract(7, 'days').toDate();
  var default_end_date = moment().subtract(1, 'days').toDate();

  export default {
    name: 'campaign-manage',
    data() {
      return {
        // 用于获取创意列表的计划ID
        creative_campaign_id: '',
        creative_campaign_name: '',
        creative_campaign_dialog:  false,
        chart_data: null,
        date_range: [default_start_date, default_end_date],
        pickerOptions: {
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
          }]
        },
        current_select_row: null,

        editId: "",
        planId:"",
        posId:"",
        popCyModelDialog: false,
        searchVal:''
      }
    },
    computed: {
      ...mapState({
        activity_id: state => state.ad.activity_id
      }),
      alertParam(){
        return {
          activity_id:this.activity_id
        }
      },
      start_time () {
        return moment(this.date_range[0]).format('YYYY-MM-DD');
      },
      end_time (){
        return moment(this.date_range[1]).format('YYYY-MM-DD');
      }
    },
    watch: {
      activity_id: function() {
        this.fetch_campaign_chart();
      }
    },
    created () {
      this.fetch_campaign_chart()
    },
    mounted (){
      $('.campaign-list').on('click', '.el-table__row', function(){
        $('.campaign-list').find('.el-table__row').removeClass('active');
        $(this).addClass('active');
      })
    },
    methods: {
      viewWarn(obj){
        this.searchVal = obj.name;
      },
      // 打开创意列表弹窗
      handle_check (id,name) {
        this.creative_campaign_id = String(id);
        this.creative_campaign_name = name;
        this.creative_campaign_dialog = true;
      },
      // 获取图表数据
      fetch_campaign_chart() {
        return new Promise( (resolve, reject) => {
          return fetch.post('/campaign/chart', {
            activity_id: this.activity_id,
            campaign_id: this.campaign_id,
            start: this.start_time,
            end: this.end_time,
          }).then( res => {
              if( res.ret == 0) {
                this.chart_data = res.data;
                resolve();
              }
              else {
                reject( new Error(res.msg));
              }
            }).catch( err => {
              reject( err );
            })
        })
      },
      // 日期改变
      handle_date_change() {
        this.fetch_campaign_chart()
      },
      //
      handle_id_change (id) {
        this.campaign_id = id;
        this.fetch_campaign_chart();
      },

      openEditCyMoudelBox(data){
        this.editId = data.id;
        this.planId = data.pid;
        this.posId = data.pos_id;
        this.popCyModelDialog = true;
      },
    },
    components: {
      SidebarTree,
      ActivityNav,
      DaterangePicker,
      CampaignChart,
      CampaignList,
      CreativeList,
      CyEdit,
      CreateEditCreativeGroup,
      AlertList
    }
  }
</script>
