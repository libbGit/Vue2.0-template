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
                    <span>人群包详情</span>
                </div>
            </div>
            <div class="form-wrap" v-loading="isLoading">
                <div style="width: 500px;">
                    <el-form label-width="120px" size="mini" class="detail-form">
                        <el-form-item label="人群包名称:">
                            {{crowdData.name}}
                        </el-form-item>

                        <el-form-item label="内容:">
                            <div>
                                <span class="content-inline">
                                    <span class="content-label">token：</span>
                                    {{crowdData.target.token}}
                                </span>
                            </div>
                            <div class="content"
                                v-for="(item,index) in crowdData.target.tagids"
                                :key="index">
                                <span class="content-inline">
                                    <span class="content-label">标签id:</span>
                                    {{item.tag_id}}
                                </span>
                            </div>
                        </el-form-item>

                        <el-form-item label="备注:">
                            <div class="content-area">
                                {{crowdData.comments}}
                            </div>
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
  methods: {
    getCrowdDetail() {
      this.isLoading = true;
      fetch.post("/group/get", { id: this.$route.params.id }).then(res => {
        this.isLoading = false;
        this.crowdData.name = res.data.name;
        this.crowdData.target.token = res.data.target.token;

        this.crowdData.target.tagids = [];
        for (let item of res.data.target.tagids) {
          let length = this.crowdData.target.tagids.length;
          this.crowdData.target.tagids.push({ id: length + 1, tag_id: item });
        }

        this.crowdData.comments = res.data.comments;
      });
    },

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
  width: 13%;
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

.content-area {
  font-size: 12px;
  word-break: break-word;
  max-height: 150px;
  overflow: auto;
}
</style>
<style>
.detail-form .el-form-item__content {
  font-size: 12px;
}
</style>
