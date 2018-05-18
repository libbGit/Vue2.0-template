<template>
    <div class="form-wrap clearfix ">
        <h2 v-if="!isCopy">编辑创意</h2>
        <h2 v-else>复制创意</h2>
        <form-edit @onCancel='onCancel'
            @onSubmit='onSubmit'
            :isCopy='isCopy'
            :creativeParam='creativeParam'
            url='/creative/view_temple'>
        </form-edit>
    </div>
</template>
<script>
import CreativeNav from "@/views/cm/public/creative-nav";
import FormEdit from "./form-edit";

export default {
  name: "CreativelibEdit",
  components: {
    CreativeNav,
    FormEdit
  },
  data() {
    return {
      creativeParam: { 'id': '' },
      isCopy: false //是否是复制页面
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let params = this.$route.params;
      this.creativeParam.id = params.id;
      this.isCopy = params.isCopy == true;
    },
    onSubmit() {
      this.$router.push({
        path: "/cm/creativelib/manage"
      });
    },
    onCancel() {
      this.$router.push({
        path: "/cm/creativelib/manage"
      });
    }
  }
};
</script>
<style scoped>

</style>
