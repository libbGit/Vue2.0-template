<template>
    <div>
        <el-dialog :visible.sync="showDialog"
            width="900px"
            :before-close="beforeCloseDialog"
            class="cm-detail-dialog">

            <el-form size="mini"
                class="form-container1"
                ref="editForm"
                :model="editForm"
                :rules="rules"
                label-width="100px">
                <el-form-item class="select-item"
                    label="点位名称/ID:"
                    prop="name"
                    style="width:50%">
                    <el-input placeholder="请输入"
                        v-model="editForm.name"
                        class="input-with-select">
                        <el-button slot="append"
                            icon="el-icon-search"
                            @click.native="searchPos(editForm.name)"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="选择点位:"
                    prop="pos">
                    <pos-tree v-if="treeData.length>0"
                        :values="treeData"
                        :defaultProps="{children:'child', label:'name'}"
                        :defaultSelectedKeys="selectedKeys"
                        width="330px"
                        height="200px"
                        @update="treeUpdate">
                    </pos-tree>
                    <div v-else>点位树正在加载中...</div>
                </el-form-item>
            </el-form>

            <div class="relate-operation">
                <el-button size="mini"
                    type="primary"
                    @click.native="save">确定</el-button>
                <el-button size="mini"
                    @click.native="cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import fetch from "@/services/fetch";

import posTree from "@/views/public/select-tree";

export default {
  name: "pbs-relate", //关联pbs点位
  data() {
    return {
      showDialog: true,
      editForm: {
        name: "",
        pos: []
      },
      rules: {
        // name: [
        //   { required: true, message: "请输入主标题" },
        //   { max: 10, message: "最多10个字" },
        //   { validator: validateMainTitle, trigger: "blur" }
        // ],
      },

      treeData: [],
      selectedKeys: []
    };
  },
  props: {
    values: {
      type: Array,
      required: false
    },
    mediaId: {
      type: Number,
      required: false
    }
  },

  computed: {
    ...mapState("ad", ["ader_id", "ader_name"])
  },

  methods: {
    beforeCloseDialog(done) {
      this.$emit("close");
      done();
    },

    /**通过点位名称/id 搜索 */
    searchPos(name) {
      this.isShowTree = false;
      fetch
        .post("/mediaPos/select", {
          media_id: this.mediaId,
          keyword: name
        })
        .then(res => {
          this.isShowTree = true;

          this.treeData = res.data.pos.map(item => {
            return { ...item, key: item.pbs_pos_id, name: item.pbs_pos_name };
          });
          // this.selectedKeys = [];
        }).catch((err) => {
          this.$message.error(err);
        });
    },

    /**更新已选中的tree节点 */
    treeUpdate(data) {
      this.editForm.pos = data.keys;
    },

    getPosValue() {
      let formValue = [];
      for (let item of this.treeData) {
        if (this.editForm.pos.includes(item.pbs_pos_id)) {
          formValue.push(item);
        }
      }
      return formValue;
    },

    save() {
      // this.$refs["matchForm"].$refs["baseForm"].validate(valid => {
      // if (valid) {
      this.$emit("close");
      this.$emit("update", this.getPosValue());
      // fetch
      //   .post("/relate/save", this.getFormValue())
      //   .then(res => {
      //     // if (res.ret === 0) {
      //     this.$alert("点位关联成功", "提示", {
      //       confirmButtonText: "确定",
      //       callback: action => {
      //         this.showDialog = false;
      //         this.$emit("close");
      //         this.$emit("update");
      //       }
      //     });
      //     // } else {
      //     //   this.$alert(res.msg, "匹配保存失败");
      //     // }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      // } else {
      //   return false;
      // }
      // });
    },

    cancel() {
      this.showDialog = false;
      this.$emit("close");
    }
  },

  created() {
    this.searchPos('');
    this.selectedKeys = this.values;
    console.log("values", this.values);
  },

  components: {
    posTree
  }
};
</script>
<style scoped>
.select-item {
  margin-bottom: 20px;
  margin-right: 100px;
}

.upload-demo {
  margin-right: 100px;
}

.relate-operation {
  margin-top: 20px;
  margin-right: 30px;
  text-align: right;
}
</style>