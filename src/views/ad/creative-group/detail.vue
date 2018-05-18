<template>
  <div class="form-wrap clearfix ">
    <h2><el-button  size="mini" @click="back" icon="el-icon-arrow-left" title="返回"></el-button> 创意组详情
    </h2>
    <detail-core :id='$route.query.id-0' :plan_id='$route.query.plan_id' />
  </div>
</template>
<script>
  import _ from "lodash";
  import moment from "moment";
  import fetch from "@/services/fetch";
  import DetailCore from "./detail-core";
  import { mapState, mapActions } from "vuex";

  export default {
    name: 'CreativeGroupDetail',
    components: {
      DetailCore
    },
    data() {
      return {
      };
    },
    watch:{

    },
    computed: {
    },
    created(){
      // this.fetch_creative_group();
    },
    methods:{
      back(){
        this.$router.go(-1);
        /*this.$router.push({
          path: "/ad/creativegroup-"+this.pageType+"/overview"
        });*/
      },
    }

  }
</script>
<style scoped>

</style>
