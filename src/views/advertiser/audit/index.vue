<template>
  <div class="media_audit_wrap"
    v-loading="loading">
    <div class="section">
      <span style="font-size: 14px; font-weight: bold">媒体名称 :</span>
      <el-select v-model="media_id"
        placeholder="请选择"
        size="mini">
        <el-option v-for="item in unselected_media_list"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button size="mini"
        @click="add_media">添加</el-button>
    </div>
    <div class="section">
      <el-table size="mini"
        :data="media_aduit_list"
        border
        style="width: 100%">
        <el-table-column prop="media_name"
          label="媒体"
          width="120">
        </el-table-column>
        <el-table-column prop="audit_content"
          label="审核内容">
          <template slot-scope="scope">
            <div>
              {{format_audit_content(scope.row.media_id, scope.row.audit_content, scope.row.audit_rules)}}
              <el-button v-if="is_not_empty(scope.row.audit_content) && is_show_delete_audit(scope.row.audit_status)"
                @click="handle_edit_media_audit(scope.row)"
                type="text"
                size="small">编辑</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="audit_status"
          label="审核状态"
          width="160">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.audit_status"
              :key='index'>
              <!-- 当媒体为搜狐时显示媒体名称 -->
              <span v-if="scope.row.media_id == 1">{{item.media_name}} : </span>
              <span v-if="item.status == 3">
                <el-tooltip :content="item.msg"
                  placement="top"
                  v-if='item.msg!=""'>
                  <span class="status_fail">{{ format_audit_status(item.status) }}</span>
                </el-tooltip>
                <span class="status_fail"
                  v-else>{{ format_audit_status(item.status) }}</span>
              </span>
              <span v-else>
                {{ format_audit_status(item.status) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="audit_time"
          label="审核时间"
          width="160">
          <template slot-scope="scope">
            <div v-for="(item,index)  in scope.row.audit_status"
              :key='index'>
              <!-- 当媒体为搜狐时显示媒体名称 -->
              <span v-if="scope.row.media_id == 1"> {{item.media_name}} : </span>
              {{ item.audit_time || '--' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button v-if="is_show_submit_audit(scope.row.audit_status)"
              @click="handle_submit_media_audit(scope.row)"
              type="text"
              size="small">
              提交审核</el-button>
            <span v-if="is_show_delete_audit(scope.row.audit_status)">-</span>
            <el-button v-if="is_show_delete_audit(scope.row.audit_status)"
              @click="handle_delete_media_audit(scope.row)"
              type="text"
              size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="section">
      <router-link to="/advertiser">
        <el-button size="mini">返回</el-button>
      </router-link>
    </div>
    <common v-if="media_audit_dialog"
      :isShow.sync='media_audit_dialog'
      :type="media_audit_dialog_type"
      :ader_id="ader_id"
      :media_id="editing_media_id"
      :id="media_audit_dialog_id"
      :media_audit_rules="media_select_audit_rules"
      :media_audit_content="media_select_audit_content"
      @refresh="fetch_media_audit_list"></common>
  </div>

</template>
<script>
import fetch from "@/services/fetch";
import common from "./common";
import _ from "lodash";
// import youku from "./youku";
// import sohu from "./sohu";

const SOHU = "1"; //搜狐
const IQIYI = "2"; //爱奇艺
const LETV = "3"; //乐视
const PPTV = "4"; //PPTV
const YOUKU = "5"; //优酷
const GUANGDIANTONG = "7"; //广点通
const NETEASE = "11"; //网易
const IFENG = "12"; //凤凰
const SINA = "13"; //新浪
const PCAUTO = "14"; //太平洋汽车
const XCAR = "15"; //爱卡
const MOJI = "21"; //墨迹天气
const WEIBO = "23"; //微博
const TOUTIAO = "25"; //今日头条
const AUTOHOME = "26"; //汽车之家(新)
const YOUPENG = "28"; //优朋
const FENGXING = "31"; //风行
const BAOFENG = "32"; //暴风
const CHELUN = "33"; //车轮
const MOMOSPLASH = "35"; //陌陌闪屏
const MOMOINFO = "36"; //陌陌信息流
const NEWTENCENT = "37"; //新腾讯
const YICHE2 = "41"; //易车2
const MAX360 = "42"; //易车2
const NEW163 = "43"; //新网易
const WIFIKEY = "44"; //Wifi万能钥匙
const WPS = "45"; //WPS
const ZAKER = "46"; //Zaker
const ELEPHANTSLINK = "47"; //万象互联
const MEITU = "48"; //美图
const XIMALAYA = "49"; //喜马拉雅
const ZHIBO8 = "50"; //直播吧
const FLIGHTSTEWARD = "51"; //高铁/航班管家
const DONGQIUDI = "52"; //懂球帝

const UNDIRECT_ADD_LIST = [SINA,MAX360,SOHU, PPTV, YOUKU, WEIBO, NEWTENCENT, NEW163, GUANGDIANTONG, AUTOHOME, ELEPHANTSLINK]; //不能直接添加的列表
export default {
  name: "AderAudit",
  data() {
    return {
      loading: false,
      // 广告主id
      ader_id: "",
      // 媒体列表
      media_list: [],
      // 需要添加的媒体
      media_id: "",
      // 正在编辑的媒体id
      editing_media_id: "",
      // 媒体类型
      media_type: "",
      // 需要添加的媒体审核需要的内容
      media_select_audit_rules: [],
      media_select_audit_content: {},
      // 媒体审核情况列表
      media_aduit_list: [],
      // 添加/编辑媒体审核弹窗
      media_audit_dialog: false,
      // 媒体审核弹窗类型，add 新增，edit 编辑
      media_audit_dialog_type: "add",
      // 正在编辑媒体审核弹窗
      media_audit_dialog_id: ""
    };
  },
  created() {
    this.ader_id = this.$route.params.id;
    this.fetch_media_list().catch(err => {
      this.$message.error("获取媒体列表失败");
    });
    this.fetch_media_audit_list().catch(err => {
      this.$message.error("获取媒体审核列表失败");
    });
  },
  computed: {
    // 未被添加的媒体列表
    unselected_media_list() {
      return this.media_list.filter(item => {
        return !this.is_media_added(item.id);
      });
    }
  },
  methods: {
    // 获取媒体列表
    fetch_media_list() {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/media/getAll")
          .then(res => {
            if (res.ret == 0) {
              this.media_list = res.data;
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 获取媒体送审信息列表
    fetch_media_audit_list() {
      this.media_id = "";
      this.loading = true;
      return new Promise((resolve, reject) => {
        return fetch
          .post("/advertiser/getAuditList", {
            ader_id: this.ader_id
          })
          .then(res => {
            this.loading = false;
            if (res.ret == 0) {
              this.media_aduit_list = res.data;
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            this.loading = false;
            reject(err);
          });
      });
    },
    /**
     * 获取某个媒体的送审条件
     * @method
     * @param {string} media_id - 媒体的id
     */
    fetch_media_rule() {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/advertiser/getMediaRules", {
            media_id: this.editing_media_id
          })
          .then(res => {
            if (res.ret == 0) {
              this.media_select_audit_rules = res.data;
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     * 提交媒体审核
     * @method
     * @param {string} id - 媒体审核的id
     */
    submit_media_audit(id) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/advertiser/pushAudit", {
            id: id
          })
          .then(res => {
            if (res.ret == 0) {
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    handle_submit_media_audit(row) {
      this.submit_media_audit(row.id)
        .then(() => {
          this.fetch_media_audit_list();
        })
        .catch(err => {
          this.$message.error(err.message || "提交媒体审核失败");
        });
    },
    /**
     * 删除媒体审核
     * @method
     * @param {string} id - 媒体审核的id
     */
    delete_media_audit(id) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/advertiser/delMedia", {
            id: id
          })
          .then(res => {
            if (res.ret == 0) {
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    handle_delete_media_audit(row) {
      this.$confirm("你确定删除该媒体审核?", "提示")
        .then(() => {
          this.delete_media_audit(row.id)
            .then(() => {
              this.$message.success("删除成功");
              this.fetch_media_audit_list();
            })
            .catch(err => {
              this.$message.error(err.message || "删除失败");
            });
        })
        .catch(err => { });
    },
    /**
     * 保存需要送审的媒体
     * @method
     * @param {string} ader_id - 广告主的id
     * @param {string} media_id - 媒体的id
     * @param {string} audit_content - 需要送审的内容，可选
     */
    save_media_audit(payload) {
      return new Promise((resolve, reject) => {
        return fetch
          .post("/advertiser/addMedia", payload)
          .then(res => {
            if (res.ret == 0) {
              resolve();
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    add_media() {
      if (!this.media_id) {
        this.$message.warning("请选择需要添加的媒体！");
      } else if (this.is_media_added(this.media_id)) {
        this.$message.warning("该媒体已经被添加，请重新选择！");
      } else if (UNDIRECT_ADD_LIST.indexOf(this.media_id) == -1) {
        this.save_media_audit({
          ader_id: this.ader_id,
          media_id: this.media_id
        })
          .then(res => {
            this.$message.success("添加媒体成功");
            this.fetch_media_audit_list();
            this.media_id = "";
          })
          .catch(err => {
            this.media_id = "";
            this.$message.error(err.message);
          });
      } else {
        this.editing_media_id = this.media_id;
        this.media_id = "";
        this.set_dialog_type();
        this.fetch_media_rule()
          .then(() => {
            this.media_audit_dialog_type = "add";
            this.media_select_audit_content = {};
            this.media_audit_dialog = true;
          })
          .catch(err => {
            this.$message(err.message);
          });
      }
    },
    // 编辑
    handle_edit_media_audit(row) {
      this.editing_media_id = row.media_id;
      this.set_dialog_type();
      this.media_audit_dialog_type = "edit";
      this.media_audit_dialog_id = row.id;
      this.media_select_audit_rules = row.audit_rules;
      this.media_select_audit_content = row.audit_content;
      this.media_audit_dialog = true;
    },
    /**
     * 判断媒体是否已被增加
     * @param {string} media_id - 媒体id
     */
    is_media_added(media_id) {
      var result = this.media_aduit_list.filter(item => {
        return item.media_id == media_id;
      });
      return result.length > 0;
    },
    /**
     * 判断媒是否可以编辑
     * @param {Object|Array} audit_content - 媒体审核所需内容
     */
    /**
     * 格式化输出审核状态
     * @param {string} status - 媒体审核状态
     */
    is_not_empty(audit_content) {
      var flag = false;
      // 如果是数组且不为空
      if (
        Object.prototype.toString.call(audit_content) == "[object Array]" &&
        audit_content.length > 0
      ) {
        flag = true;
      } else if (
        Object.prototype.toString.call(audit_content) == "[object Object]"
      ) {
        // 如果是对象且不为空
        for (var prop in audit_content) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    // 设置弹窗类型
    set_dialog_type() {
      
      if (this.editing_media_id == YOUKU) {
        this.media_type = "youku";
      } else {
        this.media_type = "sohu";
      }
      this.media_type = "common";
    },
    getNameMap(list) {
      let rs = {};
      for (var item of list) {
        rs[item['id']] = item['name'];
        if (item.child && item.child.length > 0) {
          Object.assign(rs, this.getNameMap(item.child));
        }
      }
      return rs;
    },
    format_audit_content(media_id, audit_content, audit_rules) {
      // console.log('content=',audit_content)
      // console.log('rule=',audit_rules)
      var result = [];
      var audit_content = _.cloneDeep(audit_content);
      var audit_rules = _.cloneDeep(audit_rules);
      for (var prop in audit_content) {
        if (audit_content[prop]) {
          var rule = audit_rules.find(item => item.field == prop);
          if (rule && rule.type == "text") {
            var name = rule.name;
            var value = audit_content[prop];

            if (value) {
              result.push(name + "：" + value);
            }
          } else if (rule && rule.type == "radio") {
            var name = rule.name;
            var checked_value = rule.data.find(
              item => item.value == audit_content[prop]
            );
            var value = checked_value ? checked_value.name : "-";
            if (value) {
              result.push(name + "：" + value);
            }
          }
        }
      }

      for (const rule of audit_rules) {
        if (rule.type == 'cascader') {
          // console.log('data---',rule.data)
          let nameMap = this.getNameMap(rule.data);
          // console.log('nameMap---',nameMap)
          let arrData = rule.data
          for (const rfield of rule.field) {
            // console.log('field---',rfield.field)
            // console.log('name---',rfield.name)
            let val = audit_content[rfield.field]
            if (val) {
              result.push(rfield.name + ": " + nameMap[val]);
            }
          }
        }
      }

      return result.join(", ");
    },
    format_audit_status(status) {
      if (status == "0") {
        return "尚未审核";
      } else if (status == "1") {
        return "送审中";
      } else if (status == "2") {
        return "审核通过";
      } else if (status == "3") {
        return "审核失败";
      } else if (status == "4") {
        return "无需审核";
      } else {
        return "未知";
      }
    },
    /*
       * 是否显示推送审核
       */
    is_show_submit_audit(audit_status) {
      var flag = false;
      audit_status.forEach(item => {
        if (item.status == "0" || item.status == "3") {
          flag = true;
        }
      });
      return flag;
    },
    /*
       * 是否显示删除审核
       */
    is_show_delete_audit(audit_status) {
      var flag = true;
      audit_status.forEach(item => {
        if (item.status == "1" || item.status == "2") {
          flag = false;
        }
      });
      return flag;
    }
  },
  components: {
    common,
    // youku,
    // sohu
  }
};
</script>
<style>
.media_audit_wrap {
  background: #fff;
  min-height: 600px;
}
.section {
  margin: 10px;
  padding: 5px 8px;
}
.status_fail {
  color: red;
  cursor: pointer;
  text-decoration: underline;
}
</style>
