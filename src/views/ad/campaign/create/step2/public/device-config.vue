<template>
  <el-form-item>
    <div slot="label">
      <el-checkbox :indeterminate="isIndeterminate" v-model="device_type_check" @change="handleCheckAllChange" :disabled='setDisabledIndeterminate()'>{{title}}</el-checkbox>
    </div>
    <div class="ml130 gaoji">
    <el-checkbox-group :value="device_type" @input="handle_change">
      <el-checkbox v-for="(item,index) in data" :key="item" :label="item" :disabled='setDisabled(item)'>
        {{item}}
      </el-checkbox>
    </el-checkbox-group>
    </div>
  </el-form-item>
</template>
<script>
  // 设备定向
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  import _ from "lodash";
  export default {
    name: 'device-config',
    data () {
      return {
        device_type_check: false,
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
          this.device_type_check = false
          this.update_device_type([]);
        }
      },
      // device_type_check (value) {
      //   if ( !value ) {
      //     this.update_device_type([]);
      //   }
      // },
      device_type (value) {
        if( value.length ) {
          this.device_type_check = true
        }
      },
      platform_id(value){
        let arr = _.cloneDeep(this.device_type);
        if (value.indexOf('1')==-1) {
          _.pull(arr,'PC');
        }
        if (value.indexOf('2')==-1) {
          _.pull(arr,'Android Phone','iPhone');
        }
        if (value.indexOf('4')==-1){
          _.pull(arr,'Android Pad','iPad');
        }
        this.update_device_type(arr)
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'device_type',
        'platform_id',
        'media_check'
      ]),
      pc_disabled () {
        if (!this.platform_id.length) {return false}
        return this.platform_id.indexOf('1') <= -1;
      },
      mobile_disabled() {
        if (!this.platform_id.length) {return false}
        return this.platform_id.indexOf('2') <= -1;
      },
      tablet_disabled() {
        if (!this.platform_id.length) {return false}
        return this.platform_id.indexOf('4') <= -1;
      }
    },
    created () {
      if( this.device_type.length ) {
        this.device_type_check = true
      }
      this.fetch_list();
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_device_type'
      ]),
      setDisabled(name){
        //如果平台定向前打钩，但一个都没选平台，则设备全部禁止  9871
        if(this.media_check && this.platform_id.length==0){ 
          return true;
        }

        if (name=='PC') {
          return this.pc_disabled;
        }else if (name=='Android Phone'||name=='iPhone') {
          return this.mobile_disabled;
        }else{
          return this.tablet_disabled;
        }
      },
      setDisabledIndeterminate(){
        if(this.media_check){ //没有选全
          if(this.platform_id.length==0){
            this.isIndeterminate = false;
            this.device_type_check = false;
            return true;
          }
          if(this.platform_id.length<3){
            return true;
          }
        }

        if(this.device_type.length==0){
          this.isIndeterminate = false;
          this.device_type_check = false;
        }
      },
      fetch_list() {
        fetch.post('/campaign/limitation', {
          type: 1
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
        this.device_type_check = checkedCount === this.data.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;
        this.update_device_type(value);
      },

      //bug 9871
      handleCheckAllChange(val){
        let net_config_value = val ? this.data : [];
        this.isIndeterminate = false;
        this.update_device_type(net_config_value);
      }
    }
  }
</script>
