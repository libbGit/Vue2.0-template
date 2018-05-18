<template>
    <div class="form-wrap clearfix ">
      <h2>创意详情 <el-button @click="back" size="mini" style='margin-left:30px;'>返回</el-button>
      </h2>

      <form-detail :creativeParam='info' v-if='$route.query.creative_id'></form-detail>
       
    </div>
</template>
<script>
  import FormDetail from '@/views/cm/creativelib/create/form-detail'
  import { mapState, mapActions } from "vuex";
  export default {
    name: 'CreativeDetail',
    components: {
      FormDetail,
    },
    data() {
      return {
        info:{url:'/creative/view','param':{}},
      };
    },
    computed: {
      ...mapState("ad", ["ader_name",'ader_id']),
    },
    created(){
      this.info.param = {
        plan_id:this.$route.query.plan_id,
        creative_id:this.$route.query.creative_id,
        creative_group_id:this.$route.query.creative_group_id
      }
    },
    methods:{
      back(){
        this.$router.go(-1);
      },

    }
    
  }
</script>
<style scoped>

.select-wrap{
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 53px;
  border-top: 1px solid #f0f2f5;
  padding-left: 53px;
}
.priority{
  color: red;
  padding-left: 3px;
}
</style>
