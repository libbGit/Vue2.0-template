<template>
    <div class="hy-card">
        <!-- PD上线后恢复 -->
        <!-- <div class="clearfix nav-wrap">
            <el-menu size="mini"
                class="sub-menu-nav pull-left"
                mode="horizontal"
                :default-active="$route.meta.nav"
                :router="true">
                <el-menu-item index="/crowd/hyDmp">
                    华扬DMP
                </el-menu-item>
                <el-menu-item index="/crowd/tecentDmp">
                    腾讯DMP
                </el-menu-item>
                <el-menu-item index="/crowd/secondDmp">
                    秒针DMP
                </el-menu-item>
            </el-menu>
        </div>   -->
        <div class="hy-card hy-card-crowd">
            <keep-alive>
                <router-view/>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import fetch from "@/services/fetch";

export default {
    name: "crowd-index",
    data() {
        return {};
    }
};
</script>
<style scoped>
.hy-card-crowd {
  margin-top: 0;
  overflow-x: hidden;
}
</style>
