<template>
  <div>
    <el-menu size="mini" class="sub-menu-nav" mode="horizontal"
      :default-active="$route.meta.sub_nav || $route.path"
      :router="true">
      <el-menu-item index="/ad/campaign/overview">
        概览
      </el-menu-item>
      <el-menu-item index="/ad/campaign/manage">
        推广计划
      </el-menu-item>
      <el-menu-item index="/ad/activity/crowd">
        人群
      </el-menu-item>
      <el-menu-item index="/ad/activity/creative-group/list">
        创意组
      </el-menu-item>
      <el-menu-item index="/ad/activity/creative/list">
        创意
      </el-menu-item>
      <el-menu-item index="/ad/activity/media">
        媒体
      </el-menu-item>
      <el-menu-item index="/ad/activity/point">
        点位
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'activity-nav'
  }
</script>
