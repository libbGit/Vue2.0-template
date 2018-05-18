<template>
    <div class="form-wrap">
        <h2>新建媒体点位</h2>
        <el-form class="form-container1"
            size="mini"
            ref="form"
            :model="form"
            :rules="rules"
            label-width="100px">
            <div class="form_normal">
                <el-form-item label="PBS媒体"
                    prop="pbs_media_id">
                    <el-select v-model="form.pbs_media_id"
                        placeholder="请选择"
                        @change="fetch_pos_list">
                        <el-option v-for="item in media_list "
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联PBS点位"
                    prop="pbs_pos_ids"
                    style="width:950px">
                    <el-button size="mini"
                        @click.native="relate"
                        style="margin-bottom: 10px;">关联</el-button>
                    <el-table border
                        size="mini"
                        :data="form.pbs_pos_ids"
                        style="width: 100%"
                        class="relate-table"
                        max-height="250">
                        <el-table-column header-align="center"
                            align="center"
                            prop="pbs_media_id"
                            label="PBS媒体ID"
                            width="100">
                        </el-table-column>
                        <el-table-column header-align="center"
                            align="center"
                            prop="pbs_media_name"
                            label="PBS媒体名称"
                            width="200">
                        </el-table-column>
                        <el-table-column header-align="center"
                            align="center"
                            prop="pbs_pos_id"
                            label="PBS点位ID"
                            width="100">
                        </el-table-column>
                        <el-table-column header-align="center"
                            align="center"
                            prop="pbs_pos_name"
                            label="PBS点位名称">
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="媒体名称"
                    prop="media_name">
                    <el-input v-model.trim="form.media_name"></el-input>
                </el-form-item>
                <el-form-item label="点位名称"
                    prop="name">
                    <el-input v-model.trim="form.name"></el-input>
                </el-form-item>
                <el-form-item label="点位描述">
                    <el-input v-model.trim="form.pos_description"></el-input>
                </el-form-item>
                <el-form-item label="DealID"
                    prop="dealID">
                    <el-input v-model="form.dealID"
                        placeholder="多个dealID以，分隔"></el-input>
                </el-form-item>
                <el-form-item label="LineID"
                    prop="LineID">
                    <el-input v-model="form.LineID"
                        placeholder="多个LineID以，分隔"></el-input>
                </el-form-item>
                <el-form-item label="单价"
                    prop="price">
                    <el-input v-model.trim="form.price"
                        style="width: 200px">
                        <template slot="append">元/CPM</template>
                    </el-input>
                    <!--<el-input  v-model.trim="form.price" @blur="hide_price" @focus="show_price"></el-input>-->
                    <div id="f_price"
                        class="show_price">
                        {{f_price}}
                    </div>
                </el-form-item>
                <el-form-item label="出价"
                    prop="price_conf">
                    <el-input v-model.trim="form.price_conf"
                        style="width: 200px">
                        <template slot="append">元</template>
                    </el-input>
                    <div id="f_price_conf"
                        class="show_price">
                        {{f_price_conf}}
                    </div>
                </el-form-item>

                <el-form-item label="点位规格"
                    prop="pos_spec">
                    <el-input type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="最多500个字符"
                        v-model.trim="form.pos_spec">
                    </el-input>
                </el-form-item>
                <el-form-item label="选择平台"
                    prop="platform_id">
                    <el-select v-model="form.platform_id"
                        placeholder="请选择">
                        <el-option v-for="item in platform_list "
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="媒体类型"
                    prop="mediatype_id">
                    <el-select v-model="form.mediatype_id"
                        placeholder="请选择">
                        <el-option v-for="item in mediatype_list "
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择频道"
                    prop="channel_id">
                    <el-select v-model="form.channel_id"
                        placeholder="请选择">
                        <el-option v-for="item in channel_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="页面位置"
                    prop="position_id">
                    <el-select v-model="form.position_id"
                        placeholder="请选择">
                        <el-option v-for="item in position_list "
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告形式"
                    prop="adform_id">
                    <el-select v-model="form.adform_id"
                        placeholder="请选择">
                        <el-option v-for="item in adform_list "
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="监测类型">
                    <div class="monitor-type">
                        <span class="expose"
                            :class="{active:form.trackpv==1}">曝光可检测
                            <i class="el-icon-success"></i>
                        </span>
                        <span :class="{active:form.trackclk==1}">点击可检测
                            <i class="el-icon-success"></i>
                        </span>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                        @click="onSubmit">保存</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </div>
        </el-form>

        <!-- pbs点位关联dialog -->
        <pbs-relate :values="pos_ids"
            v-if="showRelateDialog"
            @close="closeMatchDialog"
            @update="updateRelateTable"
            :mediaId="selected_media_id">
        </pbs-relate>
    </div>
</template>
<script>
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import pbsRelate from "./pbs-relate";

export default {
  data() {
    let checkdealID = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        let reg = /^(([0-9]\,)*([0-9]))+$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("格式不正确"));
        }
      }
    };
    let checkPrice = (rule, value, callback) => {
      if (!value) {
        this.f_price = "";
        document.getElementById("f_price").style.display = "none";
        return callback(new Error("请输入单价"));
      } else {
        let reg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
        if (reg.test(value)) {
          document.getElementById("f_price").style.display = "block";
          this.f_price = this.$formatPrice(this.$toDecimal2(value));
          callback();
        } else {
          document.getElementById("f_price").style.display = "none";
          callback(new Error("格式不正确"));
        }
      }
    };

    let checkPriceConf = (rule, value, callback) => {
      if (!value) {
        this.f_price_conf = "";
        document.getElementById("f_price_conf").style.display = "none";
        return callback(new Error("请输入出价"));
      } else {
        let reg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
        if (reg.test(value)) {
          document.getElementById("f_price_conf").style.display = "block";
          this.f_price_conf = this.$formatPrice(this.$toDecimal2(value));
          callback();
        } else {
          document.getElementById("f_price_conf").style.display = "none";
          callback(new Error("格式不正确"));
        }
      }
    };

    return {
      showRelateDialog: false, //关联pbs点位 dialog
      form: {
        name: "",
        media_name: "",
        pbs_pos_ids: [],
        LineID: "",
        dealID: "",
        price: "",
        price_conf: 500,
        pbs_media_id: "",
        platform_id: "",
        mediatype_id: "",
        channel_id: "",
        position_id: "",
        adform_id: "",
        pos_description: "",
        trackpv: 0, //曝光检测
        trackclk: 0 //点击检测
      },
      pos_ids: [],
      f_price: "",
      f_price_conf: "",
      media_list: [],
      pos_list: [],
      platform_list: [],
      mediatype_list: [],
      channel_list: [],
      position_list: [],
      adform_list: [],
      rules: {
        media_name: [
          { required: true, message: "请输入媒体名称", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入点位名称", trigger: "change" }
        ],
        // pos_description: [
        //   {required: true, message: '请输入点位描述', trigger: 'blur'},
        // ],
        pbs_pos_ids: [
          { required: true, message: "请选择PBS点位", trigger: "blur" }
        ],
        pbs_media_id: [
          { type: "number", required: true, message: "请选择媒体", trigger: "change" }
        ],
        platform_id: [
          { type: "number", required: true, message: "请选择平台", trigger: "change" }
        ],
        mediatype_id: [
          { type: "number", required: true, message: "请选择媒体类型", trigger: "change" }
        ],
        channel_id: [
          { type: "number", required: true, message: "请选择频道", trigger: "change" }
        ],
        position_id: [
          { type: "number", required: true, message: "请选择页面位置", trigger: "change" }
        ],
        adform_id: [
          { type: "number", required: true, message: "请选择广告形式", trigger: "change" }
        ],
        pos_spec: [
          { required: true, message: "请输入点位规格", trigger: "blur" },
          { min: 1, max: 500, message: "最多500个字符", trigger: "blur" }
        ],
        dealID: [{ validator: checkdealID, trigger: "blur" }],
        LineID: [{ validator: checkdealID, trigger: "blur" }],
        price: [{ validator: checkPrice, trigger: "change", required: true }],
        price_conf: [
          { validator: checkPriceConf, trigger: "change", required: true }
        ]
      },
      selected_media_id: 0
    };
  },
  mounted() {
    this.fetch_media_list();
    this.fetch_tags_list();

    this.$refs["form"].validateField('price_conf');
  },
  methods: {
    fetch_media_list() {
      return new Promise((resolve, reject) => {
        fetch.post("/mediaPos/select")
          .then(res => {
            if (res.ret === 0 && res.data) {
              this.media_list = res.data;
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    fetch_tags_list() {
      return new Promise((resolve, reject) => {
        fetch.post("/mediaPos/tagList")
          .then(res => {
            if (res.ret === 0 && res.data) {
              this.platform_list = res.data[0].tag;
              this.mediatype_list = res.data[1].tag;
              this.channel_list = res.data[2].tag;
              this.position_list = res.data[3].tag;
              this.adform_list = res.data[4].tag;
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    fetch_pos_list() {
      let media = this.media_list.filter(data => {
        return data.id === this.form.pbs_media_id;
      });
      this.pos_list = media[0].pos;
      this.form.media_name = media[0].name;
      this.form.pbs_pos_id = "";
      this.form.name = "";
      this.form.pos_description = "";

      this.selected_media_id = media[0].id;
      this.form.trackpv = media[0].trackpv; //曝光检测
      this.form.trackclk = media[0].trackclk; //点击检测

      //重置点位列表
      this.form.pbs_pos_ids = [];  //10550
    },
    set_pos_name(val) {
      let obj = {};
      obj = this.pos_list.find(item => {
        return item.id === val;
      });
      this.form.name = obj.name;
      this.form.pos_description = obj.name;
    },

    /**关联pbs点位 */
    relate() {
      if (this.form.pbs_media_id == '') {
        this.$message.warning('请先选择PBS媒体');
        return;
      }

      this.pos_ids = this.form.pbs_pos_ids.map((item) => {
        return +item.pbs_pos_id;
      });

      this.showRelateDialog = true;
    },

    closeMatchDialog() {
      this.showRelateDialog = false;
    },

    /**更新pbs点位表格 */
    updateRelateTable(data) {
      console.log("data===", data);
      this.form.pbs_pos_ids = [];

      this.$nextTick(() => {
        this.form.pbs_pos_ids = data;
        this.$refs["form"].validateField("pbs_pos_ids");
      })
    },

    //取消
    onCancel() {
      const _path = this.$route.matched[0].path;
      this.$router.push({
        path: _path
      });
    },

    //提交数据
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = _.cloneDeep(this.form);
          params.price = this.$toDecimal2(this.form.price);
          params.price_conf = this.$toDecimal2(this.form.price_conf);
          params.pbs_pos_id = this.form.pbs_pos_ids.map(item => {
            return item.pbs_pos_id;
          }).join();

          fetch.post("/mediaPos/addPos", params)
            .then(res => {
              if (res.ret === 0) {
                const _path = this.$route.matched[0].path;
                this.$router.push({
                  path: _path
                });
              } else {
                this.$alert(res.msg, '创建媒体点位失败', {
                  confirmButtonText: '确定',
                  type: 'error'
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  components: {
    pbsRelate
  }
};
</script>
<style scoped>
.relate-table {
  max-height: 100px;
  /* transition: all 1s ease-in-out; */
}

.relate-table.active {
  max-height: 250px;
  overflow: auto;
}

.monitor-type {
  color: #606266;
  font-size: 12px;
}

.monitor-type .expose {
  display: inline-block;
  margin-right: 20px;
}
.monitor-type span.active {
  color: #67c23a;
}
</style>
