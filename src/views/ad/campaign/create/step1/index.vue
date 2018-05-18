<template>
    <!-- <div class="m__wraper">
    <div class="m__sidebar">
      <sidebar-tree />
    </div> -->

    <div class="m__content">
        <!-- 导航栏 -->
        <div class="clearfix nav-wrap">
            <div class="pull-left">
                <activity-nav />
            </div>
        </div>

        <div class="campaign__wrap">
            <campaign-steps @click:nav="gotoStep" />

            <div class="form-wrap">
                <div class="center860"
                    style="width: 500px;"
                    v-loading="loading">
                    <el-form ref="form"
                        label-width="100px"
                        size="mini">

                        <el-form-item label="广告主"
                            :required="true">
                            <el-input :value="ader_id"
                                class="hidden"></el-input>
                            <el-input :value="ader_name"
                                :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="品牌："
                            :required="true">
                            <el-input :value="brand_id"
                                class="hidden"></el-input>
                            <el-input :value="brand_name"
                                :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="产品线："
                            :required="false">
                            <el-input :value="product_id"
                                class="hidden"></el-input>
                            <el-input :value="product_name"
                                :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="项目："
                            :required="true">
                            <el-input :value="project_id"
                                class="hidden"></el-input>
                            <el-input :value="project_name"
                                :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="活动名称："
                            :required="true">
                            <el-input :value="activity_id"
                                class="hidden"></el-input>
                            <el-input :value="activity_name"
                                :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="计划名称："
                            :required="true">
                            <el-input :value="campaign_id"
                                class="hidden"></el-input>
                            <el-input :value="campaign_name"
                                @input="update_campaign_name"></el-input>
                        </el-form-item>

                        <el-form-item label="每日预算："
                            :required="true">
                            <el-input :value="budget"
                                @input="update_budget"></el-input>
                        </el-form-item>

                        <el-form-item label="投放日期："
                            :required="true">
                            <el-date-picker :disabled="isDisabledStartTime"
                                :clearable="false"
                                v-model="start_time"
                                value-format="yyyy-MM-dd"
                                type="date"
                                :picker-options="pickerOptions"
                                placeholder="开始日期" />
                            <span>至</span>
                            <el-date-picker :clearable="false"
                                v-model="end_time"
                                value-format="yyyy-MM-dd"
                                type="date"
                                :picker-options="pickerOptionsEndTime"
                                placeholder="结束日期" />
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="btn-wrap">
                <el-button size="small"
                    @click="handle_cancel">取消</el-button>
                <el-button size="small"
                    @click="handle_reset"
                    v-if="campaign_update_type == 'create'">重置</el-button>
                <el-button size="small"
                    type="primary"
                    @click="handle_submit">下一步</el-button>
            </div>
        </div>
    </div>
    <!-- </div> -->

</template>
<script>
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions, mapMutations } from "vuex";
import SidebarTree from "@/views/ad/public/sidebar-tree";
import ActivityNav from "@/views/ad/public/activity-nav";

import CampaignSteps from "../public/campaign-steps";

export default {
  name: "CampaignStep1",
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return false;
        }
      },
      pickerOptionsEndTime: {
        disabledDate(time) {
          return false;
        }
      },
      loading: false,
      start_time: "",
      end_time: "",
      activity_start_time: "",
      activity_end_time: ""
    };
  },
  computed: {
    ...mapState("advertiser", ["brand_forms"]),
    ...mapState("ad", [
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
      "campaign_name"
    ]),
    ...mapState("ad/campaign", [
      "campaign_update_type",
      "run_status",
      "budget",
      "start_date",
      "end_date"
    ]),
    isDisabledStartTime() {
      if (this.campaign_update_type == "edit") {
        return this.run_status != 0;
      }
      return false;
    },
    startDatePickerOptions() {
      return {
        disabledDate(time) {
          return false;
        }
      };
    }
  },
  created() {
    this.update_step_index(0);
    this.loading = true;
    Promise.all([this.fetch_activity_info(), this.handle_init()])
      .then((res) => {
        let [activityData, campaginData] = res;

        this.start_time = this.setStartDate(this.start_date);
        this.end_time = this.end_date;
        this.loading = false;

        this.pickerOptions.disabledDate = this.setDisabledDate(activityData.start_time, activityData.end_time);
        this.pickerOptionsEndTime.disabledDate = this.setDisabledDate(activityData.start_time, activityData.end_time);
      })
      .catch(err => {
        this.loading = false;
        console.log(err);
      });
  },
  methods: {
    ...mapActions("ad", [
      "update_brand_id",
      "update_brand_name",
      "update_product_id",
      "update_product_name",
      "update_project_id",
      "update_project_name",
      "update_campaign_id",
      "update_campaign_name"
    ]),
    ...mapActions("ad/campaign", [
      "update_step_index",
      "padding_campaign",
      "update_budget",
      "update_start_date",
      "update_end_date",
      "create_campaign_step1"
    ]),
    ...mapMutations("ad", ["insert_campaign", "update_campaign_name_m"]),
    setStartDate(timeStr) {
      let stime = moment() - 24 * 60 * 60 * 1000;
      if (this.campaign_update_type != "edit") {
        if (stime - 0 < moment(timeStr) - 0) {
          return timeStr;
        } else {
          return stime.add(1, "days").format("YYYY-MM-DD");
        }
      } else {
        return timeStr;
      }
    },

    setDisabledDate(startTime, endTime) {
      return time => {
        let now = moment() - 24 * 60 * 60 * 1000;
        let stime = now > moment(startTime) ? now : moment(startTime);
        let etime = moment(endTime);
        return time.getTime() < stime || time.getTime() > etime;
      };
    },

    // setDisabledDate(timeStr) {
    //   // console.log('timeStr',timeStr)
    //   return time => {
    //     if (this.campaign_update_type == "edit") {
    //       if (this.run_status == "0") {
    //         return time.getTime() < moment() + 24 * 60 * 60 * 1000;
    //       } else {
    //         return time.getTime() < moment(timeStr) - 0;
    //       }
    //     } else {
    //       return time.getTime() < moment() - 24 * 60 * 60 * 1000||time.getTime() < moment(timeStr) - 0;
    //     }
    //   };
    // },
    fetch_activity_info() {
      return new Promise((resolve, reject) => {
        fetch
          .post("/query", {
            activity_id: this.activity_id
          })
          .then(res => {
            if (res.ret == 0) {
              this.update_brand_id(res.data.brand_id);
              this.update_brand_name(res.data.brand_name);
              this.update_product_id(res.data.product_line_id);
              this.update_product_name(res.data.product_name);
              this.update_project_id(res.data.id);
              this.update_project_name(res.data.name);
              if (!this.campaign_id) {
                this.update_start_date(res.data.start_time);
                this.update_end_date(res.data.end_time);
              }
              this.activity_start_time = res.data.start_time;
              this.activity_end_time = res.data.end_time;

              resolve(res.data);
            } else {
              reject(new Error(res.msg));
              console.error(res.msg);
            }
          })
          .catch(err => {
            reject(new Error(err));
            console.error(err);
          });
      });
    },
    fetch_campaign_info() {
      return new Promise((resolve, reject) => {
        fetch
          .post("/campaign/view", {
            id: this.campaign_id
          })
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.msg));
              console.error(res.msg);
            }
          })
          .catch(err => {
            reject(new Error(err));
            console.error(err);
          });
      });
    },
    handle_init() {
      return new Promise((resolve, reject) => {
        // 新建计划
        if (!this.campaign_id) {
          // 初始化计划信息
          this.padding_campaign({}).then(resolve, reject);
        } else {
          // 编辑计划
          this.fetch_campaign_info()
            .then(data => {
              this.padding_campaign(data).then(resolve, reject);
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    },
    handle_reset() {
      this.update_campaign_name("");
      this.update_budget("");
      this.start_time = this.start_date;
      this.end_time = this.end_date;
    },
    valid() {
      var _this = this;
      return new Promise((resolve, reject) => {
        if (!_this.campaign_name) {
          reject(new Error("请输入计划名称"));
        } else if (
          !/^[\u4e00-\u9fa5A-Za-z0-9_()（）]{3,}$/.test(_this.campaign_name)
        ) {
          reject(
            new Error(
              "计划名称只能包含数字、英文、下划线、中文或英文括号，长度至少三个字符!"
            )
          );
        } else if (!_this.budget) {
          reject(new Error("请输入每日预算"));
        }
        var budget = parseFloat(_this.budget);
        if (budget <= 0 || isNaN(budget)) {
          reject(new Error("每日预算必须为大于0的数字"));
        }
        // 未投放
        if (this.run_status == "0") {
          if (moment(_this.start_time).isBefore(new Date() - 24 * 60 * 60 * 1000)) {
            if (this.campaign_update_type == "create") {
              // reject(new Error("计划的开始日期必须大于当前日期"));
              reject(new Error("计划的开始日期必须大于昨天"));
            } else {
              resolve();
            }
          } else if (
            moment(_this.start_time).isBefore(_this.activity_start_time)
          ) {
            reject(
              new Error(
                "计划的开始日期必须大于等于活动的开始日期(" +
                _this.activity_start_time +
                ")"
              )
            );
          } else if (moment(_this.end_time).isBefore(_this.start_time)) {
            reject(new Error("计划的结束日期必须大于开始日期"));
          } else if (moment(_this.activity_end_time).isBefore(_this.end_time)) {
            reject(
              new Error(
                "计划的结束日期必须小于等于活动的结束日期(" +
                _this.activity_end_time +
                ")"
              )
            );
          } else {
            resolve();
          }
        } else {
          // 已投放
          if (moment(_this.end_time).isBefore(new Date() - 24 * 60 * 60 * 1000)) {
            reject(new Error("计划的结束日期必须大于昨天"));
            // reject(new Error("计划的结束日期必须大于当前日期"));
          } else if (moment(_this.end_time).isBefore(_this.start_time)) {
            reject(new Error("计划的结束日期必须大于开始日期"));
          } else {
            resolve();
          }
        }
      });
    },
    handle_submit() {
      this.valid()
        .then(() => {
          this.update_start_date(this.start_time);
          this.update_end_date(this.end_time);
          this.create_campaign_step1()
            .then(res => {
              let campaign_id = res.data.id - 0;
              let campaign_name = this.campaign_name;
              let project_id = this.project_id - 0;
              let activity_id = this.activity_id - 0;

              if (this.campaign_update_type == "edit") {
                this.update_campaign_name_m({
                  campaign_id: this.campaign_id - 0,
                  campaign_name,
                  project_id,
                  activity_id
                });
              } else {
                this.insert_campaign({
                  campaign_id,
                  campaign_name,
                  project_id,
                  activity_id
                });
              }

              this.$router.push("step2");
            })
            .catch(err => {
              console.error(err);
              this.$message.error(err.message);
            });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handle_cancel() {
      this.$router.push({
        path: "/ad/campaign/manage"
      });
    },

    gotoStep(step) {
      this.valid()
        .then(() => {
          this.update_start_date(this.start_time);
          this.update_end_date(this.end_time);
          this.create_campaign_step1()
            .then(res => {
              let campaign_id = res.data.id - 0;
              let campaign_name = this.campaign_name;
              let project_id = this.project_id - 0;
              let activity_id = this.activity_id - 0;

              if (this.campaign_update_type == "edit") {
                this.update_campaign_name_m({
                  campaign_id: this.campaign_id - 0,
                  campaign_name,
                  project_id,
                  activity_id
                });
              } else {
                this.insert_campaign({
                  campaign_id,
                  campaign_name,
                  project_id,
                  activity_id
                });
              }

              if (step == "1") {
                this.$router.push("step1");
              }
              if (step == "2") {
                this.$router.push("step2");
              }
              if (step == "3") {
                this.$router.push("step3");
              }
              if (step == "4") {
                this.$router.push("step4");
              }

            })
            .catch(err => {
              console.error(err);
              this.$message.error(err.message);
            });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  },

  components: {
    SidebarTree,
    ActivityNav,
    CampaignSteps
  }
};
</script>
