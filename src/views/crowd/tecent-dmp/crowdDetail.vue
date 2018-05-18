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
                    <el-form label-width="120px"
                        size="mini"
                        class="detail-form">
                        <el-form-item label="人群包名称:">
                            {{crowdData.name}}
                        </el-form-item>

                        <el-form-item label="内容:">
                            <div class="content"
                                v-for="(item,index) in crowdData.target"
                                :key="index">
                                <span class="content-inline">
                                    <span class="content-label-left">项目id:</span>
                                    {{item.projectid}}
                                </span>
                                <span class="content-inline">
                                    <span class="content-label-right">人群包id:</span>
                                    {{item.crowdsid}}
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
        type: "1",
        target: [{ id: 1, projectid: "", crowdsid: "" }],
        comments: ""
      },

      make: 0
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
    getCrowdDetail() {
      this.isLoading = true;
      fetch.post("/group/get", { id: this.$route.params.id }).then(res => {
        // res = {
        //   ret: 0,
        //   msg: "",
        //   data: {
        //     id: "62",
        //     name: "qwe",
        //     ids: [
        //       { projectid: "1", crowdsid: "1" },
        //       { projectid: "2", crowdsid: "2" },
        //       { projectid: "3", crowdsid: "3" }
        //     ],
        //     comments: "32131231231232112",
        //   }
        // };

        this.isLoading = false;
        this.crowdData.name = res.data.name;

        this.crowdData.target = [];
        for (let item in res.data.target) {
          let length = this.crowdData.target.length;
          let id_item = res.data.target[item];
          this.crowdData.target.push({
            id: length + 1,
            projectid: id_item.projectid,
            crowdsid: id_item.crowdsid
          });
        }
        this.crowdData.comments = res.data.comments;
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
  width: 23%;
  float: left;
}

.content-label-right {
  display: inline-block;
  width: 30%;
  float: left;
  text-align: right;
  margin-right: 10px;
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
