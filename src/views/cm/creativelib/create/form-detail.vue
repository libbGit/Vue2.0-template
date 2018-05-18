<template>
    <el-form>
        <div class="hy-card">
            <div class="hy-card__content">
                <div class="table-wrap">
                    <div class="title">创意：{{form.name}}
                    </div>
                    <div class="detail">
                        <ul>
                            <li> HY代码：{{form.hy_code||'--'}}</li>
                            <li :title="form.advertiser_name"> 广告主：{{form.advertiser_name}}</li>
                            <li :title="form.brand_name"> 品牌/事业部：{{form.brand_name}}</li>
                            <li :title="form.project_name"> 产品线：{{form.product_line?form.product_line:'--'}}</li>
                            <li :title="form.project_name"> 项目：{{form.project_name}}</li>
                            <li :title="form.activity_name"> 活动：{{form.activity_name?form.activity_name:"--"}}</li>
                            <li :title="form.media_name"> 媒体：{{form.media_name}}</li>
                            <li :title="form.pos_name"> 点位：{{form.pos_name}}</li>
                            <li :title="form.versions"> 素材版本：{{form.versions}}</li>
                            <!-- <li> 购买形式：{{buyWay(form.buy_way)}}</li> -->
                            <li :title="form.advertiser_name" style="width:300px"> 广告投放类型：{{sohuAdType}}</li>

                        </ul>
                        <ul style=" padding: 10px ; margin-top: 10px;background: #f5f5f5;border-radius: 3px; width: 100%">
                            <li style="width: 100%"> 曝光监测代码：{{form.pv_monitor?form.pv_monitor:'--'}}</li>
                            <li style="width: 100%"> 点击监测代码：{{form.click_monitor?form.click_monitor:'--'}}</li>
                            <li style="width: 100%"> 落地页url：{{form.url?form.url:'--'}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <point-require-detail v-if='pointRequireShow'
            :backfillUrl="bf_pointRequire_url"
            :pointData="positionInfo">
        </point-require-detail>
    </el-form>
</template>
<script>
import _ from "lodash";
import PointRequireDetail from "./pointRequire-detail";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";

export default {
  name: "CreativelibDetailForm",
  components: {
    PointRequireDetail
  },
  props: {
    creativeParam: {
      type: Object,
      required: true
    }
  },
  data() {
    var validateHyCode = (rule, value, callback) => {
      callback();
    };
    return {
      sohuAdType: [],

      pointRequireEx: {},
      bf_sohuPutType: [], //bf--backfill回填之意
      bf_pointRequire_url: [], //
      // bf_pointRequire_val: {},
      loading: true,
      fileURL: {}, //上传文件的URL
      triggerSubmit: 0,
      form: {},
      putType: [], //专门用来获取搜狐的广告投放类型，sohu组件会上推上来
      /*----------------------------*/
      creativeName: "",
      aderName: "广告主名称",
      brand: "",
      productLine: "",
      project: "",
      activity: "",
      // media:'',
      // point:'',
      materialVer: "",
      purchaseForm: "",
      pointRequire: "", //专门用来点位要求。PointRequire组件会上推上来
      utmcode: "",
      exposureMonitorCode: "",
      clickMonitorCode: "",
      landPageURL: "",
      /*----------------------------*/
      rules: {
        hy_code: [{ validator: validateHyCode, required: true }],
        name: [{ required: true }],
        advertiser_name: [{ required: true }],
        brand_name: [{ required: true }],
        product_line: [{ required: true }],
        project_name: [{ required: true }],
        media_name: [{ required: true }],
        pos_name: [{ required: true }],
        versions: [{ required: true }],
        buy_way: [{ required: true }],

        product_line: [{ required: true }],
        project_name: [{ required: true }],
        media_name: [{ required: true }],
        pos_name: [{ required: true }]

        // pointRequire: [{ required: true, message: "预算分配表不能为空" }],
      },
      positionInfo: []
    };
  },
  watch: {
    creativeParam: {
      handler: function (val, oldVal) {
        this.fetch_get(val);
      },
      deep: true
    }
  },
  computed: {
    ...mapState("ad", ["ader_id", "ader_name"]),
    ...mapState("cm", ["mediaList", "sohuAdPutType"]),
    sohuAdTypeStr() {
      return this.sohuAdType.join(" / ");
    },
    pointRequireShow() {
      if (this.positionInfo && this.positionInfo.length) {
        return true;
      }
      return false;
    }
  },
  created() {
    this.fetch_get(this.creativeParam);
  },
  methods: {
    ...mapActions("cm", ["fetch_sohuAdPutType", "fetch_iQIYI"]),
    adPutType(objStr) {
      JSON.parse(objStr);
    },
    PointRequireEx(val) {
      this.pointRequireEx = val;
    },
    //1配送 2补量 3赠送
    buyWay(type) {
      type = type - 0;
      let str = "";
      switch (type) {
        case 1:
          str = "购买";
          break;
        case 2:
          str = "补量";
          break;
        case 3:
          str = "赠送";
          break;
        default:
          str = "未知";
      }
      return str;
    },
    getPutType(type) {
      this.putType = type;
    },
    getPointRequire(obj) {
      this.pointRequire = obj;
    },
    back() {
      this.$router.push({
        path: "/cm/creativelib/manage"
      });
    },
    // setBFpointRequire(objStr) {
    //   let tem = JSON.parse(objStr);
    //   if (Object.prototype.toString.apply(tem) == "[object Object]") {
    //     return tem;
    //   } else {
    //     return {};
    //   }
    // },
    setBFsohuPutType(mediaObj) {
      if (mediaObj) {
        let tem = mediaObj.type_tree;
        if (Array.isArray(tem)) {
          return tem;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    getNameMap(list) {
      let rs = {};
      for (let i = 0; i < list.length; i++) {
        rs[list[i]["id"]] = list[i]["name"];
        if (list[i].child && list[i].child.length > 0) {
          Object.assign(rs, this.getNameMap(list[i].child));
        }
      }
      return rs;
    },
    setsohuAdType(arr, arrTree) {
      let map = this.getNameMap(arrTree);
      let rs = [];
      for (let i = 0; i < arr.length; i++) {
        rs.push(map[arr[i]]);
      }

      this.sohuAdType = rs.join(" / ");
      return rs;
    },
    getSohuPutType() {
      let arr = this.setBFsohuPutType(this.form.media_info);
      let result = [];
      //媒体是搜狐
      if (this.form.media_id == 1) {
        this.fetch_sohuAdPutType().then(typeTree => {
          this.setsohuAdType(arr, typeTree);
        });
      } else if (this.form.media_id == 2) {
        this.fetch_iQIYI().then(typeTree => {
          this.setsohuAdType(arr, typeTree);
        });
      } else {
        this.sohuAdType = "--";
      }
    },
    fetch_get(obj) {
      let self = this;
      let url = obj.url;
      fetch.post(url, obj.param)
        .then(res => {
          if (res.ret == 0 && res.data) {
            self.loading = false;
            self.form = res.data;

            self.getPositionInfo(res.data.pos_id);
            // self.bf_pointRequire_url = self.setBFpointRequire(res.data.material);
            self.bf_pointRequire_url = res.data.material;

            // self.bf_pointRequire_val = self.setBFpointRequire(res.data.position_info);
            self.bf_sohuPutType = self.setBFsohuPutType(res.data.media_info);
            self.getSohuPutType();
          } else {
            self.$message.error("获取创意信息失败");
            console.error("res.ret", res.ret);
          }
        },
        err => {
          console.error(err);
          self.$message.error("获取创意信息失败");
        }
        );
    },
    getFileUrl() {
      let c = {};
      for (let i in this.pointRequireEx) {
        c[i] = this.pointRequireEx[i][0]["url"];
      }
      return c;
    },

    //获取媒体点位信息
    getPositionInfo(pos_id) {
      fetch.post("/creative/media_positions", { pos_id: pos_id })
        .then(res => {
          if (res.ret == 0 && res.data) {
            let positions = res.data;
            this.positionInfo = positions;
            // resolve();
          } else {
            // reject(new Error(res.msg));
            this.positionInfo = "";
            this.$message.error("媒体点位信息返回值为空");
            console.error(res.msg || "媒体点位信息返回值为空");
          }
        })
        .catch(err => {
          this.$message.error(err);
          this.positionInfo = "";
          // reject(err);
          console.error(err);
        });
    }
  }
};
</script>
<style scoped>
.status_fail {
  color: red;
  cursor: pointer;
  text-decoration: underline;
}
.title {
  font-size: 24px;
  line-height: 40px;
  color: #333;
}
.detail {
  font-size: 12px;
  color: #999;
}
ul {
  margin: 0 auto;
  padding: 0;
  display: inline-block;
}
.detail ul li {
  float: left;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 250px;
  margin-right: 20px;
  list-style: none;
  line-height: 24px;
}
</style>
