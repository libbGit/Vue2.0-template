<template>
    <div>
        <div>
            <div class="hy-card__header clearfix">
                <label>{{title}}</label>
                <div class="pull-right" :inline="true">
                    <el-popover ref="filterOptions" 
                        v-model="isFilterShow" 
                        placement="bottom-end" 
                        width="550" 
                        trigger="click" 
                        popper-class="filter-popper"
                        transition="el-zoom-in-top"
                        @show="show()"
                        >
                        <div>
                            <!-- <el-transfer 
                                :data="filterList" 
                                v-model="filterValue" 
                                :props="{
                                    key: 'id',
                                    label: 'name'
                                }"
                                :titles="['请选择', '已选']" 
                                :button-texts="['到左边', '到右边']" 
                                :format="{
                                    noChecked: '${total}',
                                    hasChecked: '${checked}/${total}'
                                }">
                            </el-transfer>
                            <div style="float:right">
                                <el-button type="primary" size="mini" @click="save">保存</el-button>
                                <el-button size="mini" @click="cancel">取消</el-button>
                            </div> -->
                            <div>
                                <div style="width:240px;float: left;   border: 1px solid #dedede;">
                                    <div style="height: 28px;    padding: 0 10px;line-height: 2; background-color: #fafafa; border-bottom: 1px #eee solid">请选择
                                    <div class="pull-right" :inline="true">
                                        <el-button type="text" size="mini" @click="selectAll">全选</el-button>
                                        <span> - </span>
                                        <el-button  type="text" size="mini" @click="reset">重置</el-button>
                                    </div>
                                    </div>
                                    
                                    <div style="height: 400px; overflow: auto;">
                                        <el-tree
                                            :data="filterList"
                                            show-checkbox
                                            node-key="key"
                                            ref="tree"
                                            highlight-current
                                            :props="defaultProps"
                                            :default-checked-keys="selectedKeys"
                                        >
                                        </el-tree>
                                    </div>
                                </div>
                                
                                <div style="width:55px;float:left;margin: 0px 5px;">
                                    <el-button type="primary" size="mini" @click="selectKeys">添加</el-button>
                                </div>

                                <div style="width:240px;float: left;border: 1px solid #dedede;">
                                    <div style="height: 28px;    padding: 0 10px;line-height: 2; background-color: #fafafa; border-bottom: 1px #eee solid">
                                    已选 
                                    ({{this.selectedKeys.length}})
                                        <div class="pull-right" :inline="true">
                                            <el-button type="text" size="mini" @click="clearAll">清空</el-button>
                                        </div>
                                    </div>
                                    <div style="height: 400px; overflow: auto ;">
                                        <div>
                                          <el-tree
                                            :data="filterList"
                                            default-expand-all
                                            node-key="key"
                                            ref="selectedTree"
                                            highlight-current
                                            :props="defaultProps"
                                            :filter-node-method="filterNode"
                                            :render-content="renderContent"
                                            >
                                          </el-tree>
                                        </div>
                                    </div>
                                </div>
                                <div style="float:right;margin-top: 10px;">
                                    <el-button type="primary" size="mini" @click="save">保存</el-button>
                                    <el-button size="mini" @click="cancel">取消</el-button>
                                </div>
                            </div>
                        </div>
                    </el-popover>
                    <el-button v-popover:filterOptions size="mini">自定义条件
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-date-picker size="mini" 
                        v-model="dateValue" 
                        type="daterange" 
                        align="right" 
                        unlink-panels 
                        range-separator="至" 
                        start-placeholder="开始日期" 
                        end-placeholder="结束日期" 
                        :picker-options="pickerOptions" 
                        value-format="yyyy-MM-dd" @change="changeDate()">
                    </el-date-picker>
                </div>
            </div>
            <div class="hy-card__content">
                <el-popover
                  ref="helpTicket"
                  placement="bottom"
                  title="说明"
                  width="200"
                  trigger="click"
                  content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                </el-popover>
                <el-table border size="mini" :data="values.data" style="width: 100%">
                    <el-table-column header-align="center" align="left" prop="name" :label="headers[0]" width="300">
                        <template slot-scope="scope">
                            <el-button v-if="currentRoute!='campaign'" type="text" size="mini" @click="redirectPage(scope.row)" >
                                {{scope.row['name']}}
                            </el-button>
                            <span v-else>
                              {{scope.row['name']}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" prop="budget" :label="headers[1]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['budget'],2,'¥')}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="cost" :label="headers[2]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['cost'],2,'¥')}}
                            <div v-if="parseFloat(scope.row['prev_cost'])>0" style="color:red">
                                <i class="el-icon-caret-top"></i>{{scope.row['prev_cost']}}%
                            </div>
                            <div v-else style="color:green">
                                <i class="el-icon-caret-bottom"></i>{{scope.row['prev_cost']}}%
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="pv" :label="headers[3]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['pv'],0,'')}}
                            <div v-if="parseFloat(scope.row['prev_pv'])>0" style="color:red">
                                <i class="el-icon-caret-top"></i>{{scope.row['prev_pv']}}%
                            </div>
                            <div v-else style="color:green">
                                <i class="el-icon-caret-bottom"></i>{{scope.row['prev_pv']}}%
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="click" :label="headers[4]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['click'],0,'')}}
                            <div v-if="parseFloat(scope.row['prev_click'])>0" style="color:red">
                                <i class="el-icon-caret-top"></i>{{scope.row['prev_click']}}%
                            </div>
                            <div v-else style="color:green">
                                <i class="el-icon-caret-bottom"></i>{{scope.row['prev_click']}}%
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="cpm" :label="headers[5]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['cpm'],2,'¥')}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="ctr" :label="headers[6]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['ctr'],2,'')}}%
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="cpc" :label="headers[7]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['cpc'],2,'¥')}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="leads" :label="headers[8]">
                        <template slot-scope="scope">
                            {{scope.row['leads']}}
                            <div v-if="parseFloat(scope.row['prev_leads'])>0" style="color:red">
                                <i class="el-icon-caret-top"></i>{{scope.row['prev_leads']}}%
                            </div>
                            <div v-else style="color:green">
                                <i class="el-icon-caret-bottom"></i>{{scope.row['prev_leads']}}%
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="cpl" :label="headers[9]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['cpl'],2,'¥')}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="right" prop="cr" :label="headers[10]">
                        <template slot-scope="scope">
                            {{$formatMoney(scope.row['cr'],2,'')}}%
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrap clearfix">
                    <el-pagination class="pull-right" 
                        layout="total, prev, pager, next" 
                        :total="getTotal" 
                        :current-page="currentPage" 
                        :page-size="pageSize" 
                        @current-change="handle_page_change">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="divide"></div>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "data-type", //广告主数据，品牌数据，，，，
  props: {
    title: {
      //标题
      type: String,
      required: true
    },
    headers: {
      //表格的标题
      type: Array,
      required: true
    },
    values: {
      //表格数据
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterList: [], //自定义条件的值
      filterValue: [], //已选择的keys
      isFilterShow: false,

      selectedKeys: [],
      selectedIds: [],

      defaultProps: {
        children: "child",
        label: "name"
      },

      dateValue: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000; //禁用今天
        },
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      currentPage: 1,
      pageSize: 5
    };
  },

  computed: {
    ...mapState({
      advertiser_report: state => state.report.advertiser_report,
      brand_report: state => state.report.brand_report,
      productline_report: state => state.report.productline_report,
      project_report: state => state.report.project_report,
      activity_report: state => state.report.activity_report,
      campaign_report: state => state.report.campaign_report,
      currentRoute: state => state.report.currentRoute
    }),

    getTotal() {
      return +this.values.total;
    },

    getHelpInfo() {
      if (this.currentRoute == "advertiser") {
        return "点击进入该广告主的品牌层级";
      }
      if (this.currentRoute == "brand") {
        return "点击进入该品牌的产品线报告，如无产品线则进入该品牌的项目报告";
      }
      if (this.currentRoute == "productline") {
        return "点击进入该产品线下项目报告";
      }
      if (this.currentRoute == "project") {
        return "点击进入该项目的活动层级报告";
      }
      if (this.currentRoute == "activity") {
        return "点击进入该活动下的推广计划";
      }
    }
  },

  watch: {
    $route: {
      handler: function(val) {
        if (val.query.dateValue != undefined) {
          this.dateValue = _.cloneDeep(val.query.dateValue);
        }
      },
      deep: true
    }
  },

  methods: {
    redirectPage(row) {
      let route = "";
      if (this.$route.path.indexOf("ad/report") != -1) {
        //从项目层级进入    /ad/report/advertiser

        if (this.currentRoute == "advertiser") {
          route = "/ad/report/brand";
        }
        if (this.currentRoute == "brand") {
          route = "/ad/report/productline";
        }
        if (this.currentRoute == "productline") {
          route = "/ad/report/project";
        }
        if (this.currentRoute == "project") {
          route = "/ad/report/activity";
        }
        if (this.currentRoute == "activity") {
          route = "/ad/report/campaign";
        }
      } else {
        if (this.currentRoute == "advertiser") {
          route = "/report/brand";
        }
        if (this.currentRoute == "brand") {
          route = "/report/productline";
        }
        if (this.currentRoute == "productline") {
          route = "/report/project";
        }
        if (this.currentRoute == "project") {
          route = "/report/activity";
        }
        if (this.currentRoute == "activity") {
          route = "/report/campaign";
        }
      }

      this.$router.push({
        path: route,
        query: { parentId: row.id, dateValue: this.dateValue }
      });
    },

    getDefaultCheckedKeys() {
      return this.selectedKeys;
    },
    save() {
      this.isFilterShow = false;

      this.selectedIds = [];
      if (this.selectedKeys.length != 0) {
        for (let i in this.selectedKeys) {
          this.findIdsByKeys(this.filterList, this.selectedKeys[i]); //通过keys将id找出来
        }
      }

      //更新parentid

      // this.$route.query.parentId =

      this.$emit("update", {
        filterValue: this.selectedIds,
        filterKey: this.selectedKeys
      });
    },

    changeDate() {
      this.$emit("update", {
        dateValue: this.dateValue
      });
    },

    cancel() {
      this.isFilterShow = false;
    },

    show() {
      this.getFilterList();
      this.$nextTick(() => {
        // 等待filterList更新到tree dom data上之后，再执行过滤
        this.$refs.selectedTree.filter(this.filterKey);
      });
    },

    selectAll() {
      this.$refs.tree.setCheckedNodes(this.filterList);
    },

    reset() {
      this.$refs.tree.setCheckedNodes([]);
    },

    clearAll() {
      this.selectedKeys = [];
      this.$refs.selectedTree.filter(this.selectedKeys);
    },

    remove(node, data) {
      let index = this.selectedKeys.indexOf(data.key);
      this.selectedKeys.splice(index, 1);
      this.$refs.selectedTree.filter(this.selectedKeys);
    },

    /*
     * 从state获取 自定义列表
     */
    getFilterList() {
      let route = this.$route.path.substring(
        this.$route.path.lastIndexOf("/") + 1
      );
      switch (route) {
        case "advertiser":
          this.filterList = _.cloneDeep(this.advertiser_report.filterList);
          this.filterValue = _.cloneDeep(this.advertiser_report.filterValue);
          this.filterKey = _.cloneDeep(this.advertiser_report.filterKey);
          break;
        case "brand":
          this.filterList = _.cloneDeep(this.brand_report.filterList);
          this.filterValue = _.cloneDeep(this.brand_report.filterValue);
          this.filterKey = _.cloneDeep(this.brand_report.filterKey);
          break;
        case "productline":
          this.filterList = _.cloneDeep(this.productline_report.filterList);
          this.filterValue = _.cloneDeep(this.productline_report.filterValue);
          this.filterKey = _.cloneDeep(this.productline_report.filterKey);
          break;
        case "project":
          this.filterList = _.cloneDeep(this.project_report.filterList);
          this.filterValue = _.cloneDeep(this.project_report.filterValue);
          this.filterKey = _.cloneDeep(this.project_report.filterKey);
          break;
        case "activity":
          this.filterList = _.cloneDeep(this.activity_report.filterList);
          this.filterValue = _.cloneDeep(this.activity_report.filterValue);
          this.filterKey = _.cloneDeep(this.activity_report.filterKey);
          break;
        case "campaign":
          this.filterList = _.cloneDeep(this.campaign_report.filterList);
          this.filterValue = _.cloneDeep(this.campaign_report.filterValue);
          this.filterKey = _.cloneDeep(this.campaign_report.filterKey);
          break;
      }

      this.selectedKeys = _.cloneDeep(this.filterKey);
    },

    handle_page_change(currentpage) {
      this.currentPage = currentpage;
      this.$emit("pageChange", {
        currentPage: this.currentPage,
        limit: this.pageSize
      });
    },

    //获取左侧树真实选中Key值
    selectKeys() {
      this.selectedKeys = this.$refs.tree.getCheckedKeys(true);
      this.$refs.selectedTree.filter(this.selectedKeys);
    },
    filterNode(value, data) {
      if (!value) return true;
      return value.indexOf(data.key) !== -1;
    },
    renderContent(h, { node, data, store }) {
      if (data.child && data.child.length > 0) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span />
          </span>
        );
      } else {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.remove(node, data)}
              >
                删除
              </el-button>
            </span>
          </span>
        );
      }
    },

    /**深度遍历自定义列表，通过keys找出id值 */
    findIdsByKeys(lists, key) {
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].child == undefined || lists[i].child == null) {
          if (lists[i].key == key) {
            this.selectedIds.push(lists[i].id);
          }
          continue;
        } else {
          this.findIdsByKeys(lists[i].child, key);
        }
      }
    }

    
  },
  created() {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() - 3600 * 1000 * 24);
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

    const defaultStart = this.$formatDate(start, "yyyy-MM-dd");
    const defaultend = this.$formatDate(end, "yyyy-MM-dd");

    if (this.$route.query.dateValue != undefined) {
      this.dateValue = _.cloneDeep(this.$route.query.dateValue);
    } else {
      this.dateValue = [defaultStart, defaultend];
    }

    this.filterKey = [];
    this.filterValue = [];
    // this.getFilterList();
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

.tb-name-column {
  color: blue;
}

.divide {
  padding: 5px;
  background-color: #f0f2f5;
}

.filter-popper {
  padding: 0 !important;
}

.info-ticket {
  cursor: help;
}
</style>




