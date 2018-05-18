<template>
  <div class="group-tree-wrap">
    <el-tree :data="tree_data" ref="tree"
      node-key="value"
      :props="defaultProps"
      :default-checked-keys="checkedKeys"
      :render-content="renderContent"
      >
    </el-tree>
  </div>
</template>

<script>
  import flat_group from '@/api/flat_group.json';
  import tree_group from '@/api/tree_group.json';
  import {array_cluster, array_to_string} from './group-tool';

  export default {
    name: 'GroupTree',
    data (){
      return {
        tree_data: [],
        defaultProps: {
          children: 'child',
          label: 'label'
        }
      }
    },
    props: {
      checkedKeys: {
        type: Array,
        required: true,
        default: function(){
          return [];
        }
      }
    },
    watch : {
      checkedKeys: function () {
        this.$refs.tree && this.$refs.tree.setCheckedKeys(this.checkedKeys);
      }
    },
    created(){
      this.tree_data = tree_group.data;
    },
    methods : {
      handle_check_change(data, node, value){
        var checkedKeys = this.checkedKeys.slice(0);
        if (value) {
          checkedKeys.push(data.value);
        }
        else {
          checkedKeys = checkedKeys.filter( item => {
            return item != data.value;
          })
        }
        this.$refs.tree.setCheckedKeys(checkedKeys);
        this.get_str(checkedKeys, flat_group.tags);
        this.$emit('keys-change', checkedKeys);
      },
      get_str(keys, data) {
        var tmp = data.filter(item => {
          return keys.indexOf(item.tag_id) > -1
        }).map(item => {
          return item.tag_name.split('|').splice(-2)
        });
        var result = array_to_string(array_cluster(tmp, function (a, b) {
          return a && a[0] && b && b[0] && (a[0] == b[0])
        }));
        this.$emit('data-change', result);
      },
      renderContent ( h, { node, data, store }) {
        if( !data.child ) {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{data.label }</span>
              </span>
              <span>
                <el-checkbox value={node.checked} onInput={ (value) => this.handle_check_change(data, node, value) }></el-checkbox>
              </span>
            </span>
          )
        }
        else {
          return (
            <span onClick={ () => this.handle_check_change(data, node) }>{data.label }</span>
          )
        }
      }
    }
  }
</script>
<style>
  .group-tree-wrap {
    max-height: 300px;
    overflow: auto;
    border: 1px solid #dfe4ed;
  }
  .group-tree-wrap .el-tree-node__content {
    height: 35px;
  }
</style>
