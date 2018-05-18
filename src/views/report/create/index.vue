<template>
    <div class="hy-card">
        <div class="form-wrap">
            <h2>新建报告</h2>
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
                    <el-date-picker :key="2"
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
                        v-model="form.basic_1"
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
                        v-model="form.media_1"
                        size="mini"
                        @change="setReportName">
                        <el-radio :label="9"
                            border>媒体报告</el-radio>
                        <el-radio :label="10"
                            border>点位报告</el-radio>
                    </el-radio-group>
                    <el-radio-group v-if="form.report_type_sel == 'direct'"
                        v-model="form.direct_1"
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
                <el-form-item v-if="form.basic_1 || form.media_1 || form.direct_1"
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
                    v-if="form.basic_1 || form.media_1 || form.direct_1">
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
                                    v-model="filterText_L">
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
                                    :filter-node-method="filterNode_L">
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
                                已选 ({{form.filterText.length}})
                                <div class="pull-right"
                                    :inline="true">
                                    <el-button @click="removeSelect"
                                        type="text">清空</el-button>
                                </div>
                            </div>
                            <div style=" width: 300px;height: 460px; overflow: auto ;">
                                <div id="checked"
                                    style=" display: none;">
                                    <el-tree :data="data1"
                                        default-expand-all
                                        node-key="k"
                                        ref="tree1"
                                        highlight-current
                                        :props="defaultProps"
                                        :filter-node-method="filterNode"
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
                        <el-option :key=1
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
                            :key="1"
                            value="province">省级地域</el-radio>
                        <el-radio label="city"
                            :key="2"
                            value="city">市级地域</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="表头维度："
                    prop="excel_head_l">
                    <el-checkbox :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 5px 0;"></div>
                    <el-checkbox-group v-model="form.excel_head_l"
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
                        placeholder="选填，不填则以时间范围+报告类型命名"
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

    return {
      fullscreenLoading: false,
      loadingFullScreenText: "",

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
      loading: false,
      data1: [],

      defaultProps: {
        children: 'child',
        label: 'name'
      },
      filterText_L: '',
      form: {
        filterText: [],
        name: "",
        time_type: 1,
        report_type: 1,
        report_type_sel: 'basic',
        times_ranges: [],
        start_time: '',
        end_time: '',
        select_val: '',
        basic_1: 1,
        media_1: 9,
        direct_1: 11,
        excel_head: '',
        excel_head_l: [],
        up_freq: 1,
        area_type: '',  //地域层级
        select_type: '',
        email: '',
      },
      report_name: '',
      excel_head_list: [
        {          id: "bid_request",
          name: "成功请求数"        },
        {          id: "win",
          name: "展现数"        },
        {          id: "click",
          name: "点击数"        },
        {          id: "cost",
          name: "消耗"        },
        {          id: "ctr",
          name: "CTR"        },
        {          id: "cpm",
          name: "CPM"        },
        {          id: "cpc",
          name: "CPC"        },
        {          id: "leads",
          name: "LEADS"        },
        {          id: "cpl",
          name: "CPL"        },
        {          id: "cr",
          name: "CR"        },
      ],
      every: false,

      checkAll: false,
      isIndeterminate: false,
      rules: {

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
          { type: 'array', required: true, message: '请选择表头维度', trigger: 'change' },
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' },
        ]
      },


    };

  },
  created() {
  },
  computed: {
    //监听右侧过滤
    filterText() {
      return this.form.filterText
    }
  },
  watch: {
    //监听右侧过滤
    filterText(val) {
      this.$refs.tree1.filter(val);
    },
    //监听左侧过滤
    filterText_L(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //自定义右侧树
    renderContent(h, { node, data, store }) {
      if (data.child) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>

            </span>
          </span>);
      } else {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text" on-click={() => this.remove(node, data)} >删除</el-button>
            </span>
          </span>);
      }

    },
    //删除右侧树已选
    remove(node, data) {
      const index = this.form.filterText.findIndex(d => d === data.k);
      this.form.filterText.splice(index, 1);
    },
    //右侧过滤规则
    filterNode(value, data) {
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
      this.form.filterText = [];
      this.checkFilter();
      return new Promise((resolve, reject) => {
        fetch.post('/report/getTypeData', { type: this.form.select_type }).then(res => {
          this.loading = false;
          if (res.ret == 0 && res.data) {
            this.data1 = res.data;
          }
          resolve(res);
        })
          .catch(err => {
            this.loading = false;
            reject(err);
          })
      })

    },
    //监测是否隐藏左侧树
    checkFilter() {
      if (this.form.filterText.length > 0) {
        document.getElementById("checked").style.display = "block";
      } else { document.getElementById("checked").style.display = "none"; }
    },
    //获取左侧树真实选中Key值
    getCheckedKeys() {
      let i = this.form.select_type;
      let keys = this.$refs.tree.getCheckedKeys(true)
        .filter(function (data) {
          let str = eval("/^" + i + "-/"); return str.test(data);
        });
      this.form.filterText = keys;
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
      this.form.filterText = [];
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

      // let fromDate = new Date(this.form.times_ranges[0]);
      // let toDate = new Date(this.form.times_ranges[1]);
      // let days = (toDate-fromDate)/1000/60/60/24;

      // if(days==0){   //昨天
      //   this.date_range = "DAY";
      //   this.form.up_freq=1; 
      // }else if(days==6){  //近7天
      //   this.date_range = "WEEK";
      // }else{   //近一个月
      //   this.date_range = "MONTH";
      // }


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
        if (this.form.basic_1) {
          this.form.report_type = this.form.basic_1;
        }
        str += " - 基础报告";
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
      else if (this.form.report_type_sel === "media") {
        str += " - 媒体报告";
        if (this.form.media_1) {
          this.form.report_type = this.form.media_1;
        }

        switch (this.form.media_1) {
          case 9:
            str += " - 媒体报告";
            break;
          case 10:
            str += " - 点位报告";
            break;
        }
      } else if (this.form.report_type_sel === "direct") {
        str += " - 定向报告";
        if (this.form.direct_1) {
          this.form.report_type = this.form.direct_1;
        }

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

      this.report_name = str;

      this.isIndeterminate = false;

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
      this.form.excel_head_l = val ? DL : [];
      this.isIndeterminate = false;
    },
    handleCheckedProjectsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.excel_head_list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.excel_head_list.length;
    },
    //取消
    onCancel() {
      const _path = this.$route.path.substring(0, this.$route.path.lastIndexOf("/create")) + "/custom";
      this.$router.push({
        path: _path
      })
    },

    //格式化表单数据
    formatForm() {
      this.form.start_time = this.form.times_ranges[0];
      this.form.end_time = this.form.times_ranges[1];

      if (this.form.report_type_sel == "direct") {
        this.form.excel_head_l = this.form.excel_head_l.filter((val) => {
          return (val != 'leads' && val != 'cpl' && val != 'cr')
        });
      }

      this.form.excel_head = this.form.excel_head_l.join(",");
      if (this.form.report_type_sel === 'basic') {
        this.form.report_type = this.form.basic_1;
      } else if (this.form.report_type_sel === 'media') {
        this.form.report_type = this.form.media_1;
      } else {
        this.form.report_type = this.form.direct_1;
      }

      let newA = [];
      for (let k in this.form.filterText) {
        let n = this.form.filterText[k].indexOf("-") + 1;
        newA[k] = this.form.filterText[k].substr(n);
      }
      this.form.select_val = newA.join(",");
    },
    //提交数据
    onSubmit(form) {
      this.formatForm();
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.name === '') {
            this.form.name = this.report_name;
          }

          this.fullscreenLoading =  true;
          this.loadingFullScreenText= "正在保存中...";
          fetch.post('/report/add', this.form)
            .then(res => {
              this.fullscreenLoading =  false;
              this.loadingFullScreenText= "";
              if (res.ret === 0) {
                const _path = this.$route.path.substring(0, this.$route.path.lastIndexOf("/create")) + "/custom";
                this.$router.push({
                  path: _path
                })
              }
              else {
                this.$alert(res.msg, "新建报告", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              }
            })
            .catch(err => {
              this.$alert("新建报告失败", "提示", {
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
    }
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
.box-card {
  width: 200px;
  height: 450px;
  float: left;
}
</style>
