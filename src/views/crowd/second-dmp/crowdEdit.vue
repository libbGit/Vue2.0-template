<template>
    <div>

        <div class="campaign__wrap">
            <div class="step_wrap">
                <div class="title">
                    <router-link to="../list">
                        <el-button size="mini"
                            icon="el-icon-arrow-left"
                            title="返回">
                        </el-button>
                    </router-link>
                    <span>{{$route.params.type=="edit"?"编辑":"复制"}}人群包</span>
                </div>
            </div>
            <div class="form-wrap" v-loading="isLoading">
                <div style="width: 500px;">
                    <el-form label-width="120px" size="mini">
                        <el-form-item label="人群包名称:" required>
                            <el-input v-model.trim="crowdData.name"></el-input>
                        </el-form-item>

                        <el-form-item label="内容:" required>
                            <div>
                                <span class="content-inline">
                                    <span class="content-label">token</span>
                                    <el-input v-model.trim="crowdData.target.token"></el-input>
                                </span>
                            </div>
                            <div class="content"
                                v-for="(item,index) in crowdData.target.tagids"
                                :key="index">
                                <span class="content-inline">
                                    <span class="content-label">标签id</span>
                                    <el-input v-model.trim="item.tag_id"></el-input>
                                </span>
                                <span v-if="index==0" class="content-icon">
                                    <i @click="addItem"
                                        size="small"
                                        class="el-icon-circle-plus-outline"></i>
                                </span>
                                <span v-else class="content-icon">
                                    <i @click="deleteItem(item.id)"
                                        size="small"
                                        class="el-icon-remove-outline"></i>
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
                                @click="save(0)"
                                type="primary">保存</el-button>
                            <el-button size="mini"
                                @click="save(1)"
                                type="success">生成</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import fetch from "@/services/fetch.js";
import $ from "jQuery";
import { mapState } from "vuex";

export default {
  name: "CrowdCompile",
  data() {
    return {
      isLoading: false,

      crowdData: {
        name: "",
        target: {
          token: "",
          tagids: [{ id: 1, tag_id: "" }]
        },
        comments: ""
      }
    };
  },
  created() {
    this.getCrowdDetail();
  },
  computed: {
    ...mapState("ad", ["ader_id"])
  },
  methods: {
    addItem() {
      let length = this.crowdData.target.tagids.length;
      this.crowdData.target.tagids.push({
        id: length + 1,
        tag_id: ""
      });
    },

    deleteItem(id) {
      this.crowdData.target.tagids = this.crowdData.target.tagids.filter(
        item => {
          return item.id != id;
        }
      );
    },

    getCrowdDetail() {
      this.isLoading = true;
      fetch.post("/group/get", { id: this.$route.params.id }).then(res => {
        this.isLoading = false;
        if (this.$route.params.type == "edit") {
          this.crowdData.name = res.data.name;
        }

        this.crowdData.target.token = res.data.target.token;
        this.crowdData.target.tagids = [];
        for (let item of res.data.target.tagids) {
          let length = this.crowdData.target.tagids.length;
          this.crowdData.target.tagids.push({
            id: length + 1,
            tag_id: item
          });
        }
        this.crowdData.comments = res.data.comments;
      });
    },

    save(st) {
      let setData = _.cloneDeep(this.crowdData);
      setData.make = st ? 1 : 0;
      if (setData.name.replace(/\s+/g, "") == "") {
        this.$message({
          message: "请填写人群包名称",
          type: "error"
        });
        return false;
      }

      if (setData.target.token == "") {
        this.$message({
          message: "请填写人内容token",
          type: "error"
        });
        return false;
      }

      for (let item in setData.target.tagids) {
        if (setData.target.tagids[item].tag_id == "") {
          this.$message({
            message: "请完善内容中标签id",
            type: "error"
          });
          return false;
        }
      }

      setData.target.tagids = setData.target.tagids.map((item) => {
        return item.tag_id;
      });

      let _url =
        this.$route.params.type == "edit"
          ? "/group/third_update"
          : "/group/third_create";
      if (this.$route.params.type == "edit") {
        setData.id = this.$route.params.id;
      } else {
        setData.advertiser_id = this.ader_id;
        setData.group_type = "3";
      }

      this.fetch_create_post(_url, setData);
    },

    fetch_create_post(url, params) {
      fetch
        .post(url, params)
        .then(res => {
          if (res.ret == 0 && res.data) {
            this.$router.push({ name: "CrowdSecondDmpList" });
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
    }
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
  width: 100%;
}

.content-inline div {
  width: 90%;
}

.content-icon {
  float: left;
  font-size: 18px;
}

.content-icon i {
  font-size: 18px;
  cursor: pointer;
}

.content-label {
  display: inline-block;
  width: 10%;
  float: left;
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
