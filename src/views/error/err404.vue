<template>
<div class="g__wrap">
  <layout-header></layout-header>
  <div class="g__main">
    <div class="choose__wrap">
      <div class="inner">
        <h2> 404 </h2>
        <router-link to="/choose">点击返回选择页面</router-link>
      </div>
    </div>
  </div>
  <layout-footer  class="footer-fix"/>
</div>
</template>
<script>
import LayoutHeader from '../layout/LayoutHeader'
import LayoutFooter from '../layout/LayoutFooter'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'LayoutPd',
  components:{
    LayoutHeader,
    LayoutFooter
  },
  methods: {
  }
}
</script>
<style>
  .choose__wrap {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 50px;
  }
  .choose__wrap .inner {
    width: 600px;
    height: 250px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
  }
  .choose__wrap .inner h2 {
    text-align: center;
    font-size: 118px;
    line-height: 120px;
    color: #333;
    margin: 0 auto 11px;
  }
  .choose__wrap .inner a {
    font-size: small;
    color: #666;
  }
  .footer-fix {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
