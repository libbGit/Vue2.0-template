<template>
  <el-form-item>
    <div slot="label"><el-checkbox :value="local_check" @input="update_local_check"></el-checkbox> 地域定向</div>
    <div class="checkbox-list clearfix" v-if="local_check">
      <div class="pull-left" style="width:356px; border-right:1px solid #eee;">
      <div class="head clearfix">
        <el-col :span="4"><div class="title">备选地域</div></el-col>
        <el-col :span="2" :offset="12"><div class="select_filter" @click="check_all">全选</div></el-col>
        <el-col :span="5" :offset="1"><div class="select_filter" @click="check_most">不含港澳台</div></el-col>
      </div>
      <div class="body">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree ref="tree"
          node-key="code"
          show-checkbox
          :data="data"
          :props="defaultProps"
          :default-checked-keys="local"
          @check-change="handle_check_change"
          :filter-node-method="filterNode">
        </el-tree>
      </div>
      </div>
      <div class="pull-right" style="width:356px;">
        <div class="head clearfix">
          <div class="title">已选地域</div>
          <div class="operation" @click="clear_all">清空</div>
        </div>
        <div class="body">
          <ul class="clearfix selected_item_wrap">
            <li v-for="(item,index) in right_data" class="selected_item" :key="index">
              <template v-if="item.children_checked && item.children_checked.length == 1">
                <span class="text">{{item.children_checked[0].name}}</span><span class="close-btn" @click="remove_local(item)"><i class="el-icon-close"></i></span>
              </template>
              <template v-else-if="item.children_checked && item.children_checked.length == item.children.length">
                <span class="text">
                  {{item.name}}</span><span class="close-btn" @click="remove_local(item)"><i class="el-icon-close"></i></span>
              </template>
              <template v-else>
                <span class="text">
                  {{item.name}}<span v-if="item.children.length">({{item.children_checked.length}}-{{item.children.length}})</span>
                </span><span class="close-btn" @click="remove_local(item)"><i class="el-icon-close"></i></span>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </el-form-item>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import raw_data from '@/api/tree.json'
  import _ from "lodash"

  export default {
    name: 'location-tree',
    data () {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        all_id: [],
        most_id:[],

        filterText:""
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'local',
        'local_check',
      ]),
      right_data() {
        var tmp= [];
        var clone_data = this.$deepClone(this.data);
        tmp = clone_data.map( item => {
          if( this.local.indexOf(item.code) > -1 ){
            item.checked = true;
          }
          item.children_checked = item.children.filter( a =>{
            return this.local.indexOf(a.code) > -1;
          });
          return item;
        }).filter( item => {
          return item.checked || item.children_checked.length > 0
        })
        return tmp;
      }
    },
    watch : {
      // 不勾选怎默认选择空
      local_check ( value ) {
        if (!value) {
          this.update_local([]);
        }
      },

      filterText(val){
        this.$refs.tree.filter(val);
      },
    },
    created () {
      this.data = this.transform(raw_data.data[0].target_options);
      this.all_id =_.cloneDeep(raw_data.data[0].target_options.map( item => item.code));
      this.most_id = _.cloneDeep(raw_data.data[0].target_options.map( item => item.code).splice(3));
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_local',
        'update_local_check',
      ]),
      transform (data) {
        var result = [];
        result = data.filter( item => item.parent === "1156000000");
        return result.map( item => {
          item.children = data.filter( a => a.parent === item.code);
          return item;
        })
      },
      handle_check_change(){
        setTimeout( () => {
          var checked_keys = this.$refs.tree.getCheckedKeys(true);  //必须设置true，否则会选择父节点 10630
          this.update_local(checked_keys);
        }, 100)
      },
      check_all() {
        console.log(this.all_id)
        this.$refs.tree.setCheckedKeys(this.all_id);
        this.update_local(this.all_id);
      },
      clear_all() {
        this.$refs.tree.setCheckedKeys([]);
        this.update_local([]);
      },
      remove_local(item) {
        var result= this.local.slice(0);
        if(item.checked) {
          result = result.filter( a => {
            return a != item.code;
          })
        }
        if (item.children_checked.length > 0 ) {
          result = result.filter( a => {
            return item.children_checked.filter( b => {
              return b.code == a;
            }).length == 0;
          })
        }
        this.$refs.tree.setCheckedKeys(result);
        this.update_local(result);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      check_most(){
        this.$refs.tree.setCheckedKeys(this.most_id);
        this.update_local(this.most_id);
      },
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
    display: inline-block;
    width: 714px;
    border: 1px solid #eee;
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
  ul.selected_item_wrap {
    margin: 0;
    padding: 0;
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

  .select_filter{
    color:#409EFF;
    cursor: pointer;
  }
</style>
