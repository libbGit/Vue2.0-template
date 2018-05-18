<template>
  <div class="step_wrap">
    <div class="title">
      <router-link to="/ad/campaign/manage">
        <el-button  size="mini" icon="el-icon-arrow-left" title="返回"></el-button>
      </router-link>
      <span>{{title}}推广计划</span>
    </div>
    <div style="float: right; width: 650px; font-size: 12px">
      <el-steps :active="step_index" finish-status="success"  simple class="campaign-step">
        <el-step title="推广计划" @click.native="gotoStep1"></el-step>
        <el-step title="推广设置" @click.native="gotoStep2"></el-step>
        <el-step title="人群定向" @click.native="gotoStep3"></el-step>
        <el-step title="创意组/创意" @click.native="gotoStep4"></el-step>
      </el-steps>
    </div>

  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'campaign-steps',
    computed: {
      ...mapState('ad/campaign', [
        'step_index',
        'campaign_update_type',
      ]),
      title () {
        return this.campaign_update_type == 'create' ? '新建' : '编辑'
      }
    },
    methods: {
      gotoStep1(){
        this.$emit("click:nav", "1");
        // this.$router.push("step1");
      },
      gotoStep2(){
        this.$emit("click:nav", "2");
        // this.$router.push("step2");
      },
      gotoStep3(){
        this.$emit("click:nav", "3");
        // this.$router.push("step3");
      },
      gotoStep4(){
        this.$emit("click:nav", "4");
        // this.$router.push("step4");
      }

    }
  }
</script>
<style scoped>
  .step_wrap {
    background: #fff;
    padding: 10px 15px;
    margin: 1px 0 1px 0;
    overflow:hidden;
    position: relative;
  }
  .step_wrap .title{
    float: left;
    width: 200px;
    height: 46px;
    line-height: 46px;
  }

  
  /* .campaign-step .el-step:hover .is-process{
    color: red!important;
  }

  .campaign-step .el-step:hover .is-await{
    color: red!important;
  } */
</style>
<style>
  .campaign-step .el-step{
    cursor: pointer;
  }
</style>
