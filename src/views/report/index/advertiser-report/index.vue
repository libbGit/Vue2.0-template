<template>
  <div>
    <advertiser-report-content 
      v-loading.fullscreen.lock="fullscreenLoading">
      
      <!-- 广告主数据 -->
      <data-type :slot="0" 
        v-loading="isloading" 
        title="广告主数据" 
        :headers="headerTitle" 
        :values="advertiserData" 
        @update="updateDateAndAdvertiser($event)"
        @pageChange="updateAdvertiserData($event)">
      </data-type>

      <!-- 广告主数据趋势 -->
      <data-trend ref="dataTrendRef" :slot="1" 
        v-loading="isloadingTrendData" 
        title="广告主数据趋势" 
        :headers="trendTitle" 
        :values="advertiserDataTrend" 
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
    </advertiser-report-content>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import _ from "lodash";

import advertiserReportContent from "./advertiser-report-content";

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
  name: "advertiser-report",

  data() {
    return {
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
        "广告主",
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
      advertiserData: {},

      //广告主数据趋势
      trendTitle: [],
      advertiserDataTrend: {
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
      creativeTableData: [],


      // initElSelectedValue:{   //下拉框选项初始值
      //   device_percent:{
      //     filterValue: '1',
      //     indexValue: '5',
      //     headerName:'CPC'
      //   },
      //   advertise_type:{
      //     filterValue:'1'
      //   },
      //   media_type:{
      //     filterValue:'1'
      //   },
      //   region_type:{
      //     filterValue: '1'
      //   },
      //   point_position:{
      //     filterValue: '1',
      //     mediaValue: ''
      //   },
      //   crowd_data:{
      //     filterValue: '1',
      //     indexValue: '1'
      //   },
      //   creative_group:{
      //     filterValue: '1',
      //     indexValue: '1'
      //   },
      //   creative_data:{
      //     filterValue:'1'
      //   }
      // }
    };
  },
  computed: {
    ...mapState({
      settings: state => state.report.settings.advertiser, //每次获取settings都会执行此箭头函数
      advertiser_report: state => state.report.advertiser_report
    })
  },

  watch: {
    advertiser_report: {
      handler: function(val) {
        this.fetch_get();
      },
      deep: true
    }
  },

  methods: {
    ...mapMutations("report", [
      "ADD_ADVERTOSER_SETTING",
      "UPDATE_ADVERTOSER_SETTING",
      "UPDATE_ADVERTISER_REPORT",
      "UPDATE_CURRENT_ROUTE",
      // "UPDATE_ADVERTISER_EL_SELECTS"
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

    /*当前模块的顺序*/
    getPosition(id) {
      return (
        this.settings.findIndex(function(item) {
          return item.id == id;
        }) + 2
      );
    },

    /*当前模块是否显示 */
    getChecked(id) {
      return this.settings.filter(item => item.id == id)[0].checked;
    },

    fetch_get() {
      this.fullscreenLoading = true;

      //更新 报告页面所选择的select下拉框的值
      // this.UPDATE_ADVERTISER_EL_SELECTS(this.initElSelectedValue);

      Promise.all([
        this.updateAdvertiserData({ currentPage: 1, limit: 5 }),
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

    async updateAdvertiserData(value) {
      this.isloading = true;
      await this.fetch_advertiser_data({
        page: value.currentPage,
        limit: value.limit
      }).then(res => {
        this.advertiserData = res;
        this.isloading = false;
      });
    },

    //更新state，并加载整个界面
    updateDateAndAdvertiser(value) {
      this.UPDATE_ADVERTISER_REPORT(value);
    },

    //更新数据趋势 类型
    async updateDataTrendType() {
      let type = "";
      this.isloadingTrendData = true;

      /*
           * 判断选择的广告主是几个，如果一个，则可以选多指标，并且折线图为双轴，
           * 如果多个，则只能选一个指标，折线图为单轴
           */
      if (this.advertiser_report.filterValue.length == 1) {
        this.advertiserDataTrend.multiaxis = true;
        type = this.$refs.dataTrendRef.multiFilterValue;
      } else {
        this.advertiserDataTrend.multiaxis = false;
        type = this.$refs.dataTrendRef.filterValue;
      }

      await this.fetch_advertiser_trend_data({ type: type }).then(res => {
        if (res.data.length == 0) {
          this.isloadingTrendData = false;
          this.advertiserDataTrend.xAxisData = [];
          this.advertiserDataTrend.seriesData = [];
          // this.UPDATE_ADVERTOSER_SETTING({id:2, checked:false, disabled:true});
          return;
        }

        // this.UPDATE_ADVERTOSER_SETTING({id:2, checked:true, disabled:false});

        let advertiser_list = res.data.advertiser_list;
        let xAxisData = res.data.date_arrange;
        let seriesData = [];

        for (let item in advertiser_list) {
          this.trendTitle.push(advertiser_list[item].name); //得到 折线图标题
          seriesData.push({
            name: advertiser_list[item].name,
            data: advertiser_list[item].value
          });
        }
        this.advertiserDataTrend.xAxisData = xAxisData;
        this.advertiserDataTrend.seriesData = seriesData;
        this.isloadingTrendData = false;
      });
    },

    //更新终端占比
    async updateDevicePercentType() {
      this.isloadingDevicePercent.pie = true;

      //更新下拉列表值
      // let el_selected_value = _.cloneDeep(this.initElSelectedValue);
      // el_selected_value.device_percent.filterValue = this.$refs.devicePercentRef.filterValue;
      // this.UPDATE_ADVERTISER_EL_SELECTS(el_selected_value);

      await this.fetch_device_percent_data({
        type: this.$refs.devicePercentRef.filterValue,
        index: ""
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingDevicePercent.pie = false;

          this.devicePercentData.pieSeriesData = [];
          this.devicePercentData.tabletData = [];

          this.UPDATE_ADVERTOSER_SETTING({
            id: 3,
            checked: false,
            disabled: true
          });
          return;
        }

        this.UPDATE_ADVERTOSER_SETTING({
          id: 3,
          checked: true,
          disabled: false
        });
        let pieSeriesData = [];
        let tabletData = [];
        for (let item in res.data) {
          pieSeriesData.push({
            name: res.data[item].name,
            value: res.data[item].value,
            percent: res.data[item].percent
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

      // this.initElSelectedValue.device_percent.indexValue = this.$refs.devicePercentRef.indexValue;
      // this.initElSelectedValue.device_percent.headerName = this.$refs.devicePercentRef.lineHeaders[0];
      // await this.UPDATE_ADVERTISER_EL_SELECTS(this.initElSelectedValue);
      await this.fetch_device_percent_data({
        type: "",
        index: this.$refs.devicePercentRef.indexValue,
      }).then(res => {
        if (res.data.length == 0) {
          this.isloadingDevicePercent.line = false;

          this.devicePercentData.xAxisData = [];
          this.devicePercentData.lineSeriesData = [];

          this.UPDATE_ADVERTOSER_SETTING({
            id: 3,
            checked: false,
            disabled: true
          });
          return;
        }

        this.UPDATE_ADVERTOSER_SETTING({
          id: 3,
          checked: true,
          disabled: false
        });

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
      await this.fetch_advertiser_type_data({ type: this.$refs.advertiseTypeRef.filterValue}).then(
        res => {
          if (res.data.length == 0) {
            this.isloadingAdvertiserType = false;

            this.advertiseTypeData.pieSeriesData = [];
            this.advertiseTypeData.tabletData = [];

            this.UPDATE_ADVERTOSER_SETTING({
              id: 4,
              checked: false,
              disabled: true
            });
            return;
          }

          this.UPDATE_ADVERTOSER_SETTING({
            id: 4,
            checked: true,
            disabled: false
          });

          let pieSeriesData = [];
          let tabletData = [];
          for (let item in res.data) {
            pieSeriesData.push({
              name: res.data[item].name,
              value: res.data[item].value,
              percent: res.data[item].percent
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
        }
      );
    },

    //更新媒体列表
    async updateMediaType() {
      this.isloadingMediaType = true;
      let filterValue = this.$refs.mediaTypeRef.filterValue;
      await this.fetch_media_type_data({ type: filterValue }).then(
        res => {
          if (res.data.length == 0) {
            this.isloadingMediaType = false;

            this.mediaData.pieSeriesData = [];
            this.mediaData.tabletData = [];

            this.UPDATE_ADVERTOSER_SETTING({
              id: 5,
              checked: false,
              disabled: true
            });
            return;
          }

          this.UPDATE_ADVERTOSER_SETTING({
            id: 5,
            checked: true,
            disabled: false
          });

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
        }
      );
    },

    //更新地域
    async updateRegionType() {
      this.isloadingRegionType = true;
      await this.fetch_region_type_data({ type: this.$refs.regionTypeRef.filterValue }).then(
        res => {
          if (res.data.length == 0) {
            this.isloadingRegionType = false;

            this.regionData.mapData = [];
            this.regionData.tableData = [];
            this.regionData.mapMax = 100;

            this.UPDATE_ADVERTOSER_SETTING({
              id: 6,
              checked: false,
              disabled: true
            });
            return;
          }

          this.UPDATE_ADVERTOSER_SETTING({
            id: 6,
            checked: true,
            disabled: false
          });

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
        }
      );
    },

    //更新点位
    async updatePointPosition() {
      this.isloadingPos = true;
      await this.fetch_point_position_data({
        type: this.$refs.pointPositionRef.filterValue,
        media: this.$refs.pointPositionRef.mediaValue
      }).then(res => {
        if (res.data.length == 0) {
          this.pointPositionData = [];
          this.UPDATE_ADVERTOSER_SETTING({
            id: 7,
            checked: false,
            disabled: true
          });
        } else {
          this.UPDATE_ADVERTOSER_SETTING({
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
        index: this.$refs.crowdDataRef.indexValue
      }).then(res => {
        if (res.data.tableData.length == 0) {
          this.UPDATE_ADVERTOSER_SETTING({
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

        this.UPDATE_ADVERTOSER_SETTING({
          id: 8,
          checked: true,
          disabled: false
        });
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
        index: this.$refs.creativeGroupRef.indexValue
      }).then(res => {
        if (res.data.tableData.length == 0) {
          this.UPDATE_ADVERTOSER_SETTING({
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
        this.UPDATE_ADVERTOSER_SETTING({
          id: 9,
          checked: true,
          disabled: false
        });

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
        type: this.$refs.creativeDataRef.filterValue
      }).then(res => {
        if (res.data.length == 0) {
          this.UPDATE_ADVERTOSER_SETTING({
            id: 10,
            checked: false,
            disabled: true
          });

          this.creativeTableData = [];
        } else {
          this.UPDATE_ADVERTOSER_SETTING({
            id: 10,
            checked: true,
            disabled: false
          });
        }

        this.creativeTableData = res.data;

        this.isloadingCreativeData = false;
      });
    }
  },
  created() {
    let localSettings = [
      { id: 3, name: "终端占比", checked: true, disabled: false },
      { id: 4, name: "广告形式Top5", checked: true, disabled: false },
      { id: 5, name: "媒体Top5", checked: true, disabled: false },
      { id: 6, name: "地域Top5", checked: true, disabled: false },
      { id: 7, name: "点位Top10", checked: true, disabled: false },
      { id: 8, name: "人群Top5", checked: true, disabled: false },
      { id: 9, name: "创意组Top5", checked: true, disabled: false },
      { id: 10, name: "创意Top10", checked: true, disabled: false }
    ];

    // this.UPDATE_CURRENT_ROUTE(this.$route.path); //  ad/report/advertiser
    this.ADD_ADVERTOSER_SETTING(localSettings);

    //初始化获取自定义条件列表
    this.fetch_filter_data({ parentId: "" })
      .then(res => {
        // let list = [];
        // for (let item in res.data) {
        //   list.push({ id: res.data[item].id, name: res.data[item].name });
        // }

        //时间默认为7天
        const end = new Date();
        const start = new Date();
        end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

        const defaultStart = this.$formatDate(start, "yyyy-MM-dd");
        const defaultend = this.$formatDate(end, "yyyy-MM-dd");

        this.UPDATE_ADVERTISER_REPORT({
          filterList: res.data,
          filterValue: [],
          filterKey: [],
          dateValue: [defaultStart, defaultend]
        });
      })
      .catch(err => {
        this.$message.error("网络请求超时，请刷新重试");
      });
  },

  components: {
    advertiserReportContent,
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


