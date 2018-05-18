<template>
  <div class="project-list" >
    <div class="project-list__title" :title="ader_name">
      {{ader_name}}
    </div>
    <div class="project-list__content" id="layout">
      <el-tree
        :expand-on-click-node="false"
        :highlight-current="true"
        :default-expand-all="false"
        :data="projects"
        :default-expanded-keys="treeExpand_key"
        node-key="_id"
        ref="tree"
        @node-expand='onNodeExpand'
        @node-collapse='onNodeCollapse'
        :props="defaultProps"
        :render-content="renderContent"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions,mapGetters  } from "vuex";
export default {
  name: "sidebar-tree",
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },

    };
  },
  created() {
    console.log('tree-created')
    this.fetch_getProjects({'advertiser_id':this.ader_id});
    // this.$refs.tree.setCurrentKey(this.highlight_key);
  },
  activated(){
    console.log('tree-activated')
  },
  deactivated(){console.log('tree-deactivated')},
  destroy(){console.log('tree-destroy')},
  beforeDestroy(){console.log('tree-beforeDestroy')},
  mounted () {},
  updated(){
    if (this.highlight_key) {
      this.$refs.tree.setCurrentKey(this.highlight_key);
    }
  },
  computed: {
    ...mapState('user', [
      'role'
    ]),
    ...mapState("ad", [
      "ader_id",
      "ader_name",
      "project_id",
      "activity_id",
      'projects',
      'treeExpand_key'
    ]),
    ...mapGetters("ad", [
      "highlight_key"
    ])
  },
  watch:{
    '$route' (to, from) {
      // console.log("tree-route")
      if (to.path=="/ad/project/manage") {
        this.fetch_getProjects({'advertiser_id':this.ader_id});
        this.update_activity_id('');
        this.update_project_id('');
        this.update_campaign_id('');
        // this.pro_k = [];
      }else if (to.path=='/ad/campaign/manage') {
        this.update_campaign_id('');
      }
      /*else{
        this.setCurrentKey();
        this.$refs.tree.setCurrentKey(this.currentkey);
      }*/
    },
    highlight_key(n,o){
      this.$refs.tree.setCurrentKey(n);
    }
  },
  methods: {
    ...mapActions("ad", [
      "fetch_getProjects",
      'update_project_id',
      'update_project_name',
      'update_activity_id',
      'update_activity_name',
      'update_campaign_id',
      'update_campaign_name',
      'update_treeExpand_key',
      'clear_treeExpand_key'
    ]),
    onNodeExpand(data, node){
      let id = data._id;
      let type = 'add';
      this.update_treeExpand_key({id,type});
    },
    onNodeCollapse(data, node){
      let id = data._id;
      let type = 'del';
      this.update_treeExpand_key({id,type});
    },
    renderContent(h, { node, data, store }) {
      return (<li style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;' title={node.label}>{node.label}</li>);
    },
    handleNodeClick(data, node) {
      // 选择计划
      if( node.level  == 1) {
        this.update_project_id(data.id);
        this.update_project_name(data.name);
        this.update_activity_id('');
        this.update_activity_name('');
        this.update_campaign_id('');
        this.update_campaign_name('');
        this.$router.push({
          path: '/ad/activity/manage'
        });
      }else if( node.level  == 2) {
        this.update_project_id(node.parent.data.id);
        this.update_project_name(node.parent.data.name);
        this.update_activity_id(data.id);
        this.update_activity_name(data.name);
        this.update_campaign_id('');
        this.update_campaign_name('');
        this.$router.push({
          path: '/ad/campaign/manage'
        })
      }else{
        this.update_project_id(node.parent.parent.data.id);
        this.update_project_name(node.parent.parent.data.name);
        this.update_activity_id(node.parent.data.id);
        this.update_activity_name(node.parent.data.name);
        this.update_campaign_id(data.id);
        this.update_campaign_name(data.name);
        this.$router.push({
          path: '/ad/campaign/crowd'
        })
      }
    },
    back () {
      this.$router.push({
        path: '/advertiser'
      })
    }
  }
};
</script>
<style scoped>
.project-list__title {
  color: #333;
  height: 36px;
  padding: 0 10px;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  background: #fafafa;
  word-break:keep-all;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.project-list__content {
  position: fixed;
  top:97px;
  width: 200px;
  bottom: 0;
  overflow-y: auto;
}
.project-list__back {
  color: #fff;
  position: absolute;
  right: 22px;
  top: 0px;
}
</style>
