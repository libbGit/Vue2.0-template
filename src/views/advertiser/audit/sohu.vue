<template>
<!-- 添加媒体 - 优酷 -->
<el-dialog
  :title="type =='add' ? '添加媒体': '编辑媒体'"
  :visible="visible"
  width="500px"
  @close="handle_dialog_close"
  @open="handle_dialog_open">
  <div class="media_audit_form">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="mini">
      <template v-for="audit in media_audit_rules">
        <!-- 文本框 -->
        <el-form-item v-if="audit.type == 'text'" :label="audit.name+'：'" :prop="audit.field">
          <el-input v-model="form[audit.field]"></el-input>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item v-if="audit.type == 'radio'" :label="audit.name+'：'" :prop="audit.field">
          <el-radio-group v-model="form[audit.field]">
            <el-radio v-for="item in audit.data" :key="item.value" :label="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="handle_submit">立即创建</el-button>
        <el-button @click="handle_dialog_close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</el-dialog>
</template>
<script>
  var checkURL = (rule, value, callback) => {
    if (/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的格式'));
    }
  }
  var checkPhone = (rule, value, callback) => {
    if (/^\d+$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的格式'));
    }
  }
  import fetch from '@/services/fetch'
  export default {
    name: 'Sohu',
    props: {
      visible: {
        type: Boolean
      },
      type: {
        type: String,
        required: true,
      },
      media_audit_rules: {
        type: Array,
        required: true
      },
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
    data () {
      return {
        form: {}
      }
    },
    computed: {
      rules () {
        var rules = {};
        this.media_audit_rules.forEach( item => {
          var rule = [];
          if (item.required) {
            rule.push({
              required: true,
              message: item.name + "不能为空"
            })
          }
          if( item.rule && item.rule == 'url' ) {
            rule.push({
              trigger: 'blur',
              validator: checkURL
            })
          }
          if( item.rule && item.rule == 'phone' ) {
            rule.push({
              trigger: 'blur',
              validator: checkPhone
            })
          }
          rules[item.field] = rule;
        })
        return rules;
      }
    },
    created () {
      this.handle_dialog_open();
    },
    methods:{
      handle_dialog_close () {
        this.$emit('update:visible', false)
      },
      handle_dialog_open(){
        var data = this.$deepClone(this.media_audit_content);
        this.form = data;
      },
      /**
       * 保存需要送审的媒体
       * @method
       * @param {string} ader_id - 广告主的id
       * @param {string} media_id - 媒体的id
       * @param {string} audit_content - 需要送审的内容，可选
       */
      save_media_audit(payload) {
        return new Promise( (resolve, reject)=>{
          return fetch.post('/advertiser/addMedia', payload)
            .then( res => {
              if(res.ret == 0) {
                resolve();
              }
              else {
                reject( new Error(res.msg) );
              }
            }).catch( err => {
              reject( err );
            })
        })
      },
      /**
       * 保存需要送审的媒体
       * @method
       * @param {string} ader_id - 广告主的id
       * @param {string} media_id - 媒体的id
       * @param {string} audit_content - 需要送审的内容，可选
       */
      edit_media_audit(payload) {
        return new Promise( (resolve, reject)=>{
          return fetch.post('/advertiser/editMedia', payload)
            .then( res => {
              if(res.ret == 0) {
                resolve();
              }
              else {
                reject( new Error(res.msg) );
              }
            }).catch( err => {
              reject( err );
            })
        })
      },
      handle_submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            var data = this.$deepClone(this.form);
            if( this.type =='add') {
              this.save_media_audit({
                ader_id: this.ader_id,
                media_id: this.media_id,
                audit_content: data
              }).then( res => {
                this.handle_dialog_close();
                this.$message.success('添加媒体成功')
                this.$emit('update');
              }).catch( err => {
                this.handle_dialog_close();
                this.$message.error(err.message)
              })
            }
            else {
              this.edit_media_audit({
                id: this.id,
                audit_content: data
              }).then( res => {
                this.handle_dialog_close();
                this.$message.success('编辑媒体成功')
                this.$emit('update');
              }).catch( err => {
                this.handle_dialog_close();
                this.$message.error(err.message)
              })
            }
          } else {
            return false;
          }
        });
      }
    }
  }
</script>
