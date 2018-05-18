<template>
    <el-dialog :title="title"
        class="popCyDia"
        :visible="true"
        width='1000px'
        @close='onClose'>
        <!-- <div v-show="errstatus">
      <el-alert :title="errMsg" type="error" show-icon :closable="false">
      </el-alert>
    </div> -->
        <el-form :model="$data"
            size="mini"
            v-loading="isLoading"
            class="popCybox"
            :rules="rules"
            ref='cgform'>
            <div style="display: inline-block;width: 300px;vertical-align: top;">
                <el-form-item label="广告主："
                    prop="ok"
                    :label-width="formLabelWidth">
                    <span>{{ader_name}}</span>
                </el-form-item>
                <el-form-item label="品牌："
                    :label-width="formLabelWidth">
                    <span>{{getBrandName}}</span>
                </el-form-item>
                <el-form-item label="产品线："
                    :label-width="formLabelWidth">
                    <span>{{getProductName}}</span>
                </el-form-item>
                <el-form-item label="项目："
                    prop="ok"
                    :label-width="formLabelWidth">
                    <span>{{project_name}}</span>
                </el-form-item>
                <el-form-item label="活动："
                    prop="ok"
                    :label-width="formLabelWidth">
                    <span>{{activity_name}}</span>
                </el-form-item>
                <el-form-item label="推广计划："
                    prop="ok"
                    :label-width="formLabelWidth">
                    <span>{{getCampaignName}}</span>
                </el-form-item>
            </div>
            <div class="right">
                <el-form-item label="创意组名称："
                    prop="creativeGroupName"
                    :label-width="formLabelWidth">
                    <el-input v-model="creativeGroupName"
                        :disabled='type=="editAfter"'></el-input>
                </el-form-item>
                <el-form-item label="素材版本："
                    :label-width="formLabelWidth">
                    <!--prop="ok" 取消必需-->
                    <el-input v-model="materialVersion"
                        :disabled='type=="editAfter"'>
                        <el-button slot="append"
                            icon="el-icon-search"
                            @click='onSearch'
                            :disabled='type=="editAfter"'></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="创意："
                    prop="ok"
                    :label-width="formLabelWidth">
                    <el-transfer filterable
                        filter-placeholder="创意名称查询"
                        :titles="['所有创意', '已选']"
                        v-model="creativeIdSelected"
                        @change="handleChange"
                        :data="creativeList"
                        :props="transferProps"
                        class="ss">
                    </el-transfer>
                </el-form-item>
                <div v-if="creativeIdSelected.length">
                    <el-form-item label="创意模式："
                        prop="ok"
                        :label-width="formLabelWidth">
                        <el-radio v-model="creativeMode"
                            label="1">随机投放</el-radio>
                        <el-radio v-model="creativeMode"
                            label="2">顺序轮播</el-radio>
                        <el-radio v-model="creativeMode"
                            label="3">权重投放</el-radio>
                    </el-form-item>
                    <!-- 顺序轮播 start -->
                    <div v-if="creativeMode==2">
                        <el-form-item label="创意排序："
                            prop="ok"
                            :label-width="formLabelWidth">
                            <div style="padding: 10px; background: #f5f5f5;border-radius: 3px">
                                <p v-for="(item,index) in creativeListSort"
                                    :key='index'>
                                    {{index+1}}--{{item.name}}
                                    <el-button class="upbutton"
                                        v-if="index!=0"
                                        icon="el-icon-arrow-up"
                                        @click="moveUp(index,item)">
                                    </el-button>
                                </p>
                            </div>
                            <div style="line-height: 40px">
                                <span>轮播执行次数：</span>
                                <el-radio v-model="executeTimes"
                                    label="1">1次</el-radio>
                                <el-radio v-model="executeTimes"
                                    label="2">无限次</el-radio>
                                <el-radio v-model="executeTimes"
                                    label="3">自定义</el-radio>
                                <el-input v-model="customTimes"
                                    size='mini'
                                    placeholder="请输入数字"
                                    v-if="executeTimes==3"
                                    style="width:120px;"></el-input>
                            </div>
                            <div v-if="executeTimes!=2">
                                <span>定帧创意：</span>
                                <el-select v-model="frameCreative"
                                    placeholder="请选择">
                                    <el-option v-for="item in creativeListSelected"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </div>
                    <!-- 顺序轮播 end -->
                    <!-- 权重投放 start -->
                    <el-form-item label="权重设置："
                        :label-width="formLabelWidth"
                        v-if="creativeMode==3"
                        prop="ok">
                        <div v-for="item in creativeListSelected"
                            :key='item.id'
                            style="margin-bottom:6px">
                            <el-input type="text"
                                v-model="item.priority"
                                style="width:100px;"
                                placeholder='权重值'>
                                <template slot="append">%</template>
                            </el-input>
                            {{item.name}}
                        </div>
                    </el-form-item>
                    <!-- 权重投放 end -->
                </div>
            </div>

        </el-form>
        <div slot="footer"
            class="dialog-footer">
            <el-button @click="onClose"
                size="mini">取 消</el-button>
            <el-button type="primary"
                @click="onConfirm"
                size="mini">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import fetch from "@/services/fetch";
import _ from "lodash";
import $ from "jQuery";
import { mapState, mapGetters, mapActions } from "vuex";
import math from "mathjs";
math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});
const numReg = /^[1-9]([0-9]*)+(.[0-9]{1,2})?$/;
export default {
  name: "edit_create_creative_group",
  data() {
    var validateOK = (rule, value, callback) => {
      callback();
    };
    return {
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        ok: [{ required: true, validator: validateOK }],
        creativeGroupName: [
          { required: true, message: "请填写创意组名称", trigger: "blur" }
        ],
        // materialVersion: [
        //   { required: true, message: "请填写素材版本", trigger: "blur" }
        // ]
      },
      isLoading: false,
      transferProps: {
        key: "id",
        label: "name"
      },
      title: '新建创意组',
      creativeGroupName: "", //创意组名称
      materialVersion: "", //素材版本
      creativeMode: "", //创意模式
      formLabelWidth: "100px",
      creativeIdSelected: [], //创意已选ID(穿梭框右侧列表)
      creativeListSelected: [], //被选择的创意
      creativeList: [], //可选的创意列表(穿梭框左侧列表)
      creativeListSort: [], //排序使用的创意列表
      executeTimes: "1", //顺序轮播类型
      frameCreative: "", //定帧
      customTimes: "", //自定义次数

      form: {
        brand_id: '',
        brand_name: '',
        product_line_id: '',
        product_name: '',
        plan_name: ''
      }
    };
  },
  props: {
    isOpen: {
      type: [Boolean],
      required: true
    },
    type: {
      type: [String],
      required: true
    },
    creativeGroupid: {
      type: [Number, String]
    },
    exPlanId: {
      type: [Number, String]
    },
    posId: {
      type: [Number, String]
    }
  },
  computed: {
    ...mapState("ad", [
      "ader_id",
      "activity_id",
      "ader_id",
      "ader_name",
      "brand_id",
      "brand_name",
      "product_id",
      "product_name",
      "project_id",
      "project_name",
      "activity_id",
      "activity_name",
      "campaign_id",
      "campaign_name",
    ]),
    ...mapState("ad/campaign", [
      "ad_pos",
      "zone_info",
      "campaign_audit_status"
    ]),
    ...mapGetters("ad/campaign", ["ad_pos_selected"]),

    getBrandName() {
      return this.brand_name || this.form.brand_name;
    },

    getProductName(){
      return this.product_name || this.form.product_name;
    },

    getCampaignName(){
      return this.campaign_name || this.form.plan_name;
    }


  },
  watch: {
    creativeIdSelected() {
      this.setTransferTitle();
    },
    creativeList() {
      this.setTransferTitle();
    },
  },
  created() {
    this.fetch_post();

  },
  methods: {
    ...mapActions("ad/campaign", ["update_zone_info"]),
    /**
     * [initEdit description]
     * @param  {[type]} obj [description]
     * {
          activity: "项目3活动",
          ad_id: "0",
          advertiser_name: "数据分析人群包",
          brand_name: "人群包1",
          creatives_id: "249,258",
          creatives_name: "人群项目3层级创意1,123445",
          id: "276",
          media_name: null,
          name: "么么么么",
          pattern: "1",
          pattern_value: "",
          pos_id: null,
          position_name: null,
          product_line: null,
          project_name: "项目3"
        }
             
     * @return {[type]}     [description]
     */
    async fetch_post() {
      if (this.type != 'create') {
        this.title = '编辑创意组'
        await this.getCreativeGroupDetail();
      }

      if (this.type == 'editAfter' || this.posId) {
        await this.getQueryDetail(this.activity_id);
      }

      await this.fetchGetCreativeList();
    },

    initEdit(obj) {
      this.creativeGroupName = obj.name;
      // this.materialVersion = '未知';//to do 需要服务端添加
      this.creativeIdSelected = obj.creatives_id.split(',');
      this.creativeMode = obj.pattern;

      this.form.plan_name = this.campaign_name ? this.campaign_name : obj.plan_name;

      let id_arr = obj.creatives_id.split(',');
      let name_arr = obj.creatives_name.split(',');
      let arr = [];
      for (let i = 0; i < id_arr.length; i++) {
        let id = id_arr[i];
        let name = name_arr[i];
        arr.push({ id, name });
      }

      this.creativeListSelected = _.cloneDeep(arr);
      this.creativeListSort = _.cloneDeep(arr);

      if (obj.pattern == 2) {
        this.executeTimes = obj.pattern_value.type;
        let id_arr = obj.pattern_value.creative_id;
        // this.creativeListSort = obj.pattern_value.creative_id;
        let arr = [];
        for (let i = 0; i < id_arr.length; i++) {
          let id = id_arr[i];
          let index = obj.creatives_id.split(',').indexOf(id);
          if (index != -1) {
            let name = obj.creatives_name.split(',')[index];
            arr.push({ id, name });
          }
        }
        this.creativeListSort = arr;
        this.creativeListSelected = _.cloneDeep(arr);
        let frame = obj.pattern_value.frame;
        if (frame != undefined) {
          let frame = obj.pattern_value.frame;
          this.frameCreative = frame;
        }

        let customTimes = obj.pattern_value.num;
        if (customTimes != undefined) {
          this.customTimes = customTimes;
        }
      } else if (obj.pattern == 3) {
        let arr = [];
        let idArr = obj.pattern_value.creative_id;
        let priorityArr = obj.pattern_value.priority;
        for (var i = 0; i < idArr.length; i++) {
          let obj = _.find(this.creativeListSelected, { id: idArr[i] });
          if (obj) {
            obj.priority = priorityArr[i];
          }
        }
        // this.creativeListSelected = arr;
      }
    },
    async getCreativeGroupDetail() {
      let data = { id: this.creativeGroupid - 0, plan_id: this.campaign_id };
      if (this.exPlanId) {
        data.plan_id = this.exPlanId;
      }
      await fetch.post("/creative_group/details", data)
        .then(res => {
          if (res.ret == 0 && res.data) {
            this.initEdit(res.data);
          } else {
            console.error(res);
            this.$message.error("获取创意组详情失败，请稍后重试");
          }
        })
        .catch(err => {
          this.$message.error("获取创意组详情失败，请稍后重试");
          console.error(err);
        });
    },

    getQueryDetail(activity_id) {
      return new Promise((resolve, reject) => {
        fetch.post("/query", {
          activity_id
        }).then(res => {
          if (res.ret == 0) {
            this.form.brand_id = res.data.brand_id;
            this.form.brand_name = res.data.brand_name;
            this.form.product_line_id = res.data.product_line_id;
            this.form.product_name = res.data.product_name;
            resolve(res.data);
          } else {
            reject(new Error(res.msg));
          }
        }).catch(err => {
          reject(new Error(err));
          console.error(err);
        });
      });
    },

    moveUp(i, tar) {
      this.creativeListSort.splice(i, 1);
      this.creativeListSort.splice(i - 1, 0, tar);
    },
    disabledList(arr) {
      if (this.type == 'editAfter') {
        for (let i of arr) {
          i.disabled = true;
        }
      }
    },
    onSearch() {
      this.fetchGetCreativeList();
    },
    setTransferTitle() {
      // setTimeout(()=>{
      this.$nextTick(function () {
        let labels = $('.el-transfer.ss .el-transfer-panel__list .el-checkbox__label');
        labels.map(function () {
          let text = $(this).children('span').text();
          $(this).attr('title', text);
        })
      })
      // },500)

    },
    /**
     * [fetchGetCreative 从服务端获取可以选择的创意（穿梭框左侧数据源）]
     * @return {[type]} [description]
     */
    async fetchGetCreativeList() {
      let pos_id = "";

      if (this.type == 'editAfter' && this.posId) {
        pos_id = this.posId;
      } else {
        pos_id = this.ad_pos_selected.join(',');
      }

      var parms = {
        versions: _.trim(this.materialVersion),
        brand_id: this.brand_id || this.form.brand_id,
        activity_id: this.activity_id,
        pos_id,
        product_line_id: this.product_id || this.form.product_line_id,
        project_id: this.project_id
      };

      await fetch.post("/creative_group/getCreative", parms)
        .then(res => {
          if (res.ret == 0 && res.data) {
            this.creativeList = res.data;
            // this.setTransferTitle();

            this.disabledList(this.creativeList);
          } else {
            console.error(res);
            this.$message.error("获取创意列表失败，请稍后重试");
            /* this.creativeList = [
              {
                id: "2",
                name: "人群项目3层级创意2"
              },
              {
                id: "1",
                name: "人群项目3层级创意1"
              },
              {
                id: "3",
                name: "人群项目3层级创意3"
              }
            ]; */
            // this.creativeListSort = _.cloneDeep(this.creativeList);
          }
        })
        .catch(err => {
          this.$message.error("获取创意列表失败，请稍后重试");
          console.error(err);
        });
    },
    /**
     * [handleChange 穿梭框2侧数据变化时触发]
     * @param  {[type]} value     [description]
     * @param  {[type]} direction [description]
     * @param  {[type]} movedKeys [description]
     * @return {[type]}           [description]
     */
    handleChange(value, direction, movedKeys) {
      this.creativeIdSelected = value;
      let arr = this.creativeList.filter(item => {
        return value.indexOf(item.id) != -1;
      });
      this.creativeListSelected = arr;
      this.creativeListSort = _.cloneDeep(arr);
    },
    //校验form无法校验的数据
    onValid() {
      if (!this.creativeIdSelected.length) {
        this.$message.error("请选择创意");
        return;
      }
      if (this.creativeMode == "") {
        this.$message.error("请选择创意模式");
        return;
      } else {
        //权重
        if (this.creativeMode == "3") {
          let prioritySum = 0;
          for (const item of this.creativeListSelected) {
            if (!item.priority) {
              this.$message.error("请输入权重值");
              return;
            } else {
              if (!numReg.test(item.priority)) {
                this.$message.error(
                  "权重值只允许是正整数或者最多保留2位小数的正实数"
                );
                return;
              } else {
                prioritySum = math.eval(prioritySum + "+" + item.priority);
              }
            }
          }
          if (prioritySum - 0 != 100) {
            this.$message.error("权重值之和必须等于100");
            return;
          } else {
            return true;
          }
        } else if (this.creativeMode == "2") {
          if (!this.executeTimes) {
            this.$message.error("请选择轮播执行次数");
            return;
          } else {
            if (this.executeTimes == 1 || this.executeTimes == 3) {
              if (!this.frameCreative) {
                this.$message.error("请选择定帧创意");
                return;
              }
            }
            if (this.executeTimes == 3) {
              if (!this.customTimes) {
                this.$message.error("请填写自定义轮播执行次数");
                return;
              } else {
                let reg = /^[1-9]\d*$/;
                if (!reg.test(this.customTimes)) {
                  this.$message.error("自定义轮播执行次数必须为正整数");
                  return;
                }
              }
            }
          }
        }
        return true;
        // this.$message.error("请选择创意模式");
      }
    },
    /**
     * [onConfirm 点击保存按钮]
     * @return {[type]} [description]
     */
    onConfirm() {
      if (!this.onValid()) {
        return;
      }
      // this.$message.error("暂停失败请稍后重试");
      this.$refs["cgform"].validate(valid => {
        if (valid) {
          let parms = {
            plan_id: this.campaign_id,
            brand_id: this.brand_id,
            project_id: this.project_id,
            activity_id: this.activity_id,
            product_line_id: this.product_id || '',
            name: this.creativeGroupName,
            creative_id: this.creativeIdSelected.join(','),
            pattern: this.creativeMode
            // pattern_value: {}
          };
          if (this.exPlanId) {
            parms.plan_id = this.exPlanId;
          }
          if (this.creativeMode == 2) {
            let obj = {};

            let type = this.executeTimes;
            let creative_id = [];
            for (const item of this.creativeListSort) {
              creative_id.push(item.id);
            }
            if (this.executeTimes == 1) {
              let frame = this.frameCreative;
              parms.pattern_value = { type, creative_id, frame };
            } else if (this.executeTimes == 2) {
              parms.pattern_value = { type, creative_id };
            } else {
              let frame = this.frameCreative;
              let num = this.customTimes;
              parms.pattern_value = { type, creative_id, frame, num };
            }
          } else if (this.creativeMode == 3) {
            let creative_id = [];
            let priority = [];
            for (let item of this.creativeListSelected) {
              creative_id.push(item.id);
              priority.push(item.priority);
            }
            parms.pattern_value = { creative_id, priority }
          }
          let url = '/creative_group/edit';
          if (this.type == 'create') {
            url = '/creative_group/create';
          } else {
            parms.id = this.creativeGroupid;
          }
          this.isLoading = true;
          // '/creative_group/edit'
          fetch.post(url, parms).then(res => {
            if (res.ret === 0 && res.data) {
              if (this.type == 'editAfter' && !this.exPlanId) {
                this.fetch_push(this.creativeGroupid + '').then(res => {
                  this.isLoading = false;
                  this.$emit('refreshList')
                  this.onClose();
                }).catch(err => {
                  this.isLoading = false;
                });
              } else {
                this.isLoading = false;
                this.$emit('refreshList')
                this.onClose();
              }

            } else {
              this.isLoading = false;
              this.$message.error(res.msg || "保存失败，请稍后重试")
            }
          })
            .catch(err => {
              this.isLoading = false;
              this.$message.error("保存失败，请稍后重试")
            });
        }
      });
    },
    fetch_push(ids) {
      return new Promise((resolve, reject) => {
        fetch.post('/campaign/step', {
          id: this.campaign_id,
          creative_group_ids: ids
        }).then(res => {
          if (res.ret == 0) {
            fetch.post('/campaign/push', {
              id: this.campaign_id
            }).then(res => {
              if (res.ret == 0) {
                resolve();
              } else {
                this.$alert(res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error",
                  callback: (action) => { }
                });
                reject(err || '推送失败，请稍后重试');
              }
            }).catch(err => {
              reject(err || '推送失败，请稍后重试');
            })
          } else {
            reject(res.msg || '推送失败，请稍后重试');
          }
        }).catch(err => {
          reject(err || '推送失败，请稍后重试');
        })
      });
    },
    /**
     * [onClose 关闭弹窗]
     * @return {[type]} [description]
     */
    onClose() {
      this.$emit("update:isOpen", false);
    }
  }
};
</script>
<style>
.popCyDia .right {
  display: inline-block;
  width: 620px;
  vertical-align: top;
  border-left: 1px solid #eee;
  padding: 0 10px;
  max-height: 422px;
  overflow-y: auto;
}
.popCybox .el-input-group--append .el-input-group__append {
  padding: 0 15px;
}
.popCyDia .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
.popCyDia .popCybox {
  overflow-y: auto;
}

.popCyDia .upbutton {
  height: 30px;
  width: 30px;
  border-radius: 15px;
  padding: 0;
}

.popCyDia > div {
  width: 1000px;
}

.popCyDia .ss > .el-transfer-panel {
  width: 200px;
}

.popCyDia
  .ss
  > .el-transfer-panel
  .el-transfer-panel__header
  .el-checkbox
  .el-checkbox__label {
  font-size: 12px;
}

.popCyDia .popCybox .el-form-item__content {
  line-height: 30px;
  font-size: 12px;
}

.popCyDia .popCybox .name {
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 80px;
}

.popCybox .el-input-group__append,
.el-input-group__prepend {
  padding: 0 6px;
}
</style>
