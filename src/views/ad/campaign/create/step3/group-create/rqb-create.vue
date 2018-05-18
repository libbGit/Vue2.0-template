<template>
    <div>
      <p>
        <span>重定向方式：</span>
        <el-radio v-model="type" label="1">点击找回</el-radio>
        <el-radio v-model="type" label="2">网站监测</el-radio>
      </p>
      <div>

      </div>
    </div>
</template>

<script>
    export default {
        name: "rqb-create",
        data(){
          return{
            type: "1"
          }
        }
    }
</script>

<style scoped>

</style>
