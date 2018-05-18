<template>
<div class="g__wrap">
  <layout-header>
    <nav-project />
  </layout-header>
  <div class="g__main">
     
    <div class="m__wraper" v-show='$route.meta.hasTree'>
      <!-- 侧边栏 -->
      <div class="m__sidebar">
        <keep-alive> 
          <sidebar-tree />
        </keep-alive>
      </div>
    </div>
    <router-view />

  </div>
  <layout-footer />
</div>
</template>

<script>
import LayoutHeader from './LayoutHeader'
import NavProject from './NavProject'
import LayoutFooter from './LayoutFooter'
import SidebarTree from "@/views/ad/public/sidebar-tree";
export default {
  name: 'LayoutProject',
  components:{
    SidebarTree,
    LayoutHeader,
    LayoutFooter,
    NavProject
  }
}
</script>

