<template>
  <div>
    <el-form-item>
      <div slot="label"><el-checkbox :value="advance_check" @input="update_advance_check"></el-checkbox> 高级设置</div>
      <div class="schedule_select_wrap checkbox-list clearfix" v-show="advance_check">
        <!-- 网络类型 -->
        <net-config :check="advance_check" />

        <!-- 运营商 -->
        <network-config :check="advance_check" />

        <!-- 设备定向 -->
        <device-config :check="advance_check" />

        <!-- 操作系统定向 -->
        <os-config :check="advance_check" />

        <!-- 浏览器定向 -->
        <browser-config :check="advance_check" />
      </div>
    </el-form-item>

  </div>

</template>
<script>
  import { mapState, mapActions } from 'vuex'

  import NetworkConfig from './network-config'
  import NetConfig from './net-config'

  import DeviceConfig from './device-config'
  import BrowserConfig from './browser-config'
  import OsConfig from './os-config'

  export default {
    name: 'advance-config',
    computed : {
      ...mapState('ad/campaign',[
        'advance_check',
      ])
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_advance_check',
      ]),
    },
    components: {
      DeviceConfig,
      BrowserConfig,
      OsConfig,
      NetworkConfig,
      NetConfig
    }
  }
</script>
