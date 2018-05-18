<template>
  <el-form-item label="平台定向">
    <el-checkbox-group :value="platform" @input="handle_change">
      <el-checkbox v-for="item in data" :key="item.value" :label="item.value">
        {{item.label}}
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'platform-config',
    data () {
      return {
        data: [{
          label: 'PC',
          value: 'pc'
        },{
          label: 'Mobile',
          value: 'mobile'
        },{
          label: 'Tablet',
          value: 'tablet'
        }]
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'platform_id'
      ])
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_platform_id'
      ]),
      handle_change(value){
        this.update_platform_id(value)
      }
    }
  }
</script>
