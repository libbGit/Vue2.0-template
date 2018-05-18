<template>
    <div class="developing-area hy-card__content ">
        <div class="developing-area  ">
            <i class="iconfont developing"></i>
            <p>开发中，敬请期待...</p>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "CrowdList",
  computed: {
    ...mapState("ad", ["ader_id"])
  },
  components: {},
  created() {
    this.initCorwdList();
  },
  data() {
    return {
      isLoading: false,
      dataTable: [],
      keywords: "",
      page: 1,
      limit: 10,
      total: 0,
      currentPage: 1,
      //1 生成中   3生成失败  7生成成功
      showStName: [
        "",
        "草稿",
        "生成中",
        "生成失败",
        "生成中",
        "生成中",
        "生成中",
        "生成成功",
        "生成失败"
      ]
    };
  },
  methods: {
    initCorwdList() {
      let pageData = {
        advertiser_id: this.ader_id,
        keywords: this.keywords,
        page: this.page,
        limit: this.limit
      };
      this.isLoading = true;
      fetch.post("/group/list", pageData).then(res => {
        this.isLoading = false;
        if (res.ret === 0 && res.data) {
          this.dataTable = res.data;
          this.total = Number(res.total) || 0;
        } else {
          this.dataTable = [];
        }
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.dataTable = [];
      this.initCorwdList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.dataTable = [];
      this.initCorwdList();
    },
    verdictOpeEdit(k) {
      if (k == 1) {
        return true;
      } else {
        return false;
      }
    },
    verdictOpeOth(k) {
      var ary = ["1", "3", "8"];
      if (ary.includes(k)) {
        return true;
      } else {
        return false;
      }
    },
    toCrowdComp(type, id) {
      this.$router.push({
        name: "CrowdTecentEdit",
        params: { type: type, id: id }
      });
    },
    deleCrowd(id) {
      this.$confirm("此操作将删除该人群, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        size: "mini",
        type: "warning"
      }).then(() => {
        fetch.post("/group/remove", { id: id }).then(res => {
          if (res.ret === 0 && res.data) {
            this.$message({
              message: "删除成功!",
              type: "success",
              showClose: true
            });
            this.page = 1;
            this.initCorwdList();
          }
        });
      });
    },
    makeCrowd(id) {
      fetch.post("/group/make", { id: id }).then(res => {
        if (res.ret === 0 && res.data) {
          this.$message({
            message: "生成操作成功!",
            type: "success"
          });
          this.initCorwdList();
        } else {
          this.$message({
            message: res.msg,
            type: "info",
            showClose: true
          });
        }
      });
    }
  }
};
</script>
<style scoped>
/* @import "@views/crowd/crowd.css"; */
</style>
