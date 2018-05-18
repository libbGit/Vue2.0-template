<template>
    <div>
        <div class="form-wrap clearfix ">
            <h2>
                <el-button size="mini"
                    @click="back"
                    icon="el-icon-arrow-left"
                    title="返回"></el-button> 创意详情
            </h2>
            <detail-form :creativeParam='info'></detail-form>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import CreativeNav from "@/views/cm/public/creative-nav";
import DetailForm from "./form-detail";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";

export default {
  name: "CreativelibDetail",
  components: {
    CreativeNav,
    DetailForm
  },
  data() {
    return {
      id: '',
      info: {
        url: '/creative/view_temple',
        param: {}
      }
    };
  },
  created() {
    this.info.param.id = this.$route.params.id;
  },
  methods: {
    back() {
      this.$router.push({
        path: "/cm/creativelib/manage"
      });
    }
  }
};
</script>
<style scoped>
.form-text {
  color: #5a5e66;
}
</style>
