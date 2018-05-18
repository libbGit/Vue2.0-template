<template>
  <div>
    <el-menu size="mini"  class="sub-menu-nav" mode="horizontal"
      :default-active="$route.path"
      :router="true">
      <el-menu-item index="/ad/campaign/crowd">
        人群
      </el-menu-item>
      <el-menu-item index="/ad/campaign/creative-group/list">
        创意组
      </el-menu-item>
      <el-menu-item index="/ad/campaign/creative/list">
        创意
      </el-menu-item>
      <el-menu-item index="/ad/campaign/media">
        媒体
      </el-menu-item>
      <el-menu-item index="/ad/campaign/point">
        点位
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'campaign-nav'
  }
</script>
