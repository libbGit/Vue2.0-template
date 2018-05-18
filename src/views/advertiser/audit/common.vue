<template>
  <!-- 添加媒体 - 优酷 -->
  <el-dialog width="600px"
    :visible='true'
    :title="type =='add' ? '添加媒体': '编辑媒体'"
    @close="handle_dialog_close">
    <div class="media_audit_form">
      <el-form ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
        size="mini">
        <template v-for="(audit,index) in media_audit_rules">
          <!-- --{{audit.field}} -->
          <!-- 文本框 text-->
          <el-form-item v-if="audit.type == 'text'"
            :label="audit.name+'：'"
            :prop="audit.field"
            :key='index'>
            <el-input v-model="form[audit.field]"></el-input>
          </el-form-item>

          <!-- cascader -->
          <el-form-item v-if="audit.type == 'cascader'"
            :label="audit.name+'：'"
            :prop='"_cascader"+index'
            :key='index'>
            <el-cascader :clearable='true'
              style="width:420px"
              :options="audit.data"
              :show-all-levels='setShowAllLevels(audit._type)'
              :change-on-select='setChangeOnSelect(audit._type)'
              :props="{value: 'id', label: 'name', children: 'child'}"
              v-model="form['_cascader'+index]">
            </el-cascader>
          </el-form-item>

          <!-- radio -->
          <el-form-item v-if="audit.type == 'radio'"
            :label="audit.name+'：'"
            :prop="audit.field"
            :key='index'>
            <el-radio-group v-model="form[audit.field]">
              <el-radio v-for="item in audit.data"
                :key="item.value"
                :label="item.value">{{item.name}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        
      </el-form>
      <div style="margin: 0 auto;width: 173px;">
        <el-button type="primary" size="small"
          @click="handle_submit">立即创建</el-button>
        <el-button size="small" @click="handle_dialog_close">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>

import fetch from "@/services/fetch";
import _ from "lodash";
export default {
  name: "common",
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    media_audit_rules: {
      type: Array,
      required: true
    },
    //只有编辑的时候  才有值，否则是一个空对象
    media_audit_content: {
      type: Object
    },
    id: {
      type: String
    },
    ader_id: {
      type: String
    },
    media_id: {
      type: String
    }
  },
  data() {
    return {
      form: {},
      rules: {},
      cascaderKeys: {},
    };
  },
  computed: {
  },
  created() {
    this.initCascaderData();
    this.setRule();
    this.initEdit();
  },
  methods: {
    /**
     * type=1  只显示当前选中菜单里的最后一级   show-all-levels为false显示最后一级，默认是true
     * type=2  选到几级，显示到几级，其实目前pbs这种都是只有一级
     *         change-on-select赋值为true,默认是false
     * type=3  每一级都要显示，一个都不能少
     */
    setShowAllLevels(type) {
      if (type == 1) {
        return false;
      } else {
        return true;
      }
    },
    setChangeOnSelect(type) {
      if (type == 3||type == 1) {
        return false;
      } else {
        return true;
      }
    },
    initEdit() {
      if (this.type == 'edit') {
        let contents = this.media_audit_content;
        let rules = this.media_audit_rules;
        for (let index = 0; index < rules.length; index++) {
          let item = rules[index];
          //级联的数据初始化
          if (item.type == 'cascader') {
            let cascaderVal = [];
            if (item._type==1) {
              if (item.field.length==1) {
                let field = item.field[0]['field'];
                let val = contents[field];
                let firstid = '';
                for (const i of item.data) {
                  for (const j of i.child) {
                    if (j.id==val) {
                      firstid = i.id;
                      break;
                    }
                  }
                }
                cascaderVal.push(firstid,val);
              }else{
                console.error('服务端返回的数据结构和约定的不一致')
              }
            }else{
              for (let i = 0; i < item.field.length; i++) {
                const field = item.field[i]['field'];
                cascaderVal.push(contents[field]);
              }
            }
            
            this.$set(this.form, "_cascader" + index, cascaderVal)
          } else {//非级联的数据初始化
            this.$set(this.form, item.field, contents[item.field])
          }
        }
      }
    },

    initCascaderData() {
      let obj = {};
      for (let index = 0; index < this.media_audit_rules.length; index++) {
        let item = this.media_audit_rules[index];
        if (item.type == 'cascader') {
          //创建form的数据
          obj['_cascader' + index] = [];
          //创建cascaderKeys的数据
          if (Array.isArray(item.field)) {
            let fields = item.field.map(i => i.field);
            this.$set(this.cascaderKeys, '_cascader' + index, fields)
          }
        }
      }
      this.form = obj;
    },
    setRule() {
      for (let index = 0; index < this.media_audit_rules.length; index++) {
        let item = this.media_audit_rules[index];
        var rule = [];
        if (item.required) {
          rule.push({
            required: true,
            message: item.name + "不能为空"
          });
        }
        if (item.rule) {
          if (item.rule == "url") {
            rule.push({
              trigger: "blur",
              validator: this.getCheckURL(item.name)
            });
          } else if (item.rule == "phone") {
            rule.push({
              trigger: "blur",
              validator: this.getCheckPhone(item.name)
            });
          } else if (item.type == "cascader") {
            rule.push({
              trigger: "blur",
              validator: this.getCheckCascader(item.name)
            });
          }

        }
        let key = item.field;
        if (item.type == "cascader") {
          key = "_cascader" + index;
        }
        this.$set(this.rules, key, rule)
      }
    },
    getCheckURL(name) {
      return (rule, value, callback) => {
        if (
          /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)
        ) {
          callback();
        } else {
          callback(new Error("请输入正确的" + name + "格式"));
        }
      };
    },
    getCheckCascader(name) {
      return (rule, value, callback) => {
        // if (!value || !value[0] || !value[1]) {
        if (!value || !value.length) {
          return callback(new Error(name + "不能为空"));
        } else {
          callback();
        }
      };
    },
    getCheckPhone(name) {
      return (rule, value, callback) => {
        if (/^\d+$/.test(value)) {
          callback();
        } else {
          callback(new Error("输入正确的" + name + "格式"));
        }
      };
    },
    handle_dialog_close() {
      this.$emit("update:isShow", false);
    },
    /**
     * 保存需要送审的媒体
     * @method
     * @param {string} ader_id - 广告主的id
     * @param {string} media_id - 媒体的id
     * @param {string} audit_content - 需要送审的内容，可选
     */
    save_media_audit(payload) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/advertiser/addMedia", payload)
          .then(res => {
            if (res.ret == 0) {
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     * 保存需要送审的媒体
     * @method
     * @param {string} ader_id - 广告主的id
     * @param {string} media_id - 媒体的id
     * @param {string} audit_content - 需要送审的内容，可选
     */
    edit_media_audit(payload) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/advertiser/editMedia", payload)
          .then(res => {
            if (res.ret == 0) {
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    isCascader(key, val) {
      let isCascaderStr = key.indexOf('_cascader') != -1;
      let isArr = Array.isArray(val);
      return isCascaderStr && isArr;
    },
    getRequstParam() {
      let data = {};
      let keys = Object.keys(this.form);
      for (let key of keys) {
        let val = this.form[key];
        //如果是级联
        if (this.isCascader(key, val)) {
          let keyArr = this.cascaderKeys[key];
          if (keyArr.length!=val.length) {
            if (keyArr.length==1) {
              data[keyArr[0]] = val[val.length-1];
            }else{
              console.error('服务端数据格式和约定的不一致')
            }
          }else{
            for (let index = 0; index < keyArr.length; index++) {
              const realKey = keyArr[index];
              const realVal = val[index];
              data[realKey] = realVal;
            }
          }
          
        } else {//非级联
          data[key] = val;
        }
      }

      return data;
    },
    handle_submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var data = this.getRequstParam();

          if (this.type == "add") {
            this.save_media_audit({
              ader_id: this.ader_id,
              media_id: this.media_id,
              audit_content: data
            })
              .then(res => {
                this.handle_dialog_close();
                this.$message.success("添加媒体成功");
                this.$emit("refresh");
              })
              .catch(err => {
                this.handle_dialog_close();
                this.$message.error(err.message);
              });
          } else {
            this.edit_media_audit({
              id: this.id,
              audit_content: data
            })
              .then(res => {
                this.handle_dialog_close();
                this.$message.success("编辑媒体成功");
                this.$emit("refresh");
              })
              .catch(err => {
                this.handle_dialog_close();
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
