<template>
  <!-- <div class="m__wraper">
    <div class="m__sidebar">
      <sidebar-tree />
    </div> -->

    <div class="m__content">
      <!-- 导航栏 -->
      <div class="clearfix nav-wrap">
        <div class="pull-left">
          <activity-nav />
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-wrap">
        <div class="hy-card">
          <div class="developing-area hy-card__content ">
            <div class="developing-area  ">
            <i class="iconfont developing"></i>
            <p>开发中，敬请期待...</p>
            </div>
          </div>
        </div>
      </div>

    </div>

  <!-- </div> -->
</template>
<script>
  import SidebarTree from '@/views/ad/public/sidebar-tree'
  import ActivityNav from '@/views/ad/public/activity-nav'
  import DaterangePicker from '@/views/public/daterange-picker'
  import TestChart from '@/views/test/chart'

  export default {
    name: 'project-create',
    data() {
      return {
        date_range: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
      };
    },
    components: {
      SidebarTree,
      ActivityNav,
      DaterangePicker,
      TestChart
    }
  }
</script>
