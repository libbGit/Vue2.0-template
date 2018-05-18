<template>
  <div>
    <el-menu size="mini" default-active="5" class="sub-menu-nav" mode="horizontal" :default-active="$route.path"
      :router="true">
      <el-menu-item index="/cm/creativelib/overview">
        概览
      </el-menu-item>
      <el-menu-item index="/cm/imglib/manage">
        图片库
      </el-menu-item>
      <el-menu-item index="/cm/documentlib/manage">
        文案库
      </el-menu-item>
      <el-menu-item index="/cm/linklib/manage">
        链接库
      </el-menu-item>
      <el-menu-item index="/cm/creativelib/manage">
        创意库
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'creative-nav'
  }
</script>
