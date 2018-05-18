<template>
  <div class="hy-card">
    <div class="hy-card__header clearfix">
    <!-- 新建用户 -->
    <router-link to="/system/user/create" >
      <el-button type="primary" size="mini">新建用户</el-button>
    </router-link>
    <div class="pull-right">
      <el-input placeholder="请输入内容" v-model="input21" size="mini">
        <el-button slot="append" icon="el-icon-search" @click="searchUser" size="mini"></el-button>
      </el-input>
    </div>
    </div>
    <!-- 用户列表 -->
    <user-list  ref="userList"/>
  </div>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  import UserList from './user-list/index'

  export default {
    name:'user-manage',
    data() {
      return {
        input21: '',
      };
    },
    methods:{
      searchUser(){
        return new Promise((resolve, reject) => {
          fetch.post('/manage/user_list', {
            name:this.input21,
          }).then( res => {
            if (res.ret == 0 && res.data) {
              this.$refs.userList.userList = res.data;
              this.$refs.userList.total = parseInt(res.total);
              this.$refs.userList.fetch_user_list;
              this.$message({
                message: '查询到'+this.$refs.userList.total+'条结果',
                type: 'success',
                duration:1500
              });
            }else {
              this.$message({
                message: '查询不到信息！',
              });
            }
            resolve(res);

          })
            .catch( err => {
              reject(err);
            })
        })

      }

    },
    components: {
      UserList
    }
  }
</script>

