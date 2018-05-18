<template>
  <div class="form-wrap">
    <h2>编辑用户</h2>
    <el-form class="form-container1" size="mini" ref="form" :model="form" :rules="rules" label-width="140px" >
      <div class="form_normal">
      <el-form-item prop="username" label="用户名称：" >
        <el-input v-model.trim="form.username" placeholder="作为登录账号使用" disabled></el-input>
      </el-form-item>
      <el-form-item prop="password" label="用户密码：" >
        <el-input type="password" v-model="form.password" placeholder="不修改密码请留空"></el-input>
      </el-form-item>
      <el-form-item prop="contacts" label="联系人："  >
        <el-input v-model.trim="form.contacts" placeholder="请填写真实的信息" :label-width="200"></el-input>
      </el-form-item>
      <el-form-item prop="contacts_telphone" label="联系电话：" >
        <el-input  placeholder="手机或者固话" v-model.trim="form.contacts_telphone" :label-width="200" ></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="role_level">
        <el-radio-group v-model="form.role_level" :min="1">
          <el-radio v-model="form.role_level" label="client">客户层级</el-radio>
          <el-radio v-model="form.role_level" label="project">项目层级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.role_level == 'client'" label="选择客户" prop="advertiser_id1">
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
      <el-form-item v-if="form.role_level == 'project'" label="选择客户" prop="advertiser_id2">
        <el-select v-model="form.advertiser_id2" clearable placeholder="请选择" @change="fetch_advertiser_project_list">
          <el-option
            v-for="item in advertiser_ids_List"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.role_level == 'project' && form.advertiser_id2 !=''"   label="选择项目"  prop="projects">
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
      let checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback();
        }else{
          if(value.length<6 || value.length>25){
             callback(new Error('长度在 6 到 25 个字符'));
          }else{
            callback();
          }
        }
      };
      return {
        form:{
            id: '',
            username: '',
            password: '',
            role_level: '',
            client:'',
            advertiser_id:'',
            advertiser_id1:[],
            advertiser_id2:'',
            contacts_telphone: '',
            contacts: '',
            projects:[],
          },
        defaultProps: {
          label: 'name'
        },
        project_List:[],
        advertiser_ids_List:[],
        rules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            { min: 4, max: 25, message: '长度在 4 到 25 个字符', trigger: 'blur' }
          ],
          password: [
            { validator: checkPassword, trigger: 'blur'},
          ],
          contacts: [
            {required: true, message: '请输入联系人', trigger: 'blur'},
          ],
          contacts_telphone: [
            {required: true, message: '请输入联系人电话', trigger: 'blur'},
          ],
          role_level: [
            {required: true, message: '请选择用户角色', trigger: 'blur'},
          ],
          advertiser_id1: [
            {type: 'array', required: true, message: '请至少选择一个客户', trigger: 'change'},
          ],
          advertiser_id2: [
            {required: true, message: '请选择一个客户', tirgger: 'change'},
          ],
          projects: [
            {type: 'array', required: true, message: '请至少选择一个项目', trigger: 'change'},
          ],
        }
      };
    },
    mounted() {
      this.fetch_advertiser_ids_list();
      this.fetch_user_info();
    },
    created() {

    },
    updated(){
      if(this.form.role_level === "client" && this.$refs.tree1){
        this.$refs.tree1.setCheckedKeys(this.form.advertiser_id1);
      }else if(this.$refs.tree){
        this.$refs.tree.setCheckedKeys(this.form.projects);
      }


    },
    methods: {
      //获取用户信息
      fetch_user_info() {
        let username = this.$route.params.name;
        fetch.get('/manage/user_list', {params: {name: username}})
          .then(res => {
            if (res.ret == 0 && res.data) {
              this.form.id = res.data[0].id;
              this.form.role_level = res.data[0].role_level;
              this.form.username = res.data[0].username;
              this.form.contacts_telphone = res.data[0].contacts_telphone;
              this.form.contacts = res.data[0].contacts;
              if (this.form.role_level === "客户级别") {
                this.form.role_level = "client";
                this.form.advertiser_id1 = res.data[0].advertiser_id.split(",");
              }
              else {
                this.form.role_level = "project";
                this.form.advertiser_id2 = res.data[0].advertiser_id;
                this.form.projects = res.data[0].project_id.split(",");
                this.fetch_advertiser_project_list(this.form.advertiser_id2);


              }
            }
            else {
              alert('获取信息失败')
            }


          })
          .catch(err => {
            console.error(err)
          });


      },
      //获取客户列表
      fetch_advertiser_ids_list() {
        return new Promise((resolve, reject) => {
          fetch.post('/get/ads').then(res => {
            if (res.ret == 0 && res.data) {
              this.advertiser_ids_List = res.data;
            }
            resolve(res);
          })
            .catch(err => {
              reject(err);
            })
        })
      },
      //获取项目列表
      fetch_advertiser_project_list(value) {
        return new Promise((resolve, reject) => {
          fetch.post('/get/project', {
            id: value
          }).then(res => {
            if (res.ret == 0 && res.data) {
              this.project_List = res.data;
            }
            resolve(res);
          })
            .catch(err => {
              reject(err);
            })
        })
      },
      //全选
      setCheckedAll() {
        if (this.form.role_level === 'client') {
          if (this.$refs.tree1) {
            this.$refs.tree1.setCheckedNodes(this.advertiser_ids_List);
          }

        } else {
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedNodes(this.project_List);
          }
        }

      },
      //清空选择
      removeCheckedAll() {
        if (this.form.role_level === 'client') {
          if (this.$refs.tree1) {
            this.$refs.tree1.setCheckedNodes([]);
          }
        } else {
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedNodes([]);
          }
        }

      },
      handleCheckedProjectsChange() {
        if (this.form.role_level === 'client') {
          if (this.$refs.tree1) {
            this.form.advertiser_id1 = this.$refs.tree1.getCheckedKeys();
          }
        } else {
          if (this.$refs.tree) {
            this.form.projects = this.$refs.tree.getCheckedKeys();
          }
        }

      },
      onCancel() {
        this.$router.push({
          path: '/system/user'
        })
      },
      onSubmit(form) {
        let form1 =
          {
            id: this.form.id,
            level: this.form.role_level,
            advertiser_ids: this.form.advertiser_id1.join(","),
            contacts_telphone: this.form.contacts_telphone,
            contacts: this.form.contacts,
          };
        if (this.form.role_level === "project") {

          form1.advertiser_ids = this.form.advertiser_id2;
          form1["project"] = this.form.projects.join(",");
        }

        if (this.form.password !== "") {
          form1["password"] = this.form.password;
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {

            fetch.post('/manage/edit_user', form1)
              .then(res => {
                if (res.ret === 0) {
                  this.$alert('修改用户成功', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push({
                        path: '/system/user'
                      })
                    }
                  });
                }
                else {
                  this.$alert(res.msg, '编辑用户');
                }
              })
              .catch(err => {
                console.log(err);
              })
          }
            else {
            console.log('error submit!!');
            return false;
          }
        })
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
