<template>
  <div class="form-wrap">
    <h2>新建用户</h2>
    <el-form class="form-container1" size="mini" ref="form" :model="form" :rules="rules" label-width="140px" >
      <div class="form_normal">
      <el-form-item prop="username" label="用户名称：" >
        <el-input v-model.trim="form.username" placeholder="作为登录账号使用"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="用户密码：" >
        <el-input type="password" v-model="form.password" placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="contacts" label="联系人："  >
        <el-input v-model.trim="form.contacts" placeholder="请填写真实的信息" :label-width="200"></el-input>
      </el-form-item>
      <el-form-item prop="contacts_telphone" label="联系电话：" >
        <el-input  placeholder="手机或者固话" v-model.trim="form.contacts_telphone" :label-width="200" ></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="level">
        <el-radio-group v-model="form.level" :min="1">
          <el-radio v-model="form.level" label="client">客户层级</el-radio>
          <el-radio v-model="form.level" label="project">项目层级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.level == 'client'" label="选择客户" prop="advertiser_ids1">
        <div style="float: left; border: 1px solid #eee; width: 100%">
          <div style="padding: 10px; background-color: #fafafa; line-height: 32px; border-bottom: 1px #eee solid">客户列表
            <div class="pull-right" :inline="true">
              <el-button @click="setCheckedAll" type="text">全选</el-button>
              <span> - </span>
              <el-button @click="removeCheckedAll" type="text">清空</el-button>
            </div>
          </div>
          <div style="width: 100%;height: 400px; overflow: auto ;">
            <el-tree
              :data="advertiser_ids_List"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree1"
              highlight-current
              :props="defaultProps"
              @check-change="handleCheckedProjectsChange"
            >
            </el-tree>
          </div>

        </div>
      </el-form-item>
      <el-form-item v-if="form.level == 'project'" label="选择客户" prop="advertiser_ids2">
        <el-select v-model="form.advertiser_ids2" clearable placeholder="请选择" @change="fetch_advertiser_project_list">
          <el-option
            v-for="item in advertiser_ids_List"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.level == 'project' && form.advertiser_ids2 !=''"   label="选择项目"  prop="projects">
        <div style="float: left; border: 1px solid #eee; width: 100%">
          <div style="padding: 10px; background-color: #fafafa; line-height: 32px; border-bottom: 1px #eee solid">项目列表
            <div class="pull-right" :inline="true">
              <el-button @click="setCheckedAll" type="text">全选</el-button>
              <span> - </span>
              <el-button @click="removeCheckedAll" type="text">清空</el-button>
            </div>
          </div>
          <div style="width: 100%;height: 400px; overflow: auto ;">
            <el-tree
              :data="project_List"
              show-checkbox
              default-expand-all
              node-key="project_id"
              ref="tree"
              highlight-current
              :props="defaultProps"
              @check-change="handleCheckedProjectsChange"
            >
            </el-tree>
          </div>

        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" >保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        form:{
          username:'',
          password:'',
          level:'',
          advertiser_ids:'',
          advertiser_ids1:[],
          advertiser_ids2:'',
          contacts_telphone:'',
          project:'',
          projects:[]
        },
        project_List:[],
        defaultProps: {
          label: 'name'
        },
        advertiser_ids_List:[],
        rules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            { min: 4, max: 25, message: '长度在 4 到 25 个字符', trigger: 'blur' }
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            { min: 6, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
          ],
          contacts: [
            {required: true, message: '请输入联系人', trigger: 'blur'},
          ],
          contacts_telphone: [
            {required: true, message: '请输入联系人电话', trigger: 'blur'},
          ],
          level: [
            {required: true, message: '请选择用户角色', trigger: 'blur'},
          ],
          advertiser_ids1: [
            {type: 'array', required: true, message: '请至少选择一个客户', trigger: 'change'},
          ],
          advertiser_ids2: [
            {required: true, message: '请选择一个客户', trigger: 'change'},
          ],
          projects: [
            {type: 'array', required: true, message: '请至少选择一个项目', trigger: 'change'},
          ],
        }
      };
    },
    created() {
      this.fetch_advertiser_ids_list()
    },
    methods: {
      //获取客户列表
      fetch_advertiser_ids_list() {
        return new Promise((resolve, reject) => {
          fetch.post('/get/ads').then( res => {
            if (res.ret == 0 && res.data) {
              this.advertiser_ids_List = res.data;
            }
            resolve(res);
          })
            .catch( err => {
              reject(err);
            })
        })
      },
      //获取项目列表
      fetch_advertiser_project_list(value) {
        return new Promise((resolve, reject) => {
          fetch.post('/get/project', {
            id: value}).then( res => {
            if (res.ret == 0 && res.data) {
              this.project_List = res.data;
            }
            resolve(res);
          })
            .catch( err => {
              reject(err);
            })
        })
      },
      //全选
      setCheckedAll(){
        if(this.form.level === 'client'){
          this.$refs.tree1.setCheckedNodes(this.advertiser_ids_List);
        }else{
          this.$refs.tree.setCheckedNodes(this.project_List);
        }

      },
      //清空选择
      removeCheckedAll(){
        if(this.form.level === 'client') {
          this.$refs.tree1.setCheckedNodes([]);
        }else{
          this.$refs.tree.setCheckedNodes([]);
        }

      },
      handleCheckedProjectsChange() {
        if(this.form.level === 'client'){
          this.form.advertiser_ids1 = this.$refs.tree1.getCheckedKeys();
        }else{
          this.form.projects = this.$refs.tree.getCheckedKeys();
        }

      },
      onCancel () {
        this.$router.push({
          path: '/system/user'
        })
      },
      onSubmit(form) {
        if(this.form.level == "client"){
            this.form.advertiser_ids = this.form.advertiser_ids1.join(",");
        } else if(this.form.level == "project"){
          this.form.advertiser_ids = this.form.advertiser_ids2;
          this.form.project = this.form.projects.join(",");
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            fetch.post('/manage/create_user', this.form)
              .then( res => {
                if(res.ret == 0) {
                  this.$alert('创建用户成功', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push({
                        path: '/system/user'
                      })
                    }
                  });
                }
                else {
                  this.$alert(res.msg, '创建用户');
                }
              })
              .catch( err => {
                console.log(err);
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    components:{}
  }
</script>
<style scoped>

  .media {
    overflow: hidden;
    zoom: 1;
  }
  .media-left,
  .media-body {
    display: table-cell;
    vertical-align: top;
  }
  .media-left {
    padding-right: 10px;
  }
  .media-left img {
    max-width: 100px;
    max-height: 100px;
  }
  .media-body {
    vertical-align: middle;
  }
</style>
