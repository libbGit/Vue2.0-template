<template>
    <div>
        <div class="campaign__wrap">
            <div class="step_wrap">
                <div class="title">
                    <router-link to="list">
                        <el-button size="mini"
                            icon="el-icon-arrow-left"
                            title="返回">
                        </el-button>
                    </router-link>
                    <span>新建人群包</span>
                </div>
            </div>

            <div class="form-wrap">
                <div style="width: 500px;">
                    <el-form label-width="120px" size="mini">
                        <el-form-item label="人群包名称:" required>
                            <el-input v-model.trim="crowdData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="内容:" required>
                            <div class="content"
                                v-for="(item,index) in crowdData.target"
                                :key="index">
                                <span class="content-inline">
                                    <span class="content-label-left">项目id</span>
                                    <el-input v-model.trim="item.projectid"></el-input>
                                </span>
                                <span class="content-inline">
                                    <span class="content-label-right">人群包id</span>
                                    <el-input v-model.trim="item.crowdsid"></el-input>
                                </span>
                                <span v-if="index==0" class="content-icon">
                                    <i @click="addItem"
                                        size="small"
                                        class="el-icon-circle-plus-outline">
                                    </i>
                                </span>
                                <span v-else class="content-icon">
                                    <i @click="deleteItem(item.id)"
                                        size="small"
                                        class="el-icon-remove-outline">
                                    </i>
                                </span>
                            </div>
                        </el-form-item>

                        <el-form-item label="备注:">
                            <el-input type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model.trim="crowdData.comments">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button size="mini"
                                @click="saveDir()"
                                type="primary">保存</el-button>
                            <el-button size="mini"
                                @click="reset()">重置</el-button>
                            <el-button size="mini"
                                @click="saveGen()"
                                type="success">生成</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import $ from "jQuery";

export default {
  name: "CrowdAdd",
  data() {
    return {
      crowdData: {
        name: "",
        target: [
          {
            id: 1,
            projectid: "",
            crowdsid: ""
          }
        ],
        comments: ""
      },
      make: 0
    };
  },

  methods: {
    addItem() {
      let length = this.crowdData.target.length;
      this.crowdData.target.push({
        id: length + 1,
        projectid: "",
        crowdsid: ""
      });
    },

    deleteItem(id) {
      this.crowdData.target = this.crowdData.target.filter(item => {
        return item.id != id;
      });
    },

    saveDir() {
      this.make = 0;
      this.save();
    },
    saveGen() {
      this.make = 1;
      this.save();
    },
    save() {
      let setData = _.cloneDeep(this.crowdData);

      if (setData.name.replace(/\s+/g, "") == "") {
        this.$message({
          message: "请填写人群包名称",
          type: "error"
        });
        return false;
      }

      for (let item in setData.target) {
        if (
          setData.target[item].projectid == "" ||
          setData.target[item].crowdsid == ""
        ) {
          this.$message({
            message: "请完善内容中项目id，人群id",
            type: "error"
          });
          return false;
        }
      }

      setData.target = setData.target.map(item => {
        //将target中的id去掉
        let projectid = item.projectid;
        let crowdsid = item.crowdsid;
        return {
          projectid,
          crowdsid
        };
      });

      setData.advertiser_id = this.ader_id;
      setData.make = this.make;

      setData.group_type = "2";
      this.fetch_create_post(setData);
    },

    fetch_create_post(params) {
      fetch
        .post("/group/third_create", params)
        .then(res => {
          if (res.ret == 0 && res.data) {
            this.$router.push({
              path: "list"
            });
          } else {
            if (this.make == 0) {
              this.$alert(res.msg, "保存失败", {
                confirmButtonText: "确定",
                type: "error"
              });
            } else {
              this.$alert(res.msg, "生成失败", {
                confirmButtonText: "确定",
                type: "error"
              });
            }
          }
        })
        .catch(err => {
          this.$alert("操作失败", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },

    reset() {
      this.crowdData = {
        name: "",
        target: [
          {
            id: 1,
            projectid: "",
            crowdsid: ""
          }
        ],
        comments: ""
      };
    }
  },
  computed: {
    ...mapState("ad", ["ader_id"])
  }
};
</script>
<style scoped>
.content {
  font-size: 12px;
  width: 105%;
  display: flex;
}

.content-inline {
  float: left;
  width: 50%;
}

.content-inline div {
  width: 70%;
}

.content-icon {
  float: left;
  font-size: 18px;
}

.content-icon i {
  font-size: 18px;
  cursor: pointer;
}

.content-label-left {
  display: inline-block;
  width: 20%;
  float: left;
}

.content-label-right {
  display: inline-block;
  width: 30%;
  float: left;
  text-align: right;
}

.step_wrap {
  background: #fff;
  padding: 10px 15px;
  margin: 1px 0 1px 0;
  overflow: hidden;
  position: relative;
}

.step_wrap .title {
  float: left;
  width: 200px;
  height: 46px;
  line-height: 46px;
}
</style>