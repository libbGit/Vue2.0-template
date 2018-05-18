<template>
  <el-dialog :visible="visible" :lock-scroll="false" title="添加代理商" @close="handleClose" width="450px">
    <el-form size="mini" label-width="100px" :model="form" ref="form" :rules="rules">
      <el-form-item label="代理商名称：" prop="name">
        <el-input v-model="form.name" class="input-120"/>
      </el-form-item>
      <el-form-item label="负责人：" prop="customer_contact">
        <el-input v-model="form.customer_contact" class="input-120" />
      </el-form-item>
      <el-form-item label="联系方式：" prop="phone">
        <el-input v-model="form.phone" class="input-120" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(form)">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'

  var emptyForm = function(){
    return {
      name: '',
      customer_contact: '',
      phone: ''
    }
  }
  export default {
    name: 'dialog-agent-add',
    props: {
      visible: {
        type: Boolean
      }
    },
    data () {
      return {
        form : emptyForm(),
        rules: {
          name: [
            { required: true, message: '请输入代理商名称'}
          ],
          customer_contact: [
            { required: true, message: '请输入代理商负责人'}
          ],
          phone: [
            { required: true, message: '请输入联系方式' },
            {
              validator: (rule, value, callback) => {
                if( value && (!/^\d+$/.test(value)) ) {
                  callback(new Error('请输入正确的格式'));
                }
                else {
                  callback();
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      ...mapActions('advertiser', [
        'fetch_agent_list'
      ]),
      handleClose () {
        this.$emit('update:visible', false)
      },
      onSubmit (form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            fetch.post('/agent/add', this.form)
              .then( res => {
                if( res.ret == 0) {
                  this.form = emptyForm();
                  this.fetch_agent_list();
                  this.$emit('update:visible', false)
                }
                else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  })
                }
              })
              .catch( err=> {
                this.$message({
                  type: 'error',
                  message: err.message
                })
              })
          } else {
            return false;
          }
        });
      },
      onCancel () {
        this.$emit('update:visible', false)
      }
    }
  }
</script>
