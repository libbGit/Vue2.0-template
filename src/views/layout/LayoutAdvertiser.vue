<template>
<div class="g__wrap">
  <layout-header>
    <nav-advertiser />
  </layout-header>
  <div class="g__main">
    <router-view />
  </div>
  <layout-footer />
</div>
</template>

<script>
import LayoutHeader from './LayoutHeader'
import NavAdvertiser from './NavAdvertiser'
import LayoutFooter from './LayoutFooter'

export default {
  name: 'LayoutAdvertiser',
  components:{
    LayoutHeader,
    LayoutFooter,
    NavAdvertiser
  }
}
</script>


