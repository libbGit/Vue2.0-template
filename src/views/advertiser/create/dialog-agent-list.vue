<template>
  <el-dialog
    :visible="visible"
    :lock-scroll="false"
    title="代理商列表"
    width="630px"
    @close="handleClose"
    >
    <div style="margin-top:-20px;">
      <table class="hy-table" v-if="agentList.length">
        <tr>
          <th>代理商ID</th>
          <th>代理商名称</th>
          <th>负责人</th>
          <th>联系方式</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in agentList">
          <td>{{item.id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.customer_contact}}</td>
          <td>{{item.phone}}</td>
          <td>
            <el-button type="text" size="mini" @click="editAgent(item)">编辑</el-button>
          </td>
        </tr>
      </table>
    </div>

    <el-dialog :visible="dialog_edit" :lock-scroll="false" title="编辑代理商" width="450px" append-to-body>
      <el-form size="mini" label-width="100px" :model="form" ref="form" :rules="rules">
        <el-form-item label="代理商名称：" prop="name">
          <el-input v-model="form.name" class="input-120"/>
        </el-form-item>
        <el-form-item label="负责人：" prop="customer_contact">
          <el-input v-model="form.customer_contact" class="input-120" />
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model.number="form.phone" class="input-120" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'dialog-agent-list',
    props: {
      visible: {
        type: Boolean
      }
    },
    computed: {
      ...mapState({
        agentList: state => state.advertiser.agentList
      })
    },
    data () {
      return {
        dialog_edit: false,
        form : {
          id:'',
          name: '',
          customer_contact: '',
          phone: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入代理商名称', trigger: 'blur' }
          ],
          customer_contact: [
            { required: true, message: '请输入代理商负责人', trigger: 'blur' }
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
    methods:{
      ...mapActions('advertiser', [
        'fetch_agent_list'
      ]),
      handleClose () {
        this.$emit('update:visible', false)
      },
      editAgent (form) {
        this.form = Object.assign({}, form);
        this.dialog_edit = true;
      },
      onSubmit (form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            fetch.post('/agent/edit', this.form)
              .then( res => {
                if(res.ret == 0) {
                  this.fetch_agent_list();
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                  this.dialog_edit = false;
                }
                else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  })
                }
              })
              .catch (err => {
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
        this.dialog_edit = false;
      }
    }
  }
</script>
