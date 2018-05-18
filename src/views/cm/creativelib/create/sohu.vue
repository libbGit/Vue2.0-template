<template>
   <el-form  size="mini" ref="form" :model="form" :rules="rules" label-width="140px">
    <el-form-item  :label="setLabel" prop="adType"  >
      <el-cascader
        style="min-width:280px"
        :options="renderData"
        :props='typeProps'
        change-on-select
        v-model="form.adType">
      </el-cascader>
    </el-form-item>

  </el-form>

</template>

<script>
import _ from "lodash";
import fetch from "@/services/fetch";

export default {
  name: "Sohu",
  props: {
    mediaType:[String, Number],
    backfillData:Array,
    triggerSubmit: [String, Number]
  },
  components: {
  },
  data() {
    var validateType = (rule, value, callback)=>{
      var msg = this.mediaType==1?'请选择广告投放类型':"请选择tag标签";
      if (value == "") {
        callback(new Error(msg));
      } else {
        if(Array.isArray(value)&&value.length==0){
          callback(new Error(msg));
        }else{
          callback();
        }
      }
    };
    return {
      form:{
        adType:[],//投放类型 多级联动的选择结果
      },

      renderData: [],//投放类型 服务端拿到的数据
      typeProps: {
        children: 'child',
        label: 'name',
        value:'id'
      },
      rules:{adType: [{ validator: validateType,required: true,  trigger: "blur,change" }]}
    };
  },
  watch: {
    mediaType(val, oldVal){
      if (val) {
        this.getSohuInfo();
      }
    },
    triggerSubmit:function(val, oldVal){
      this.onSubmit();
    },
    form:{
      handler: function(val, oldVal) {
        this.$emit('adPutData',val.adType);
      },
      deep: true
    }
  },
  computed: {
    setLabel(){
      return this.mediaType==1?"广告投放类型：":'tag标签：';
    },
  },
  destroyed(){this.$emit('adPutData',undefined);},
  created() {
    this.getSohuInfo();
    if (Array.isArray(this.backfillData)) {
      this.form.adType = this.backfillData;//设置默认值，其实只有编辑时用到
    }

  },
  methods: {
    getSohuInfo(){
      let url = this.mediaType==1?"/creative/get_sohu_industry":'/creative/get_iqiyi_tag';
      fetch.post(url)
        .then(res => {
          if (res.ret == 0&&res.data) {
            if(Array.isArray(res.data)&&res.data){
              this.renderData = res.data
            }else{
              console.error(res.msg||url+'返回值为空');
            }
          } else {
            console.error(res.msg||url+'返回值为空');
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    onSubmit(){
      this.$refs["form"].validate(valid => {//debugger
        this.$emit('validateResult-sohu',valid);
      })
    },

  }
};
</script>
<style scoped>

</style>
