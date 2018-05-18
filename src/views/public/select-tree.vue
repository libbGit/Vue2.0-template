<template>
    <transition mode="out-in" name="el-zoom-in-top">
        <div v-show="isShow">
            <div class="tree-content" :style="treeWidth">
                <div class="tree-tool">
                    请选择
                    <div class="pull-right" :inline="true">
                        <el-button type="text" size="mini" @click="selectAll">全选</el-button>
                        <span> - </span>
                        <el-button type="text" size="mini" @click="reset">重置</el-button>
                    </div>
                </div>
                <div class="tree" :style="treeHeight">
                    <el-tree :data="values" show-checkbox node-key="key" ref="leftTree" :props="defaultProps" :default-checked-keys="selectedKeys">
                    </el-tree>
                </div>
            </div>

            <div class="select-add">
                <el-button type="primary" size="mini" @click="addSelectToRight">添加</el-button>
            </div>

            <div class="tree-content" :style="treeWidth">
                <div class="tree-tool">
                    已选 ({{this.selectedKeys.length}})
                    <div class="pull-right" :inline="true">
                        <el-button type="text" size="mini" @click="clearAll">清空</el-button>
                    </div>
                </div>
                <div class="tree" :style="treeHeight">
                    <div>
                        <el-tree :data="getFilters" default-expand-all node-key="key" ref="rightTree" :props="defaultProps" :filter-node-method="filterNode" :render-content="renderContent">
                        </el-tree>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import _ from "lodash";

export default {
  name: "tree",
  props: {
    //tree的宽度
    width: {
      type: String,
      required: true
    },

    //tree的高度
    height: {
      type: String,
      required: true
    },

    /**
     * tree的默认属性
     * {children:'child', label:'name'}
     */
    defaultProps: {
      type: Object,
      required: true
    },

    //tree需要显示的值
    values: {
      type: Array,
      required: true
    },

    //默认选中的keys项
    defaultSelectedKeys: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isShow: true,

      selectedKeys: [], //选中的条目keys
      selectedIds: [] //选中的条目ids
    };
  },

  computed: {
    treeWidth() {
      return { width: this.width };
    },
    treeHeight() {
      return { height: this.height };
    },

    //不用当right tree把全部列表加载完再去过滤，而是直接把过滤好的结果给right tree。这样不会有抖动
    getFilters(){
      return this.values.filter((item)=>{
        for(let i of this.selectedKeys){
          if(i==item.key){
            return true;
          }else{
            continue;
          }
        }
      });
    }
  },

  watch: {
    selectedKeys: {
      handler: function(val) {
        console.log("selectedKeys", val);
        this.$emit("update", { keys: val, ids: this.getIds(val) });
      },
      deep: true
    },

    defaultSelectedKeys: {
      handler: function(val) {
        console.log("defaultSelectedKeys");
        this.selectedKeys = _.cloneDeep(val);
        this.isShow = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.isShow = true;
          }, 200);
        });
      },
      deep: true
    }
  },

  methods: {
    /**全选 */
    selectAll() {
      this.$refs.leftTree.setCheckedNodes(this.values);
    },

    /**重置 */
    reset() {
      this.$refs.leftTree.setCheckedNodes([]);
    },

    /**添加 */
    addSelectToRight() {
      this.selectedKeys = this.$refs.leftTree.getCheckedKeys(true);
      this.$refs.rightTree.filter(this.selectedKeys);
    },

    /**清空 */
    clearAll() {
      this.selectedKeys = [];
      this.$refs.rightTree.filter(this.selectedKeys);
    },

    /**删除 */
    remove(node, data) {
      let key = this.selectedKeys.indexOf(data.key);
      this.selectedKeys.splice(key, 1);
      this.$refs.rightTree.filter(this.selectedKeys);
    },

    //执行 filter 方法后调用
    filterNode(value, data) {
      if (!value) return true;
      return value.indexOf(data.key) !== -1;
    },

    /**自定义已选条目样式 */
    renderContent(h, { node, data, store }) {
      if (data.child && data.child.length > 0) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span />
          </span>
        );
      } else {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button
                style="font-size: 12px;"
                type="text"
                on-click={() => this.remove(node, data)}
              >
                删除
              </el-button>
            </span>
          </span>
        );
      }
    },

    /**获取ids */
    getIds(selectedKeys) {
      this.selectedIds = [];
      if (selectedKeys.length != 0) {
        for (let i in selectedKeys) {
          this.findIdsByKeys(this.values, selectedKeys[i]); //通过keys将id找出来
        }
      }

      return this.selectedIds;
    },

    /**深度遍历自定义列表，通过keys找出id值 */
    findIdsByKeys(lists, key) {
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].child == undefined || lists[i].child == null) {
          if ((lists[i].key+"") == (key+"")) {
            this.selectedIds.push(lists[i].id);
          }
          continue;
        } else {
          this.findIdsByKeys(lists[i].child, key);
        }
      }
    }
  },
  created () {
    this.selectedKeys =  _.cloneDeep(this.defaultSelectedKeys);
    console.log("defaultSelectedKeys", this.defaultSelectedKeys);
  }
};
</script>

<style scoped>
.tree-content {
  width: 200px;
  float: left;
  border: 1px solid #dedede;
}

.tree-tool {
  height: 28px;
  padding: 0 10px;
  line-height: 2;
  background-color: #fafafa;
  border-bottom: 1px #eee solid;
}

.tree {
  height: 400px;
  overflow: auto;
}

.select-add {
  width: 55px;
  float: left;
  margin: 0px 5px;
}
</style>