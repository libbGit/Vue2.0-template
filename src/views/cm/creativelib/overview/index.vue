<template>
 <div class="hy-card">
    <div class="clearfix nav-wrap">
      <creative-nav />
    </div>


      <div class="developing-area hy-card__content ">
        <div class="developing-area  ">
          <i class="iconfont developing"></i>
          <p>开发中，敬请期待...</p>
        </div>
      </div>

  </div>


</template>
<script>
  import CreativeNav from '@/views/cm/public/creative-nav'

  export default {
    name: 'activity-manage',
    data() {
      return {
      };
    },
    components: {
      CreativeNav,
    }
  }
</script>
