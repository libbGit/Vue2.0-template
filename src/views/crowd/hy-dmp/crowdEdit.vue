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
                    <span>{{$route.params.type=="edit"?"编辑":"复制"}}人群包</span>
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
                                <el-tree :data="tree_data"
                                    node-key="value"
                                    :props="defaultProps"
                                    ref="treeAttr"
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
                                        name="file">
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
                                                show-checkbox
                                                default-expand-all
                                                node-key="id"
                                                ref="treeClkIds">
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
                                    <el-radio-group v-model="siteType"
                                        @change='site_keys=""'>
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
        validaty: "30",
        type: "1"
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

      redType: "clk",
      clkdate: [],
      sitedate: [],
      clkLevel: "",
      siteType: "url",
      site_keys: "",
      clkTree: [],
      make: 0,
    };
  },

  created() {
    // this.tree_data = tree_group.data;
    this.getTreeAttrData();
  },
  computed: {
    ...mapState("ad", ["ader_id"])
  },
  methods: {
    getTreeAttrData() {
      this.isLoading = true;
      fetch.post("/group/tags").then(res => {
        this.tree_data = _.cloneDeep(res.data);
        this.tree_flag = _.cloneDeep(res.rawData);
        this.getCrowdDetail();
      });
    },
    getCrowdDetail() {
      fetch.post("/group/get", { id: this.$route.params.id }).then(res => {
        this.isLoading = false;
        if (this.$route.params.type == "edit") {
          this.crowdData.name = res.data.name;
        }
        this.crowdData.validaty = res.data.validaty;
        this.crowdData.type = res.data.type;
        if (res.data.type == 1) {
          let ids = res.data.tag_ids.split(",");
          let idsary = [];
          ids.forEach(key => {
            let _obj = { value: key };
            this.tree_flag.map(flat => {
              if (flat.tag_id == key) {
                _obj.label = flat.tag_name.split("|").reverse()[0];
              }
            });
            idsary.push(_obj);
          });
          this.$refs.treeAttr.setCheckedNodes(idsary);
        }
        if (res.data.type == 2) {
          this.idType = Number(res.data.id_type);
          this.idFile = res.data.file;
          this.idMd5 = Number(res.data.encryption) ? true : false;
        }
        if (res.data.type == 3) {
          this.redType = res.data.re_target_mode;
          if (this.redType == "clk") {
            this.clkdate = [res.data.data_scope_start, res.data.data_scope_end];
            this.clkLevel = res.data.level;
            this.getLevelData();
            let _idNames = res.data.ids.split(",");
            this.$refs.treeClkIds.setCheckedKeys(_idNames);
          }
          if (this.redType == "site") {
            this.sitedate = [
              res.data.data_scope_start,
              res.data.data_scope_end
            ];
            this.siteType = res.data.site_type;
            this.site_keys = res.data.site_keys;
          }
        }
      });
    },

    getIdFile(e) {
      this.idFile = e.target.files[0];
    },

    getLevel() {
      this.clkTree = [];
      this.$refs.treeAttr.setCheckedKeys([]);
      this.$refs.treeClkIds.setCheckedKeys([]);
      this.getLevelData();
    },
    getLevelData() {
      fetch.post("/group/getAdNodes", { type: this.clkLevel }).then(res => {
        if (res.ret === 0 && res.data) {
          this.clkTree = res.data;
        }
      });
    },

    save(st) {
      let setData = {};
      setData.make = st ? 1 : 0;
      this.make = st ? 1 : 0;

      setData.name = this.crowdData.name;
      if (setData.name.replace(/\s+/g, "") == "") {
        this.$message({
          message: "请填写人群包名称",
          type: "error"
        });
        return false;
      }
      setData.validaty = this.crowdData.validaty;
      setData.type = this.crowdData.type;
      if (setData.type == 1) {
        setData.tag_ids = this.$refs.treeAttr.getCheckedKeys().join(",");
        if (setData.tag_ids == "") {
          this.$message({
            message: "请选择属性定向标签",
            type: "error"
          });
          return false;
        }
      }
      if (setData.type == 2) {
        setData.id_type = this.idType;
        // if (!setData.file) {this.idFile
        if (!this.idFile) {
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
        setData.file = this.idFile;
      }
      if (setData.type == 3) {
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
      let _url =
        this.$route.params.type == "edit"
          ? "/group/update"
          : "/group/create";
      if (this.$route.params.type == "edit") {
        setData.id = this.$route.params.id;
      } else {
        setData.advertiser_id = this.ader_id;
        setData.group_type = "1";
      }

      const formData = new FormData();
      $.each(setData, function (key, tar) {
        formData.append(key, tar);
      });
      // console.log("compile-setData:", setData);
      // var xhr = new XMLHttpRequest();
      // xhr.open("POST", _url);
      // xhr.addEventListener("load", this.nfComplete, false);
      // xhr.send(formData);
      fetch.post(_url, formData).then(res => {
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
</style>
