<template>
  <div class="checkbox-list clearfix">
    <div class="pull-left" style="width:356px; border-right:1px solid #eee;">
      <div class="head clearfix">
        <div class="title">{{title}}</div>
        <div class="operation" @click="check_all">全选</div>
      </div>
      <div class="body">
       <el-checkbox-group :value="value"  @input="handle_input" >
        <el-checkbox v-for="item in items" :key="item[props.prop]" :label="item[props.prop]" >
          {{item[props.label]}}
        </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="pull-left" style="width:356px;">
      <div class="head clearfix">
        <div class="title">已选{{title}}</div>
        <div class="operation" @click="clear_all">清空</div>
      </div>
      <div class="body">
        <li v-for="item in seleted_items" class="selected_item">
          <span class="text">
           {{item[props.label]}}
          </span><span class="close-btn" @click="remove_item(item)"><i class="el-icon-close"></i></span>
        </li>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'checkbox-list',
    props: {
      title: {
        type: String,
        default: '列表'
      },
      value: {
        type: Array,
        required: true
      },
      items: {
        type: Array,
        required: true
      },
      props: {
        type: Object,
        default: function() {
          return {
            prop: 'prop',
            label: 'label'
          }
        }
      }
    },
    computed: {
      seleted_items () {
        var _this = this;
        return this.items.filter( item => {
          return this.value.indexOf(item[_this.props.prop]) > -1
        })
      }
    },
    methods: {
      check_all() {
        var _this = this;
        this.$emit('input', this.items.map( item => item[_this.props.prop]))
      },
      clear_all() {
        this.$emit('input', [])
      },
      remove_item(item){
        var result= this.seleted_items.slice(0);
        result = result.filter( child => {
          return child[this.props.prop] != item[this.props.prop]
        });
        this.$emit('input', result.map( item => item[this.props.prop]) );
      },
      handle_input (value) {
        this.$emit('input', value);
      }
    }
  }
</script>
<style scoped>
  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }
  .clearfix:after {
    clear: both;
  }
  .pull-left {
    float: left;
  }
  .pull-right {
    float: right;
  }
  .checkbox-list {
    width: 714px;
    border-left: 1px solid #fafafa;
    border-right: 1px solid #fafafa;
    margin: 0;
  }
  .head {
    font-size: 12px;
    line-height: 20px;
    padding: 5px 5px;
    background: #fafafa;
  }
  .head .title {
    float: left;
  }
  .head .operation {
    float: right;
    color: #409EFF;
    cursor: pointer;
  }
  .body {
    max-height: 300px;
    overflow: auto;
  }
  .checkbox-list .el-checkbox {
    display: block;
    padding: 2px 8px;
    margin-left: 0;
  }
  .checkbox-list .el-checkbox:hover {
    background-color: #f5f7fa;
  }
  li.selected_item {
    display: block;
    float: left;
    margin: 5px 5px 0;
    cursor: pointer;
  }
  li.selected_item .text {
    border: 1px solid #999;
  }
  li.selected_item .close-btn {
    cursor: pointer;
    border: 1px solid #999;
    border-left: none;
  }
  li.selected_item:hover .text,
  li.selected_item:hover .close-btn{
    border-color: #409EFF;
    color: #409EFF;
  }
  li.selected_item .text,
  li.selected_item .close-btn {
    color: #666;
    font-size: 12px;
    padding: 4px;
  }
</style>
