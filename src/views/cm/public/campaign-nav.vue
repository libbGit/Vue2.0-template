<template>
  <div>
    <el-menu size="mini" default-active="2" class="el-menu-nav sub-menu-nav" mode="horizontal">
      <el-menu-item index="1">
        <router-link to="/ad/activity/overview">概览</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/ad/activity/manage">推广计划</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="/ad/activity/manage">人群</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/ad/activity/manage">创意组</router-link>
      </el-menu-item>
      <el-menu-item index="5">
        <router-link to="/ad/activity/manage">创意</router-link>
      </el-menu-item>
      <el-menu-item index="6">
        <router-link to="/ad/activity/manage">媒体</router-link>
      </el-menu-item>
      <el-menu-item index="7">
        <router-link to="/ad/activity/manage">点位</router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'campaign-nav'
  }
</script>
