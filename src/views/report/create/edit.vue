<template>
    <div class="hy-card">
        <div class="form-wrap">
            <h2>复制报告</h2>
            <el-form class="form-container1"
                v-loading.fullscreen.lock="fullscreenLoading" 
                :element-loading-text="loadingFullScreenText"
                size="mini"
                ref="form"
                :model="form"
                :rules="rules"
                label-width="140px">

                <el-form-item prop="times_ranges"
                    label="时间范围：">
                    <el-date-picker :key="1"
                        v-model="form.times_ranges"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        @change="setReportName">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="time_type"
                    label="时间单位：">
                    <el-radio-group v-model="form.time_type">
                        <el-radio :label="1"
                            :key="1"
                            value="1">合计</el-radio>
                        <el-radio :label="2"
                            :key="2"
                            value="2">分日</el-radio>
                        <el-radio :label="3"
                            :key="3"
                            value="2">分周</el-radio>
                        <el-radio :label="4"
                            :key="4"
                            value="4">分月</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="报告类型："
                    prop="report_type_sel">
                    <el-radio-group v-model="form.report_type_sel"
                        :min="1"
                        @change="setReportName">
                        <el-radio-button label="basic"
                            border>基础报告</el-radio-button>
                        <el-radio-button label="media"
                            border>媒体报告</el-radio-button>
                        <el-radio-button label="direct"
                            border>定向报告</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label=""
                    prop="report_type">
                    <el-radio-group v-if="form.report_type_sel == 'basic'"
                        v-model.number="form.basic_1"
                        size="mini"
                        @change="setReportName">
                        <el-radio :label="1"
                            border>广告主报告</el-radio>
                        <el-radio :label="2"
                            border>品牌报告</el-radio>
                        <el-radio :label="3"
                            border>产品线报告</el-radio>
                        <el-radio :label="4"
                            border>项目报告</el-radio>
                        <el-radio :label="5"
                            border>活动报告</el-radio>
                        <el-radio :label="6"
                            border>推广计划报告</el-radio>
                        <el-radio :label="7"
                            border>创意组报告</el-radio>
                        <el-radio :label="8"
                            border>创意报告</el-radio>
                    </el-radio-group>
                    <el-radio-group v-if="form.report_type_sel == 'media'"
                        v-model.number="form.media_1"
                        size="mini"
                        @change="setReportName">
                        <el-radio :label="9"
                            border>媒体报告</el-radio>
                        <el-radio :label="10"
                            border>点位报告</el-radio>
                    </el-radio-group>
                    <el-radio-group v-if="form.report_type_sel == 'direct'"
                        v-model.number="form.direct_1"
                        size="mini"
                        @change="setReportName">
                        <el-radio :label="11"
                            border>地域报告</el-radio>
                        <el-radio :label="12"
                            border>人群报告</el-radio>
                        <el-radio :label="13"
                            border>平台设备报告</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.basic_1 || form.media_1 || form.direct_1 "
                    label="查询层级："
                    prop="select_type">
                    <el-radio-group v-if="form.report_type_sel == 'basic'"
                        v-model.number="form.select_type"
                        size="mini"
                        @change="fetch_report_getTypeData">
                        <el-radio :label="1"
                            border>广告主</el-radio>
                        <el-radio v-if="[2,3].indexOf(form.basic_1) >= 0"
                            :label="2"
                            border>品牌</el-radio>
                        <el-radio v-if="[3].indexOf(form.basic_1)>=0"
                            :label="3"
                            border>产品线</el-radio>
                        <el-radio v-if="[4,5,6,7,8].indexOf(form.basic_1)>=0"
                            :label="4"
                            border>项目</el-radio>
                        <el-radio v-if="[5,6,7,8].indexOf(form.basic_1)>=0"
                            :label="5"
                            border>活动</el-radio>
                        <el-radio v-if="[6,7,8].indexOf(form.basic_1)>=0"
                            :label="6"
                            border>推广计划</el-radio>
                        <el-radio v-if="[7,8].indexOf(form.basic_1)>=0"
                            :label="7"
                            border>创意组</el-radio>
                        <el-radio v-if="[8].indexOf(form.basic_1)>=0"
                            :label="8"
                            border>创意</el-radio>
                    </el-radio-group>
                    <el-radio-group v-if="form.report_type_sel == 'media'"
                        v-model.number="form.select_type"
                        size="mini"
                        @change="fetch_report_getTypeData">
                        <el-radio :label="1"
                            border>广告主</el-radio>
                        <el-radio :label="2"
                            border>品牌</el-radio>
                        <el-radio :label="3"
                            border>产品线</el-radio>
                        <el-radio :label="4"
                            border>项目</el-radio>
                        <el-radio :label="5"
                            border>活动</el-radio>
                        <el-radio :label="6"
                            border>推广计划</el-radio>
                        <el-radio :label="7"
                            border>创意组</el-radio>
                        <el-radio :label="8"
                            border>创意</el-radio>
                    </el-radio-group>
                    <el-radio-group v-if="form.report_type_sel == 'direct'"
                        v-model.number="form.select_type"
                        size="mini"
                        @change="fetch_report_getTypeData">
                        <el-radio :label="1"
                            border>广告主</el-radio>
                        <el-radio :label="4"
                            border>项目</el-radio>
                        <el-radio :label="5"
                            border>活动</el-radio>
                        <el-radio v-if="form.direct_1==11"
                            :label="6"
                            border>推广计划</el-radio>
                        <el-radio v-if="form.direct_1==11"
                            :label="7"
                            border>创意组</el-radio>
                        <el-radio v-if="form.direct_1==11"
                            :label="8"
                            border>创意</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label=""
                    v-if="form.basic_1 || form.media_1 || form.direct_1 ">
                    <div style="margin-top: 10px;height: 400px; ">
                        <div style="float: left; border: 1px solid #eee">
                            <div style="padding: 10px; background-color: #fafafa; line-height: 32px; border-bottom: 1px #eee solid">请选择
                                <div class="pull-right"
                                    :inline="true">
                                    <el-button @click="setCheckedAll"
                                        type="text">全选</el-button>
                                    <span> - </span>
                                    <el-button @click="removeCheckedAll"
                                        type="text">重置</el-button>
                                </div>
                            </div>
                            <div style="padding: 10px; height: 40px;">
                                <el-input placeholder="请输入内容"
                                    prefix-icon="el-icon-search"
                                    v-model="filterText_L"
                                    prop="search">
                                </el-input>
                            </div>
                            <div style="width: 300px;height: 400px; overflow: auto ;">
                                <el-tree :data="data1"
                                    show-checkbox
                                    default-expand-all
                                    node-key="k"
                                    ref="tree"
                                    highlight-current
                                    :props="defaultProps"
                                    v-loading="loading"
                                    :filter-node-method="filterNode_L"
                                    @check-change="handleCheckedChange">
                                </el-tree>
                            </div>

                        </div>
                        <div style="width: 10px;height:400px;float: left ">
                        </div>
                        <div style="height:300px;float: left ">
                            <el-button @click="getCheckedKeys"
                                type="primary">添加</el-button>
                        </div>
                        <div style="width: 10px;height:400px;float: left ">
                        </div>

                        <div style="float: left; border: 1px solid #eee;">
                            <div style="padding: 10px; background-color: #fafafa; line-height: 32px; border-bottom: 1px #eee solid">
                                已选 ({{filterText_R.length}})
                                <div class="pull-right"
                                    :inline="true">
                                    <el-button @click="removeSelect"
                                        type="text">清空</el-button>
                                </div>
                            </div>
                            <div style=" width: 300px;height: 460px; overflow: auto ;">
                                <div v-show="isShow"
                                    style=" display: none;">
                                    <el-tree :data="data1"
                                        default-expand-all
                                        node-key="k"
                                        ref="tree1"
                                        highlight-current
                                        :props="defaultProps"
                                        :filter-node-method="filterNode_R"
                                        :render-content="renderContent">
                                    </el-tree>
                                </div>
                            </div>

                        </div>

                    </div>

                </el-form-item>
                <el-form-item label=""
                    prop="filterText">
                </el-form-item>
                <el-form-item label="生成频率："
                    prop="up_freq">
                    <el-select v-model.number="form.up_freq"
                        placeholder="请选择">
                        <el-option :key="1"
                            label="一次生成"
                            :value="1"></el-option>
                        <el-option v-if="this.every"
                            :key="2"
                            label="每天"
                            :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="form.report_type_sel=='direct' && form.direct_1==11"
                    label="地域层级"
                    prop="area_type">
                    <el-radio-group v-model="form.area_type">
                        <el-radio label="province"
                            :key="1">省级地域</el-radio>
                        <el-radio label="city"
                            :key="2">市级地域</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="表头维度："
                    prop="excel_head_l">
                    <el-checkbox :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <div style="margin: 5px 0;"></div>
                    <el-checkbox-group v-model="excel_head_l"
                        @change="handleCheckedProjectsChange">
                        <el-checkbox v-for="item in excel_head_list"
                            :label="item.id"
                            :key="item.id"
                            v-if="!(form.report_type_sel == 'direct' && (item.id=='leads'||item.id=='cr'||item.id=='cpl'))">
                            {{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item prop="email"
                    label="发送邮箱：">
                    <el-input v-model="form.email"
                        placeholder="多个邮箱请用,隔开"
                        style="width: 676px;"></el-input>
                </el-form-item>
                <el-form-item prop="name"
                    label="报告名称：">
                    <el-input v-model.trim="form.name"
                        placeholder="请输入报告名称"
                        style="width: 676px;"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"
                        @click="onSubmit">保存</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import fetch from '@/services/fetch'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    let checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback();
      } else {
        var reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\,))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
        if (reg.test(value)) {
          if (value.split(",").length <= 5) {
            callback();
          } else {
            callback(new Error('邮箱数量不能超过5个'));
          }

        } else {
          callback(new Error('邮箱格式不正确'));
        }
      }
    };
    let checkExcelHead = (rule, value, callback) => {
      if (!this.excel_head_l) {
        return callback(new Error('请选择表头维度'));
      } else {
        callback();
      }
    };
    return {
      fullscreenLoading: false,
      loadingFullScreenText: "",

      form: {
        name: "",
        time_type: '',
        report_type: '',
        report_type_sel: '',
        times_ranges: [],
        start_time: '',
        end_time: '',
        select_val: '',
        basic_1: '',
        media_1: '',
        direct_1: '',
        area_type: '',  //地域层级
        excel_head: '',
        up_freq: '',
        select_type: '',
        email: '',
        filterText: [],
      },
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() > Date.now();
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;  //禁用今天
        },
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近7天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      excel_head_l: [],
      excel_head_list: [
        {
          id: "bid_request",
          name: "成功请求数"
        },
        {
          id: "win",
          name: "展现数"
        },
        {
          id: "click",
          name: "点击数"
        },
        {
          id: "cost",
          name: "消耗"
        },
        {
          id: "ctr",
          name: "CTR"
        },
        {
          id: "cpm",
          name: "CPM"
        },
        {
          id: "cpc",
          name: "CPC"
        },
        {
          id: "leads",
          name: "LEADS"
        },
        {
          id: "cpl",
          name: "CPL"
        },
        {
          id: "cr",
          name: "CR"
        },
      ],

      data1: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      filterText_L: '',
      filterText_R: [],
      filterText_R1: [],
      loading: false,
      every: false,
      isShow: false,
      checkAll: false,
      isIndeterminate: false,
      rules: {
        name: [
          { required: true, message: '请输入报告名称', trigger: 'blur' },
        ],
        report_type_sel: [
          { required: true, message: '请选择报告类型', trigger: 'change' },
        ],
        time_type: [
          { type: 'number', required: true, message: '请选择时间单位', trigger: 'change' },
        ],
        times_ranges: [
          { type: 'array', required: true, message: '请选择报告时间', trigger: 'change' },
        ],
        report_type: [
          { type: 'number', required: true, message: '请选择报告类型', trigger: 'change' },
        ],
        select_type: [
          { type: 'number', required: true, message: '请选择查询层级', trigger: 'change' },
        ],
        up_freq: [
          { type: 'number', required: true, message: '请选择更新频率', trigger: 'change' },
        ],
        area_type: [
          { type: 'string', required: true, message: '请选择地域层级', trigger: 'change' },
        ],
        filterText: [
          { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' },
        ],
        excel_head_l: [
          { validator: checkExcelHead, trigger: 'change' },
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' },
        ]
      },
    }
  },
  watch: {
    //监听右侧过滤
    filterText_R(val) {
      if (this.$refs.tree1) {
        this.$refs.tree1.filter(val);
      }
    },
    //监听左侧过滤
    filterText_L(val) {
      if (this.$refs.tree) {
        this.$refs.tree.filter(val);
      }


    }
  },
  created() { },
  mounted() {
    this.fetch_report_info();

  },
  updated() {
    if (this.$refs.tree && this.$refs.tree1) {
      this.$refs.tree.setCheckedKeys(this.filterText_R1);
      this.$refs.tree1.filter(this.filterText_R);
      this.checkFilter();
    }

  },
  methods: {
    ...mapActions([
    ]),
    //缓存左侧树选中节点
    handleCheckedChange() {
      this.filterText_R1 = this.$refs.tree.getCheckedKeys();

    },
    //获取报告信息
    fetch_report_info() {
      let _id = this.$route.params.id;
      fetch.post('/report/get', { id: _id })
        .then(res => {
          if (res.ret === 0 && res.data) {
            this.form = res.data;
            this.form.select_type = res.data.select_type;
            this.excel_head_l = res.data.excel_head.split(",");
            this.handleCheckedProjectsChange(this.excel_head_l);
            if ([1, 2, 3, 4, 5, 6, 7, 8].indexOf(res.data.report_type) >= 0) {
              this.form.report_type_sel = 'basic';
              this.form.basic_1 = res.data.report_type;
              this.form.media_1 = 9;
              this.form.direct_1 = 11;
            }
            else if ([9, 10].indexOf(res.data.report_type) >= 0) {
              this.form.report_type_sel = 'media';
              this.form.media_1 = res.data.report_type;
              this.form.basic_1 = 1;
              this.form.direct_1 = 11;
            } else {
              this.form.report_type_sel = 'direct';
              this.form.basic_1 = 1;
              this.form.media_1 = 9;
              this.form.direct_1 = res.data.report_type;
            }

            this.form = { ...this.form, times_ranges: [res.data.start_time, res.data.end_time] };
            // this.form.times_ranges = [res.data.start_time, res.data.end_time];
            this.fetch_report_getTypeData();
            this.filterText_R = res.data.select_val.split(",");
            this.filterText_R1 = res.data.select_val.split(",");
            this.findfrequency();
          }
          else {
            alert('获取信息失败')
          }
        })
        .catch(err => {
          console.error(err)
        })

    },
    //自定义右侧树

    //删除右侧树已选
    remove(node, data) {
      const index = this.filterText_R.findIndex(d => d === data.k);
      this.filterText_R.splice(index, 1);
    },
    //右侧过滤规则
    filterNode_R(value, data) {
      if (!value) return true;
      return value.indexOf(data.k) !== -1;
    },
    //左侧过滤规则
    filterNode_L(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //获取层级
    fetch_report_getTypeData() {
      this.loading = true;
      this.filterText_R = [];
      this.checkFilter();
      return new Promise((resolve, reject) => {
        fetch.post('/report/getTypeData', { type: this.form.select_type }).then(res => {

          if (res.ret === 0 && res.data) {
            this.data1 = res.data;
          }
          this.loading = false;
          resolve(res);
        })
          .catch(err => {
            this.loading = false;
            reject(err);
          })
      })

    },
    //监测是否隐藏覆盖层
    checkFilter() {
      if (this.filterText_R.length > 0) {
        this.isShow = true;
      }
      else {
        this.isShow = false;
      }

    },
    //获取左侧树真实选中Key值
    getCheckedKeys() {
      let i = this.form.select_type;
      let keys = this.$refs.tree.getCheckedKeys(true)
        .filter(function (data) {
          let str = eval("/^" + i + "-/");
          return str.test(data);
        });
      this.filterText_R = keys;
      this.checkFilter();

    },
    //左侧树全选
    setCheckedAll() {
      this.$refs.tree.setCheckedNodes(this.data1);
    },
    //左侧树清空选择
    removeCheckedAll() {
      this.$refs.tree.setCheckedNodes([]);

    },
    //右侧树清空
    removeSelect() {
      this.filterText_R = [];
    },
    //生成频率切换
    findfrequency() {
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      let Y = start.getFullYear();
      let M = start.getMonth() + 1;
      M = M > 9 ? M : "0" + M;
      let D = start.getDate();
      D = D > 9 ? D : "0" + D;
      let YMD = Y + "-" + M + "-" + D;
      if ((this.form.times_ranges[0] === this.form.times_ranges[1]) && this.form.times_ranges[0] === YMD) {
        this.every = true;
      }
      else {
        this.every = false;
        this.form.up_freq = 1;
      }
    },
    //自动设置报告名称
    setReportName() {
      this.loading = true;
      this.form.filterText = [];
      this.checkFilter();
      this.form.select_type =1;
      this.fetch_report_getTypeData();
      
      this.findfrequency();
      let str;
      str = this.form.times_ranges.join(" 至 ");
      if (this.form.report_type_sel === "basic") {
        str += " - 基础报告";
        // this.form.basic_1 = "";
      }
      else if (this.form.report_type_sel === "media") {
        str += " - 媒体报告";
        // this.form.media_1 = "";
      } else {
        str += " - 定向报告";
        // this.form.direct_1 = "";
      }
      if (this.form.basic_1) {
        this.form.report_type = this.form.basic_1;
        switch (this.form.basic_1) {
          case 1:
            str += " - 广告主报告";
            break;
          case 2:
            str += " - 品牌报告";
            break;
          case 3:
            str += " - 产品线报告";
            break;
          case 4:
            str += " - 项目报告";
            break;
          case 5:
            str += " - 活动报告";
            break;
          case 6:
            str += " - 推广计划报告";
            break;
          case 7:
            str += " - 创意组报告";
            break;
          case 8:
            str += " - 创意报告";
            break;
        }
      }
      else if (this.form.media_1) {
        this.form.report_type = this.form.media_1
        switch (this.form.media_1) {
          case 9:
            str += " - 媒体报告";
            break;
          case 10:
            str += " - 点位报告";
            break;
        }
      } else if (this.form.direct_1) {
        this.form.report_type = this.form.direct_1
        switch (this.form.direct_1) {
          case 11:
            str += " - 地域报告";
            break;
          case 12:
            str += " - 人群报告";
            break;
          case 13:
            str += " - 平台设备报告";
            break;
        }
      }
      this.form.name = str;

    },
    //表头维度全选操作
    handleCheckAllChange(val) {
      let DL = [];
      for (let i in this.excel_head_list) {
        if ((this.form.report_type_sel == 'direct' && (this.excel_head_list[i].id == 'leads' || this.excel_head_list[i].id == 'cr' || this.excel_head_list[i].id == 'cpl'))) {
          continue;
        }
        DL[i] = this.excel_head_list[i].id;
      }
      this.excel_head_l = val ? DL : [];
      this.isIndeterminate = false;
    },
    handleCheckedProjectsChange(value) {
      let checkedCount = value.length;

      if (this.form.report_type == 11 || this.form.report_type == 12 || this.form.report_type == 13) {
        this.checkAll = checkedCount === 7;
        this.isIndeterminate = checkedCount > 0 && checkedCount < 7;
      } else {
        this.checkAll = checkedCount === this.excel_head_list.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.excel_head_list.length;
      }

    },
    //取消
    onCancel() {
      const _path = this.$route.path.substring(0, this.$route.path.lastIndexOf("/edit")) + "/custom";
      this.$router.push({
        path: _path
      })
    },
    //格式化表单数据
    formatForm() {
      this.form.start_time = this.form.times_ranges[0];
      this.form.end_time = this.form.times_ranges[1];

      if (this.form.report_type_sel === "direct") {
        this.excel_head_l = this.excel_head_l.filter((val) => {
          return (val != 'leads' && val != 'cpl' && val != 'cr')
        });
      }

      this.form.excel_head = this.excel_head_l.join(",");
      if (this.form.report_type_sel === 'basic') {
        this.form.report_type = this.form.basic_1;
      } else if (this.form.report_type_sel === 'media') {
        this.form.report_type = this.form.media_1;
      } else if (this.form.report_type_sel === 'direct') {
        this.form.report_type = this.form.direct_1;
      }

      let newA = [];
      for (let k in this.filterText_R) {
        let n = this.filterText_R[k].indexOf("-") + 1;
        newA[k] = this.filterText_R[k].substr(n);
      }
      this.form.filterText = this.filterText_R;
      this.form.select_val = newA.join(",");
    },
    //提交数据
    onSubmit(form) {
      this.formatForm();
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.fullscreenLoading =  true;
          this.loadingFullScreenText= "正在保存中...";

          fetch.post('/report/add', this.form)
            .then(res => {
              this.fullscreenLoading =  false;
              this.loadingFullScreenText= "";

              if (res.ret === 0) {
                const _path = this.$route.path.substring(0, this.$route.path.lastIndexOf("/edit")) + "/custom";
                this.$router.push({
                  path: _path
                })
              }
              else {
                this.$alert(res.msg, "复制报告", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$alert("复制报告失败", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
              console.log(err);
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    renderContent(h, { node, data, store }) {
      if (data.child) {
        return (
          <span
            style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;" >
            <span> {node.label}</span>
          </span>);
      } else {
        return (
          <span
            style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;" >
            <span> {node.label}</span>
            <span>
              <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.remove(node, data)
                }>删除
                </el-button>
            </span>
          </span>);
      }

    },
  },
  components: {}
}
</script>
<style scoped>
.form-wrap {
  margin: auto;
  background: #fff;
  padding: 10px 25px;
}

.form-wrap h2 {
  margin-bottom: 20px;
  padding: 10px 10px;
  font-size: 16px;
  margin-top: -10px;
  border-bottom: 1px solid #f0f2f5;
}

.form-wrap .form-container1 {
  width: 1100px;
}
</style>
