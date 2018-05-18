<template>
    <div>
        <div class="campaign__wrap">
            <div class="step_wrap">
                <div class="title">
                    <router-link to="../list">
                        <el-button size="mini"
                            icon="el-icon-arrow-left"
                            title="返回"></el-button>
                    </router-link>
                    <span>人群包详情</span>
                </div>
            </div>
            <div class="form-wrap"
                v-loading="isLoading">
                <div style="width: 500px;">
                    <el-form label-width="120px"
                        size="mini"
                        class="detail-form">
                        <el-form-item label="人群包名称:">
                            {{crowdData.name}}
                        </el-form-item>
                        <el-form-item label="有效期:">
                            {{crowdData.validaty}}天
                        </el-form-item>
                        <el-form-item label="定向类型:">
                            <template v-if="crowdData.type=='1'">
                                属性定向
                            </template>
                            <template v-if="crowdData.type=='2'">
                                ID 定向
                            </template>
                            <template v-if="crowdData.type=='3'">
                                重定向
                            </template>
                        </el-form-item>

                        <div v-show="crowdData.type==1"
                            class="crowdDetail-tree">
                            <el-form-item>
                                <div style="float: left; border: 1px solid #eee">
                                    <div style="width: 300px;height: 400px; overflow: auto ;">
                                        <el-tree :data="tree_data"
                                            node-key="value"
                                            :props="defaultProps"
                                            ref="treeAttr"
                                            :render-after-expand="false"
                                            :filter-node-method="filterNode"
                                            :render-content="renderContent">
                                        </el-tree>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                        <div v-show="crowdData.type==2">
                            <div>
                                <el-form-item label="方式：">
                                    {{getIdTypeName}}
                                </el-form-item>
                                <el-form-item>
                                    <span>{{getFileName}}</span>
                                </el-form-item>
                                <el-form-item>
                                    <template v-if="idType!=1 && idMd5">
                                        使用MD5加密
                                    </template>
                                </el-form-item>
                            </div>
                        </div>
                        <div v-show="crowdData.type==3">
                            <el-form-item label="重定向方式:">
                                <template v-if="redType=='clk'">
                                    点击找回
                                </template>
                                <template v-if="redType=='site'">
                                    网站监测
                                </template>
                            </el-form-item>
                            <div v-show="redType=='clk'">
                                <el-form-item label="数据时间:">
                                    {{clkdate[0]}} 至 {{clkdate[1]}}
                                </el-form-item>
                                <el-form-item label="选择层级:">
                                    <template v-if="clkLevel=='adv'">
                                        广告主
                                    </template>
                                    <template v-if="clkLevel=='project'">
                                        项目
                                    </template>
                                    <template v-if="clkLevel=='campaign'">
                                        活动
                                    </template>
                                    <template v-if="clkLevel=='ad'">
                                        推广计划
                                    </template>
                                </el-form-item>
                                <el-form-item>
                                    <div style="float: left; border: 1px solid #eee">
                                        <div style="width: 300px;height: 400px; overflow: auto ;">
                                            <el-tree :data="clkTree"
                                                default-expand-all
                                                node-key="id"
                                                ref="treeClkIds"
                                                :filter-node-method="filterClkNode"
                                                :render-content="renderClkContent">
                                            </el-tree>
                                        </div>
                                    </div>
                                </el-form-item>
                            </div>
                            <div v-show="redType=='site'">
                                <el-form-item label="数据时间:">
                                    {{sitedate[0]}} 至 {{sitedate[1]}}
                                </el-form-item>
                                <el-form-item label="选择类型:">
                                    <template v-if="siteType=='url'">
                                        网站url
                                    </template>
                                    <template v-if="siteType=='ids'">
                                        网站ID
                                    </template>
                                </el-form-item>
                                <el-form-item label="内容:">
                                    <div class="content-area">
                                        {{site_keys}}
                                    </div>
                                </el-form-item>
                            </div>
                        </div>
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
        validaty: "",
        type: ""
      },
      tree_data: [],

      tree_flag: [],
      defaultProps: {
        children: "child",
        label: "label"
      },

      idOptions: [
        {
          id_type: 1,
          label: "Cookie"
        },
        {
          id_type: 2,
          label: "IDFA"
        },
        {
          id_type: 3,
          label: "IMEI"
        }
      ],
      idType: 1,
      idFile: "",
      idMd5: false,

      redType: "",
      clkdate: [],
      sitedate: [],
      clkLevel: "",
      siteType: "url",
      site_keys: "",
      clkTree: [],

      make: 0
    };
  },
  created() {
    this.initData();
  },
  computed: {
    ...mapState("ad", ["ader_id"]),
    getIdTypeName() {
      return this.idOptions.filter(item => {
        return item.id_type == this.idType;
      })[0].label;
    },

    getFileName() {
      return this.idFile.substring(this.idFile.lastIndexOf("/") + 1);
    }
  },
  methods: {
    async initData() {
      await this.getTreeAttrData();
      await this.getCrowdDetail();
    },
    async getTreeAttrData() {
      this.isLoading = true;
      await fetch.post("/group/tags").then(res => {
        this.tree_data = _.cloneDeep(res.data);
        this.tree_flag = _.cloneDeep(res.rawData);
      });
    },
    async getCrowdDetail() {
      await fetch
        .post("/group/get", { id: this.$route.params.id })
        .then(res => {
          this.crowdData.name = res.data.name;
          this.crowdData.validaty = res.data.validaty;
          this.crowdData.type = res.data.type;
          if (res.data.type == 1) {
            let ids = res.data.tag_ids.split(",");

            this.$nextTick(() => {
              setTimeout(() => {
                this.$refs.treeAttr.filter(ids);

                this.isLoading = false;
              }, 1000);
            });
          }
          if (res.data.type == 2) {
            this.idType = Number(res.data.id_type);
            this.idFile = res.data.file;
            this.idMd5 = Number(res.data.encryption) ? true : false;

            this.isLoading = false;
          }
          if (res.data.type == 3) {
            this.redType = res.data.re_target_mode;
            if (this.redType == "clk") {
              this.clkdate = [
                res.data.data_scope_start,
                res.data.data_scope_end
              ];
              this.clkLevel = res.data.level;
              let _idNames = res.data.ids.split(",");

              this.getLevelData().then(() => {
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.$refs.treeClkIds.filter(_idNames);

                    this.isLoading = false;
                  }, 1000);
                });
              });
            }
            if (this.redType == "site") {
              this.sitedate = [
                res.data.data_scope_start,
                res.data.data_scope_end
              ];
              this.siteType = res.data.site_type;
              this.site_keys = res.data.site_keys;

              this.isLoading = false;
            }
          }
        });
    },

    async getLevelData() {
      await fetch
        .post("/group/getAdNodes", { type: this.clkLevel })
        .then(res => {
          if (res.ret === 0 && res.data) {
            this.clkTree = res.data;
          }
        });
    },

    filterNode(value, data) {
      if (!value) return true;
      return value.indexOf(data.value) !== -1;
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span />
        </span>
      );
    },

    filterClkNode(value, data) {
      if (!value) return true;
      return value.indexOf(data.id) !== -1;
    },
    renderClkContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span />
        </span>
      );
    }
  }
};
</script>

<style scoped>
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
