<template>
  <div>
    <el-menu size="mini" class="sub-menu-nav" mode="horizontal"
      :default-active="$route.path"
      :router="true">
      <el-menu-item index="/ad/activity/overview">
        概览
      </el-menu-item>
      <el-menu-item index="/ad/activity/manage">
        活动
      </el-menu-item>
      <el-menu-item index="/ad/project/plan">
        推广计划
      </el-menu-item>
      <el-menu-item index="/ad/project/creative-group/list">
        创意组
      </el-menu-item>
      <el-menu-item index="/ad/project/creative/list">
        创意
      </el-menu-item>
      <el-menu-item index="/ad/activity/budget-manage">
        预算管理
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'project-nav'
  }
</script>
