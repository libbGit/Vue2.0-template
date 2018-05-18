<template>
  <div>
    <campaign-report-content  
      v-loading.fullscreen.lock="fullscreenLoading"
      :element-loading-text="loadingFullScreenText">
      
      <!-- 推广计划数据 -->
      <data-type :slot="0" 
        v-loading="isloading" 
        title="推广计划数据" 
        :headers="headerTitle" 
        :values="campaignData" 
        @update="updateDateAndCampaign($event)"
	      @pageChange="updateCampaignData($event)">
      </data-type>

      <!-- 推广计划数据趋势 -->
      <data-trend ref="dataTrendRef" :slot="1" 
        v-loading="isloadingTrendData" 
        title="推广计划数据趋势" 
        :headers="trendTitle" 
        :values="campaignDataTrend" 
        @update="updateDataTrendType()">
      </data-trend>

      <!-- 终端占比 -->
      <device-percent ref="devicePercentRef" :slot="getPosition(3)" 
        v-show="getChecked(3)" 
        :loading="isloadingDevicePercent" 
        title="终端占比" 
        :values="devicePercentData" 
        @update="updateDevicePercentType()" 
        @updateIndex="updateDevicePercentIndex()">
      </device-percent>

      <!-- 广告形式top5 -->
      <advertise-type ref="advertiseTypeRef" :slot="getPosition(4)" 
        v-show="getChecked(4)" 
        v-loading="isloadingAdvertiserType" 
        title="广告形式Top5" 
        :values="advertiseTypeData" 
        @update="updateAdvertiserType()">
      </advertise-type>

      <!-- 媒体top5 -->
      <media-type ref="mediaTypeRef" :slot="getPosition(5)" 
        v-show="getChecked(5)" 
        v-loading="isloadingMediaType" 
        title="媒体Top5" 
        :values="mediaData" 
        @update="updateMediaType()">
      </media-type>

      <!-- 地域top5 -->
      <region-type ref="regionTypeRef" :slot="getPosition(6)" 
        v-show="getChecked(6)" 
        v-loading="isloadingRegionType" 
        title="地域Top5" 
        :values="regionData" 
        @update="updateRegionType()">
      </region-type>

      <!-- 点位top10 -->
      <point-position ref="pointPositionRef" :slot="getPosition(7)" 
        v-show="getChecked(7)" 
        v-loading="isloadingPos" 
        title="点位Top10" 
        :values="pointPositionData" 
        @update="updatePointPosition()">
      </point-position>

      <!-- 人群top5 -->
      <crowd-data ref="crowdDataRef" :slot="getPosition(8)" 
        v-show="getChecked(8)" 
        v-loading="isloadingCrowd" 
        title="人群Top5" 
        :lineHeaders="crowdTitle" 
        :values="crowdGroupData" 
        @update="updateCrowdData()">
      </crowd-data>

      <!-- 创意组top5 -->
      <creative-group ref="creativeGroupRef" :slot="getPosition(9)" 
        v-show="getChecked(9)" 
        v-loading="isloadingCreativeGroup" 
        title="创意组Top5" 
        :lineHeaders="creativeGroupTitle" 
        :values="creativeGroupData" 
        @update="updateCreativeGroup()">
      </creative-group>

      <!-- 创意top10 -->
      <creative-data ref="creativeDataRef" :slot="getPosition(10)" 
        v-show="getChecked(10)" 
        v-loading="isloadingCreativeData" 
        title="创意Top10" 
        :values="creativeTableData" 
        @update="updateCreativeData()">
      </creative-data>
    </campaign-report-content>

  </div>
</template>


<script>
import { mapState, mapMutations, mapActions } from "vuex";
import _ from "lodash";

import campaignReportContent from "./campaign-report-content";

import advertiseType from "@/views/report/index/public/sub-type/advertise-type";
import creativeData from "@/views/report/index/public/sub-type/creative-data";
import creativeGroup from "@/views/report/index/public/sub-type/creative-group";
import crowdData from "@/views/report/index/public/sub-type/crowd-data";
import dataTrend from "@/views/report/index/public/sub-type/data-trend";
import dataType from "@/views/report/index/public/sub-type/data-type";
import devicePercent from "@/views/report/index/public/sub-type/device-percent";
import mediaType from "@/views/report/index/public/sub-type/media-type";
import pointPosition from "@/views/report/index/public/sub-type/point-position";
import regionType from "@/views/report/index/public/sub-type/region-type";

export default {
  name: "campaign-report",
  data() {
    return {
      loadingFullScreenText: "",

      isloading: true,
      isloadingTrendData: true,
      isloadingDevicePercent: { pie: true, line: true },
      isloadingAdvertiserType: true,
      isloadingMediaType: true,
      isloadingRegionType: true,
      isloadingPos: true,
      isloadingCrowd: true,
      isloadingCreativeGroup: true,
      isloadingCreativeData: true,
      fullscreenLoading: true,
      headerTitle: [
        "推广计划",
        "总预算",
        "消费",
        "展现量",
        "点击量",
        "CPM",
        "CTR",
        "CPC",
        "Leads",
        "CPL",
        "CR"
      ],
      campaignData: {},

      //推广计划数据趋势
      trendTitle: [],
      campaignDataTrend: {
        xAxisData: [],
        seriesData: [],
        multiaxis: false
      },

      //终端占比
      devicePercentData: {
        xAxisData: [],
        lineSeriesData: [],
        pieSeriesData: [],
        tabletData: []
      },

      //广告形式top5
      advertiseTypeData: {
        pieSeriesData: [],
        tabletData: []
      },

      //媒体top5
      mediaData: {
        pieSeriesData: [],
        tabletData: []
      },

      //地域top5
      regionData: {
        mapData: [],
        tableData: [],
        mapMax: 100
      },

      //点位top5
      pointPositionData: [],

      //人群top5
      crowdTitle: [],
      crowdGroupData: {
        xAxisData: [],
        lineSeriesData: [],
        tabletData: []
      },

      //创意组Top5
      creativeGroupTitle: [],
      creativeGroupData: {
        xAxisData: [],
        lineSeriesData: [],
        tabletData: []
      },

      //创意top10
      creativeTableData: []
    };
  },
  computed: {
    ...mapState({
      settings: state => state.report.settings.campaign, //每次获取settings都会执行此箭头函数
      campaign_report: state => state.report.campaign_report
    })
  },

  watch: {
    campaign_report: {
      handler: function(val) {
        this.fetch_get();
      },
      deep: true
    },

    $route: {
      handler: function(val) {
        if (val.name == "CampaignReport") {
          if (this.$route.query.dateValue == undefined) {
          } else {
            this.fetchFilterData();
          }
        }
      },
      deep: true
    }
  },

  methods: {
    ...mapMutations("report", [
      "ADD_CAMPAIGN_SETTING",
      "UPDATE_CAMPAIGN_SETTING",
      "UPDATE_CAMPAIGN_REPORT",
      "UPDATE_CURRENT_ROUTE"
    ]),
    ...mapActions("report", [
      "fetch_filter_data",
      "fetch_advertiser_data",
      "fetch_advertiser_trend_data",
      "fetch_device_percent_data",
      "fetch_advertiser_type_data",
      "fetch_media_type_data",
      "fetch_region_type_data",
      "fetch_point_position_data",
      "fetch_crowd_data",
      "fetch_creative_group_data",
      "fetch_creative_data"
    ]),

    getPosition(id) {
      return (
        this.settings.findIndex(function(item) {
          return item.id == id;
        }) + 2
      );
    },

    getChecked(id) {
      return this.settings.filter(item => item.id == id)[0].checked;
    },
    fetch_get() {
      this.fullscreenLoading = true;

      Promise.all([
        this.updateCampaignData({ currentPage: 1, limit: 5 }),
        this.updateDataTrendType(),
        this.updateDevicePercentType(),
        this.updateDevicePercentIndex(),
        this.updateAdvertiserType(),
        this.updateMediaType(),
        this.updateRegionType(),
        this.updatePointPosition(),
        this.updateCrowdData(),
        this.updateCreativeGroup(),
        this.updateCreativeData()
      ])
        .then(() => {
          this.fullscreenLoading = false;
        })
        .catch(err => {
          this.$message.error("网络请求超时，请刷新重试");
        });
    },

    async updateCampaignData(value) {
      this.isloading = true;
      await this.fetch_advertiser_data({
        page: value.currentPage,
        limit: value.limit,
        parentId: this.$route.query.parentId
      }).then(res => {
        this.campaignData = res;
        this.isloading = false;
      });
    },

    //更新state，并加载整个界面
    updateDateAndCampaign(value) {
      this.UPDATE_CAMPAIGN_REPORT(value);
    },
    //更新数据趋势 类型
    async updateDataTrendType() {
      //获取广告主数据趋势
      let type = "";
      this.isloadingTrendData = true;

      /*
           * 判断选择的广告主是几个，如果一个，则可以选多指标，并且折线图为双轴，
           * 如果多个，则只能选一个指标，折线图为单轴
           */
      if (this.campaign_report.filterValue.length == 1) {
        this.campaignDataTrend.multiaxis = true;
        type = this.$refs.dataTrendRef.multiFilterValue;
      } else {
        this.campaignDataTrend.multiaxis = false;
        type = this.$refs.dataTrendRef.filterValue;
      }

      await this.fetch_advertiser_trend_data({
        type: type,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingTrendData = false;
          this.campaignDataTrend.xAxisData = [];
          this.campaignDataTrend.seriesData = [];
          //this.UPDATE_CAMPAIGN_SETTING({id:2, checked:false, disabled:true});
          return;
        }
        //this.UPDATE_CAMPAIGN_SETTING({id:2, checked:true, disabled:false});
        let campaign_list = res.data.campaign_list;
        let xAxisData = res.data.date_arrange;
        let seriesData = [];

        for (let item in campaign_list) {
          this.trendTitle.push(campaign_list[item].name); //得到 折线图标题
          seriesData.push({
            name: campaign_list[item].name,
            data: campaign_list[item].value
          });
        }
        this.campaignDataTrend.xAxisData = xAxisData;
        this.campaignDataTrend.seriesData = seriesData;
        this.isloadingTrendData = false;
      });
    },

    //更新终端占比
    async updateDevicePercentType() {
      this.isloadingDevicePercent.pie = true;
      await this.fetch_device_percent_data({
        type: this.$refs.devicePercentRef.filterValue,
        index: "",
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingDevicePercent.pie = false;

          this.devicePercentData.pieSeriesData = [];
          this.devicePercentData.tabletData = [];
          this.UPDATE_CAMPAIGN_SETTING({
            id: 3,
            checked: false,
            disabled: true
          });
          return;
        }

        this.UPDATE_CAMPAIGN_SETTING({ id: 3, checked: true, disabled: false });
        let pieSeriesData = [];
        let tabletData = [];
        for (let item in res.data) {
          pieSeriesData.push({
            name: res.data[item].name,
            value: res.data[item].value
          });
          tabletData.push({
            top: res.data[item].top,
            name: res.data[item].name,
            value: res.data[item].value,
            percent: res.data[item].percent
          });
        }
        this.devicePercentData.pieSeriesData = pieSeriesData;
        this.devicePercentData.tabletData = tabletData;

        this.isloadingDevicePercent.pie = false;
      });
    },
    async updateDevicePercentIndex() {
      this.isloadingDevicePercent.line = true;
      await this.fetch_device_percent_data({
        type: "",
        index: this.$refs.devicePercentRef.indexValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingDevicePercent.line = false;

          this.devicePercentData.xAxisData = [];
          this.devicePercentData.lineSeriesData = [];
          this.UPDATE_CAMPAIGN_SETTING({
            id: 3,
            checked: false,
            disabled: true
          });
          return;
        }
        this.UPDATE_CAMPAIGN_SETTING({ id: 3, checked: true, disabled: false });

        let xAxisData = [];
        let seriesData = [];
        for (let item in res.data) {
          xAxisData.push(res.data[item].name);
          seriesData.push(res.data[item].value);
        }
        this.devicePercentData.xAxisData = xAxisData;
        this.devicePercentData.lineSeriesData = [
          { name:this.$refs.devicePercentRef.lineHeaders[0], data: seriesData }
        ];

        this.isloadingDevicePercent.line = false;
      });
    },

    //更新广告形式
    async updateAdvertiserType() {
      this.isloadingAdvertiserType = true;
      await this.fetch_advertiser_type_data({
        type: this.$refs.advertiseTypeRef.filterValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingAdvertiserType = false;

          this.advertiseTypeData.pieSeriesData = [];
          this.advertiseTypeData.tabletData = [];
          this.UPDATE_CAMPAIGN_SETTING({
            id: 4,
            checked: false,
            disabled: true
          });
          return;
        }

        this.UPDATE_CAMPAIGN_SETTING({ id: 4, checked: true, disabled: false });
        let pieSeriesData = [];
        let tabletData = [];
        for (let item in res.data) {
          pieSeriesData.push({
            name: res.data[item].name,
            value: res.data[item].value
          });
          tabletData.push({
            top: res.data[item].top,
            name: res.data[item].name,
            cost: res.data[item].value,
            percent: res.data[item].percent
          });
        }
        this.advertiseTypeData.pieSeriesData = pieSeriesData;
        this.advertiseTypeData.tabletData = tabletData;

        this.isloadingAdvertiserType = false;
      });
    },

    //更新媒体列表
    async updateMediaType() {
      this.isloadingMediaType = true;

      let filterValue = this.$refs.mediaTypeRef.filterValue;
      await this.fetch_media_type_data({
        type: filterValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingMediaType = false;

          this.mediaData.pieSeriesData = [];
          this.mediaData.tabletData = [];
          this.UPDATE_CAMPAIGN_SETTING({
            id: 5,
            checked: false,
            disabled: true
          });
          return;
        }
        this.UPDATE_CAMPAIGN_SETTING({ id: 5, checked: true, disabled: false });

        let pieSeriesData = [];
        let tabletData = [];
        for (let item in res.data) {
          if (filterValue == "1") {
            pieSeriesData.push({
              name: res.data[item].adform,
              value: res.data[item].cost
            });
          }
          if (filterValue == "2") {
            pieSeriesData.push({
              name: res.data[item].adform,
              value: res.data[item].pv
            });
          }
          if (filterValue == "3") {
            pieSeriesData.push({
              name: res.data[item].adform,
              value: res.data[item].click
            });
          }
          if (filterValue == "4") {
            pieSeriesData.push({
              name: res.data[item].adform,
              value: res.data[item].leads
            });
          }

          tabletData.push({
            top: res.data[item].top,
            adform: res.data[item].adform,
            cost: res.data[item].cost,
            pv: res.data[item].pv,
            click: res.data[item].click,
            ctr: res.data[item].ctr,
            cpc: res.data[item].cpc,
            leads: res.data[item].leads
          });
        }
        this.mediaData.pieSeriesData = pieSeriesData;
        this.mediaData.tabletData = tabletData;

        this.isloadingMediaType = false;
      });
    },

    //更新地域
    async updateRegionType() {
      this.isloadingRegionType = true;
      await this.fetch_region_type_data({
        type: this.$refs.regionTypeRef.filterValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingRegionType = false;

          this.regionData.mapData = [];
          this.regionData.tableData = [];
          this.regionData.mapMax = 100;
          this.UPDATE_CAMPAIGN_SETTING({
            id: 6,
            checked: false,
            disabled: true
          });
          return;
        }
        this.UPDATE_CAMPAIGN_SETTING({ id: 6, checked: true, disabled: false });

        let mapData = [];
        let tableData = [];

        //将地域中的省名全部转换为两个或三个字，不必显示自治区等
        res.data = _.map(res.data, item => {
          let name = item.name;
          if (name.search(/黑龙江/i) != -1 || name.search(/内蒙古/i) != -1) {
            return {
              top: item.top,
              name: name.substr(0, 3),
              value: item.value,
              percent: item.percent
            };
          } else {
            return {
              top: item.top,
              name: name.substr(0, 2),
              value: item.value,
              percent: item.percent
            };
          }
        });
        for (let item in res.data) {
          mapData.push({
            name: res.data[item].name,
            value: res.data[item].value
          });
        }
        this.regionData.mapData = mapData;
        this.regionData.tableData = res.data.slice(0, 5);

        let maxItem = _.max(res.data, function(item) {
          return +item.value;
        });

        this.regionData.mapMax = +maxItem.value;

        this.isloadingRegionType = false;
      });
    },

    //更新点位
    async updatePointPosition() {
      this.isloadingPos = true;
      await this.fetch_point_position_data({
        type: this.$refs.pointPositionRef.filterValue,
        media: this.$refs.pointPositionRef.mediaValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.pointPositionData = [];
          this.UPDATE_CAMPAIGN_SETTING({
            id: 7,
            checked: false,
            disabled: true
          });
        } else {
          this.UPDATE_CAMPAIGN_SETTING({
            id: 7,
            checked: true,
            disabled: false
          });
        }
        this.pointPositionData = res.data;

        this.isloadingPos = false;
      });
    },

    //更新人群列表
    async updateCrowdData() {
      this.isloadingCrowd = true;
      await this.fetch_crowd_data({
        type: this.$refs.crowdDataRef.filterValue,
        index: this.$refs.crowdDataRef.indexValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.tableData.length == 0) {
          this.UPDATE_CAMPAIGN_SETTING({
            id: 8,
            checked: false,
            disabled: true
          });

          this.crowdGroupData.lineSeriesData = [];
          this.crowdGroupData.xAxisData = [];
          this.crowdGroupData.tabletData = [];
          this.isloadingCrowd = false;
          return;
        }

        this.UPDATE_CAMPAIGN_SETTING({ id: 8, checked: true, disabled: false });
        let titles = [];
        let lineSeriesData = [];
        for (let item in res.data.crowd_list) {
          titles.push(res.data.crowd_list[item].name);
          lineSeriesData.push({
            name: res.data.crowd_list[item].name,
            data: res.data.crowd_list[item].value
          });
        }
        this.crowdTitle = titles;
        this.crowdGroupData.lineSeriesData = lineSeriesData;
        this.crowdGroupData.xAxisData = res.data.date_arrange;
        this.crowdGroupData.tabletData = res.data.tableData;

        this.isloadingCrowd = false;
      });
    },

    //更新创意组列表
    async updateCreativeGroup() {
      this.isloadingCreativeGroup = true;
      await this.fetch_creative_group_data({
        type: this.$refs.creativeGroupRef.filterValue,
        index: this.$refs.creativeGroupRef.indexValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.tableData.length == 0) {
          this.UPDATE_CAMPAIGN_SETTING({
            id: 9,
            checked: false,
            disabled: true
          });

          this.creativeGroupData.lineSeriesData = [];
          this.creativeGroupData.xAxisData = [];
          this.creativeGroupData.tabletData = [];
          this.isloadingCreativeGroup = false;
          return;
        }
        this.UPDATE_CAMPAIGN_SETTING({ id: 9, checked: true, disabled: false });
        let titles = [];
        let lineSeriesData = [];
        for (let item in res.data.crowd_list) {
          titles.push(res.data.crowd_list[item].name);
          lineSeriesData.push({
            name: res.data.crowd_list[item].name,
            data: res.data.crowd_list[item].value
          });
        }
        this.creativeGroupTitle = titles;
        this.creativeGroupData.lineSeriesData = lineSeriesData;
        this.creativeGroupData.xAxisData = res.data.date_arrange;
        this.creativeGroupData.tabletData = res.data.tableData;

        this.isloadingCreativeGroup = false;
      });
    },

    //更新创意 数据
    async updateCreativeData() {
      this.isloadingCreativeData = true;
      await this.fetch_creative_data({
        type: this.$refs.creativeDataRef.filterValue,
        parentId: this.$route.query.parentId
      }).then(res => {
        if (res.data.length == 0) {
          this.UPDATE_CAMPAIGN_SETTING({
            id: 10,
            checked: false,
            disabled: true
          });
          this.creativeTableData = [];
        } else {
          this.UPDATE_CAMPAIGN_SETTING({
            id: 10,
            checked: true,
            disabled: false
          });
        }
        this.creativeTableData = res.data;

        this.isloadingCreativeData = false;
      });
    },

    redirectToBrandNoItem() {
      this.fullscreenLoading = false;

      this.isloading = false;
      this.isloadingTrendData = false;

      this.isloadingDevicePercent.pie = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 3, checked: false, disabled: true });

      this.isloadingDevicePercent.line = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 3, checked: false, disabled: true });

      this.isloadingAdvertiserType = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 4, checked: false, disabled: true });

      this.isloadingMediaType = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 5, checked: false, disabled: true });

      this.isloadingRegionType = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 6, checked: false, disabled: true });

      this.isloadingPos = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 7, checked: false, disabled: true });

      this.isloadingCrowd = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 8, checked: false, disabled: true });

      this.isloadingCreativeGroup = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 9, checked: false, disabled: true });

      this.isloadingCreativeData = false;
      this.UPDATE_CAMPAIGN_SETTING({ id: 10, checked: false, disabled: true });
    },

    /**通过id来查找对应层级的id，以便在 自定义条件中 默认选中 */
    getFilterValueAndFilterKeyById(lists, id, grade, filterKey, filterValue) {
      let index = 0;
      for (let i = 0; i < lists.length; i++) {
        index++;
        if (grade == 1) {
          //找到id和value
          if (lists[i].id == id) {
            for (let j in lists[i].child) {
              filterKey.push(lists[i].child[j].key);
              filterValue.push(lists[i].child[j].id);
            }
          }
          continue;
        } else {
          debugger;
          this.getFilterValueAndFilterKeyById(
            lists[i].child,
            id,
            grade - 1,
            filterKey,
            filterValue
          );
        }
      }
      if (index == lists.length) {
        return;
      }
    },

    fetchFilterData() {
      this.fetch_filter_data({ parentId: this.$route.query.parentId })
        .then(res => {
          /**
         从项目层级进入，如果自定义列表为空，则重定向返回到品牌
         */
          if (res.data.length == 0) {
            if (this.$route.path.lastIndexOf("/ad/report") != -1) {
              let seconds = 5;
              let interval = setInterval(() => {
                this.loadingFullScreenText = `暂无推广计划记录,5秒后跳转至品牌报告...${seconds}s`;

                if (seconds == 0) {
                  clearInterval(interval);
                  this.$router.push({ path: "/ad/report/brand" });
                  this.redirectToBrandNoItem();
                }
                seconds = seconds - 1;
              }, 1000);
              return;
            }
          }
          const end = new Date();
          const start = new Date();
          end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

          const defaultStart = this.$formatDate(start, "yyyy-MM-dd");
          const defaultend = this.$formatDate(end, "yyyy-MM-dd");

          if (this.$route.query.parentId == undefined) {
            //
            this.UPDATE_CAMPAIGN_REPORT({
              filterList: res.data,
              filterValue: [],
              filterKey: [],
              dateValue: [defaultStart, defaultend]
            });
          } else {
            // 下钻，需要默认选择 filter
            let filterValue = [];
            let filterKey = [];

            this.getFilterValueAndFilterKeyById(
              res.data,
              this.$route.query.parentId,
              5,
              filterKey,
              filterValue
            );

            this.UPDATE_CAMPAIGN_REPORT({
              filterList: res.data,
              filterValue,
              filterKey,
              dateValue: this.$route.query.dateValue
            });
          }
        })
        .catch(err => {
          this.$message.error("网络请求超时，请刷新重试");
        });
    }
  },
  created() {
    let localSettings = [
      { id: 3, name: "终端占比", checked: true },
      { id: 4, name: "广告形式Top5", checked: true },
      { id: 5, name: "媒体Top5", checked: true },
      { id: 6, name: "地域Top5", checked: true },
      { id: 7, name: "点位Top10", checked: true },
      { id: 8, name: "人群Top5", checked: true },
      { id: 9, name: "创意组Top5", checked: true },
      { id: 10, name: "创意Top10", checked: true }
    ];

    // this.UPDATE_CURRENT_ROUTE(this.$route.path);
    this.ADD_CAMPAIGN_SETTING(localSettings);

    this.fetchFilterData();
  },

  components: {
    campaignReportContent,
    dataType,
    dataTrend,
    devicePercent,
    advertiseType,
    mediaType,
    regionType,
    pointPosition,
    crowdData,
    creativeGroup,
    creativeData
  }
};
</script>
<style scoped>
.hy-card__header {
  border-bottom: 0;
}

.hy-card__content {
  padding: 0;
}

.divide {
  padding: 5px;
  background-color: #f0f2f5;
}

.pie-table {
  width: 50%;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  top: 50px;
}

#device-percent {
  margin: 10px 0;
  width: 100%;
  height: 250px;
}
</style>


