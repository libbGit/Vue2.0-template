<template>
    <div>
        <div class="campaign__wrap">
            <div class="step_wrap">
                <div class="title">
                    <router-link to="list">
                        <el-button size="mini"
                            icon="el-icon-arrow-left"
                            title="返回"></el-button>
                    </router-link>
                    <span>新建人群包</span>
                </div>
            </div>

            <div class="form-wrap"
                v-loading="isLoading">
                <div style="width: 500px;">
                    <el-form label-width="120px"
                        size="mini">
                        <el-form-item label="人群包名称:"
                            required>
                            <el-input v-model="crowdData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="有效期:"
                            required>
                            <el-radio-group v-model="crowdData.validaty">
                                <el-radio label="30">30天</el-radio>
                                <el-radio label="60">60天</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="定向类型:"
                            required>
                            <el-radio-group v-model="crowdData.type">
                                <el-radio label="1">属性定向</el-radio>
                                <el-radio label="2">ID 定向</el-radio>
                                <el-radio label="3">重定向</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div v-show="crowdData.type==1">
                            <el-form-item>
                                <el-tree ref="treeAttr"
                                    :data="tree_data"
                                    node-key="value"
                                    :props="defaultProps"
                                    show-checkbox>
                                </el-tree>
                            </el-form-item>
                        </div>
                        <div v-show="crowdData.type==2">
                            <div>
                                <el-form-item label="方式：">
                                    <el-select v-model="idType"
                                        placeholder="请选择">
                                        <el-option v-for="item in idOptions"
                                            :key="item.id_type"
                                            :label="item.label"
                                            :value="item.id_type">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <input type="file"
                                        @change="getIdFile"
                                        name="file"
                                        id="file">
                                    <div style="font-size:12px;color:#606266;">只能上传txt文件</div>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox v-model="idMd5"
                                        v-show="idType!=1">使用MD5加密</el-checkbox>
                                </el-form-item>
                            </div>
                        </div>
                        <div v-show="crowdData.type==3">
                            <el-form-item label="重定向方式:"
                                required>
                                <el-radio-group v-model="redType">
                                    <el-radio label="clk">点击找回</el-radio>
                                    <el-radio label="site">网站监测</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-show="redType=='clk'">
                                <el-form-item label="数据时间:"
                                    required>
                                    <el-date-picker v-model="clkdate"
                                        type="daterange"
                                        value-format="yyyy-MM-dd"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="选择层级:"
                                    required>
                                    <el-radio-group v-model="clkLevel"
                                        @change="getLevel">
                                        <el-radio label="adv">广告主</el-radio>
                                        <!--<el-radio label="brand">品牌</el-radio>-->
                                        <!--<el-radio label="line">产品线</el-radio>-->
                                        <el-radio label="project">项目</el-radio>
                                        <el-radio label="campaign">活动</el-radio>
                                        <el-radio label="ad">推广计划</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item>
                                    <div style="float: left; border: 1px solid #eee">
                                        <div style="padding: 5px; background-color: #fafafa; line-height: 24px; border-bottom: 1px #eee solid">
                                            请选择
                                        </div>
                                        <div style="width: 300px;height: 400px; overflow: auto ;">
                                            <el-tree :data="clkTree"
                                                ref="treeClkIds"
                                                show-checkbox
                                                node-key="id"
                                                default-expand-all>
                                            </el-tree>
                                        </div>
                                    </div>
                                </el-form-item>

                            </div>
                            <div v-show="redType=='site'">
                                <el-form-item label="数据时间:"
                                    required>
                                    <el-date-picker v-model="sitedate"
                                        type="daterange"
                                        value-format="yyyy-MM-dd"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="选择类型:"
                                    required>
                                    <el-radio-group v-model="siteType">
                                        <el-radio label="url">网站url</el-radio>
                                        <el-radio label="ids">网站ID</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="内容:"
                                    required>
                                    <el-input type="textarea"
                                        :rows="2"
                                        placeholder="多个url或多个ID填入时,请以,分隔"
                                        v-model="site_keys">
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>
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
      isLoading: false,
      dataAttr: "",
      crowdData: {
        name: "",
        validaty: "30",
        type: "1"
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
      tree_data: [],
      defaultProps: {
        children: "child",
        label: "label"
      },

      idType: 1,
      idFile: "",
      idMd5: false,

      redType: "clk",
      clkdate: "",
      sitedate: "",
      clkLevel: "adv",
      siteType: "url",
      site_keys: "",
      clkTree: [],
      make: 0,
    };
  },
  watch: {
    crowdData: {
      handler: function (val) {
        if (val.type == '3') {
          this.getLevelData();
        }
      },
      deep: true
    }
  },

  created() {
    this.getTreeAttrData();
  },
  methods: {
    async getTreeAttrData() {
      this.isLoading = true;
      await fetch.post("/group/tags").then(res => {
        this.isLoading = false;
        if (res.ret == 0) {
          this.tree_data = _.cloneDeep(res.data);
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    getLevel() {
      this.clkTree = [];
      this.$refs.treeAttr.setCheckedKeys([]);
      this.$refs.treeClkIds.setCheckedKeys([]);
      this.getLevelData();
    },
    async getLevelData() {
      this.isLoading = true;
      await fetch.post("/group/getAdNodes", { type: this.clkLevel }).then(res => {
        this.isLoading = false;
        if (res.ret === 0 && res.data) {
          this.clkTree = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });

    },
    getIdFile(e) {
      this.idFile = e.target.files[0];
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
      var setData = _.cloneDeep(this.crowdData);
      if (setData.name.replace(/\s+/g, "") == "") {
        this.$message({
          message: "请填写人群包名称",
          type: "error"
        });
        return false;
      }
      setData.advertiser_id = this.ader_id;
      setData.make = this.make;
      if (setData.type == 1) {
        setData.tag_ids = this.$refs.treeAttr.getCheckedKeys().join(",");
        if (setData.tag_ids == "") {
          this.$message({
            message: "请选择属性定向标签",
            type: "error"
          });
          return false;
        }
      } else if (setData.type == 2) {
        setData.id_type = this.idType;
        setData.file = this.idFile;
        if (setData.file == "") {
          this.$message({
            message: "请选择上传文件",
            type: "error"
          });
          return false;
        }
        if (setData.id_type != 1) {
          if (this.idMd5) {
            setData.encryption = 1;
          } else {
            setData.encryption = 0;
          }
        }
      } else if (setData.type == 3) {
        setData.re_target_mode = this.redType;
        if (setData.re_target_mode == "clk") {
          if (this.clkdate == "" || this.clkdate == null) {
            this.$message({
              message: "请选择数据时间",
              type: "error"
            });
            return false;
          }
          setData.data_scope_start = this.clkdate[0];
          setData.data_scope_end = this.clkdate[1];
          setData.level = this.clkLevel;
          setData.ids = this.$refs.treeClkIds.getCheckedKeys().join(",");
          if (setData.ids == "") {
            this.$message({
              message: "请选择标签",
              type: "error"
            });
            return false;
          }
        } else if (setData.re_target_mode == "site") {
          if (this.sitedate == "" || this.sitedate == null) {
            this.$message({
              message: "请选择数据时间",
              type: "error"
            });
            return false;
          }
          setData.data_scope_start = this.sitedate[0];
          setData.data_scope_end = this.sitedate[1];
          setData.site_type = this.siteType;
          setData.site_keys = this.site_keys;
          if (setData.site_keys == "") {
            this.$message({
              message: "请填写内容",
              type: "error"
            });
            return false;
          }
        }
      }

      setData.group_type = "1";

      var formData = new FormData();
      $.each(setData, function (key, tar) {
        formData.append(key, tar);
      });

      fetch.post("/group/create", formData).then(res => {
        if (res.ret == 0) {
          this.$router.push({ name: "CrowdHyDmpList" });
        } else {
          if (this.make == 0) {
            this.$alert(res.msg, '保存失败', {
              confirmButtonText: '确定',
              type: 'error'
            })
          } else {
            this.$alert(res.msg, '生成失败', {
              confirmButtonText: '确定',
              type: 'error'
            })
          }
        }
      }).catch(err => { });
    },

    reset() {
      this.crowdData = {
        name: "",
        validaty: "30",
        type: "1"
      };
      this.$refs.treeAttr.setCheckedKeys([]);
      this.idType = 1;
      this.idFile = "";
      this.idMd5 = false;
      document.getElementById("file").value = "";
      this.redType = "clk";
      this.clkdate = "";
      this.clkLevel = "adv";
      this.$refs.treeClkIds.setCheckedKeys([]);
      this.sitedate = "";
      this.siteType = "url";
      this.site_keys = "";
    }
  },
  computed: {
    ...mapState("ad", ["ader_id"])
  },
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
</style>
