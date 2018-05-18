<template>
  <div>
    <el-menu size="mini"  class="sub-menu-nav" mode="horizontal"
      :default-active="$route.path"
      :router="true">
      <el-menu-item index="/ad/project/overview">
        概览
      </el-menu-item>
      <el-menu-item index="/ad/project/manage">
        项目
      </el-menu-item>
      <el-menu-item index="/ad/project/schedule">
        排期
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'ad-nav'
  }
</script>
