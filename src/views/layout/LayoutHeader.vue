<template>
  <div class="g__header">
    <div class="logo-zone">
      <div class="logo-zone__item">
<!--    <router-link to="/choose">
        </router-link> -->
        <img @click="jump" src="~@/assets/image/logo.png" v-if="path=='/choose'"/><img @click="jump" src="~@/assets/image/logo-pd.png" v-else />
      </div>
    </div>
    <div class="nav-zone">
      <div class="nav-zone__item">
        <slot></slot>
      </div>
    </div>
    <div class="info-zone">
      <div class="info-zone__item">
        <el-dropdown>
          <span class="el-dropdown-link name">
            <img  src="~@/assets/image/user.png" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>  欢迎您，{{username}}</el-dropdown-item>
            <el-dropdown-item @click.native="choose">选择类型</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'LayoutHeader',
  data() {
    return {
      path:'',
    }
  },
  mounted(){
    this.path = this.$route.path;
  },
  computed: {
    ...mapState('user', ['username', 'role'])
  },
  methods: {
    jump(){
      // 如果:
      // 用户是“客户管理”级别
      // 用户在“项目管理”页面及子页面
      if( this.role == 'client' && this.$route.path !== '/choose') {
        this.$router.push({
          path: '/advertiser'
        });
      }
    },
    choose () {
      this.$router.push({
        path: '/choose'
      })
    },
    logout () {
      this.$router.push({
        path: '/logout'
      })
    }
  }
}
</script>
<style>
  .logo-zone, .nav-zone {
    float: left;
    /*margin-left: 10px;*/
  }
  .info-zone {
    float: right;
    margin-right: 20px;
  }
  .info-zone .name {
    color: #ddd;
  }
  .logo-zone__item,
  .nav-zone__item,
  .info-zone__item {
    display: table-cell;
    height: 60px;
    vertical-align: middle;
    cursor: pointer;
  }
  .info-zone__item {
    padding: 0 0 0 30px;
  }
  .info-zone__item img {
    display: block;
  }
</style>
