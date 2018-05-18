<template>
  <el-form-item>
    <div slot="label"><el-checkbox :indeterminate="isIndeterminate" v-model="net_config_check" @change="handleCheckAllChange">{{title}}</el-checkbox></div>
    <div class="ml130 gaoji">
      <el-checkbox-group :value="net_config" @input="handle_change">
        <el-checkbox v-for="(item,index) in data" :key="item" :label="item">
          {{item}}
        </el-checkbox>
      </el-checkbox-group>
    </div>

  </el-form-item>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'net-config',
    data () {
      return {
        net_config_check: false,
        isIndeterminate: false,
        title: '',
        data: []
      }
    },
    props: {
      check: {
        type: Boolean,
        required: true,
      }
    },
    watch: {
      // 不勾选怎默认不做选择
      check (value) {
        if ( !value ) {
          this.net_config_check = false
          this.update_net_config([]);
        }
      },
      // net_config_check (value) {
      //   if ( !value ) {
      //     this.update_net_config([]);
      //   }
      // },
      net_config (value) {
        if( value.length ) {
          this.net_config_check = true
        }
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'net_config'
      ])
    },
    created () {
      if( this.net_config.length ) {
        this.net_config_check = true
      }
      this.fetch_list();
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_net_config'
      ]),
      fetch_list() {
        fetch.post('/campaign/limitation', {
          type: 4
        }).then( res => {
          if( res.ret == 0 ){
            if( res.data && res.data[0] ) {
              this.title = res.data[0].target_name
              this.data = res.data[0].target_options
            }
          }
        })
      },
      handle_change(value){
        let checkedCount = value.length;
        this.net_config_check = checkedCount === this.data.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;

        this.update_net_config(value)
      },

      //bug 9871
      handleCheckAllChange(val){
        let net_config_value = val ? this.data : [];
        this.isIndeterminate = false;
        this.update_net_config(net_config_value);
      }
    }
  }
</script>
