<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import fetch from "@/services/fetch";

export default {
  name: "hy-dmp",
  data() {
    return {
      message: ""
    };
  },
  props: {
    values: {
      type: Object,
      required: false
    }
  },
  computed: {
    /*...mapState({
       本地state名字: state => state.模块名称.state名称
    })*/
    /* ...mapGetters('模块名称', ['getter名称']),*/
  },
  watch: {
    /*data或computed变量: {
      handler: function(val) {
        
      },
      deep: true
    }*/
  },

  methods: {
    /*...mapMutations('模块名称', [
      'mutation名称'
    ]),
    
    ...mapActions('模块名称', [
      'action名称'
    ]),*/
  },

  created() {
    //初始化,无法操作dom
  },

  mounted() {
    //初始化，可以操作dom
    //this.refs
  },

  components: {
    //子组件
  }
};
</script>
<style scoped>
/*本地部分*/
</style>
<style>
/*全局部分*/
</style>