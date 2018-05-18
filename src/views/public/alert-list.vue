<template>
  <!-- 预警  -->
  <el-collapse class="el-collapse-warn" v-if="data.length">
    <el-collapse-item name="1" >
      <alert-item slot="title"
        :name='firstItem.name'
        :describe='firstItem.describe'
        @click-alert='onClick(firstItem)'
      />
      <div v-for="item in list">
        <alert-item
          :name='item.name'
          :describe='item.describe'
          @click-alert='onClick(item)'
        />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
  import fetch from '@/services/fetch'
  import alertItem from './alert-item'
  export default {
    name: 'alert-list',
    components:{
      alertItem
    },
    props: {
      param:{
        type:Object
      },
      /*id: {
        type: [Number,String],
      },*/
      url:{
        type: [String],
        required: true,
      }
    },
    data () {
      return {
        data:[]
      }
    },
    watch: {
      param: {
        handler: function (val, oldVal) {
          this.fetch_list();
        },
        deep: true
      }
    },
    computed:{
      firstItem(){
        if (this.data.length) {
          return this.data[0];
        }
      },
      list(){
        if (this.data.length) {
          // let arr = _.cloneDeep(this.data);
          let arr = this.data.slice(1,this.data.length+1);
          return arr;
        }
      }
    },
    created () {
      this.fetch_list();
    },
    methods: {
      fetch_list () {
        return new Promise( (resolve, reject) => {
          return fetch.post(this.url, this.param).then( res => {
              if( res.ret == 0) {
                this.data = res.data || [];
                resolve();
              }
              else {
                reject( new Error(res.msg));
              }
            }).catch( err => {
              reject( err );
            })
        })
      },
      onClick (item) {
        this.$emit('onView',item)
      }
    }
  }
</script>
<style>
  .el-collapse-warn {
    margin: 10px 0;
    /* border: 1px solid #fedfb2; */
    background-color: #fdf6ec;
    color: #e6a23c;
  }
  .el-collapse-warn .el-collapse-item:last-child {
    margin-bottom: auto;
  }
  .el-collapse-warn .el-collapse-item__header {
    height: 28px;
    line-height: 28px;
    background: #fdf6ec;
    color: #c60;
    padding-left: 15px;
    border-bottom: none;
  }
  .el-collapse-warn .el-collapse-item.is-active .el-collapse-item__header {
    /* border-bottom: 1px solid #fedfb2; */
  }
  .el-collapse-warn .el-collapse-item__arrow {
    line-height: 28px;
  }
  .el-collapse-warn .el-collapse-item__content {
    padding: 0px 15px 5px 15px;
    font-size: 12px;
    color: #c60;
    line-height: 28px;
    background: #fdf6ec;
  }
  .el-collapse-warn .el-collapse-item__content a {
    color: #c60;
    text-decoration: none;
  }
  .el-collapse-warn .el-collapse-item__content a:hover {
    color: #c60;
    text-decoration:underline;
  }
</style>
