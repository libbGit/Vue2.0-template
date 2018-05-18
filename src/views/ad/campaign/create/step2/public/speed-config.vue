<template>
  <el-form-item label="投放速度">
    <div slot="label"><el-checkbox :value="speed_check" @input="update_speed_check"></el-checkbox> 投放速度</div>
    <el-radio-group :value="speed" @input="handle_change" v-if="speed_check">
      <el-radio label="1">匀速</el-radio>
      <el-radio label="2">加速</el-radio>
    </el-radio-group>
  </el-form-item>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'speed-config',
    computed : {
      ...mapState('ad/campaign',[
        'speed',
        'speed_check',
      ])
    },
    watch: {
      // 不勾选怎默认选择匀速
      speed_check (value) {
        if ( !value ) {
          this.update_speed('1');
        }
      }
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_speed',
        'update_speed_check',
      ]),
      handle_change(value){
        this.update_speed(value)
      }
    }
  }
</script>
