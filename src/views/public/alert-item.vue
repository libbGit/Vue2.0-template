<template>
  <div>
    <i class="header-icon el-icon-warning text"></i> 
    <span class="text">【{{name}}】</span>
    <span class="text">{{describe}}</span>
    <a href="javascript:;" @click.stop="onClick" class="text" style="color:#409EFF">查看</a>
  </div>
</template>
<script>
  export default {
    name: 'alert-item',
    data () {
      return {
      }
    },
    props: {
      name: {
        type: [String],
        required: true,
      },
      describe: {
        type: [String],
        required: true,
      }
    },
    created () {
    },
    methods: {
      onClick (id, name) {
        this.$emit('click-alert');
      }
    }
  }
</script>
<style scoped>
  .text{
    font-size: 12px;
  }
</style>
