<template>
  <el-form-item>
    <div slot="label"><el-checkbox :indeterminate="isIndeterminate" v-model="os_check" @change="handleCheckAllChange">{{title}}</el-checkbox></div>
    <div class="ml130 gaoji">
    <el-checkbox-group :value="os" @input="handle_change">
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
    name: 'os-config',
    data () {
      return {
        os_check: false,
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
          this.os_check = false
          this.update_os([]);
        }
      },
      // os_check (value) {
      //   if ( !value ) {
      //     this.update_os([]);
      //   }
      // },
      os (value) {
        if( value.length ) {
          this.os_check = true
        }
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'os'
      ])
    },
    created () {
      if( this.os.length ) {
        this.os_check = true
      }
      this.fetch_list();
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_os'
      ]),
      fetch_list() {
        fetch.post('/campaign/limitation', {
          type: 2
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
        this.os_check = checkedCount === this.data.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;
        this.update_os(value);
      },

      //bug 9871
      handleCheckAllChange(val){
        let net_config_value = val ? this.data : [];
        this.isIndeterminate = false;
        this.update_os(net_config_value);
      }
    }
  }
</script>
