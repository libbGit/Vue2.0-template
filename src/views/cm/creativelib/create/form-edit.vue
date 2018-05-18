<template>
    <el-form class="form-container"
        size="mini"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
        v-loading="loading">
        <div class="form_left">
            <el-form-item label="HY代码："
                prop="hy_code">
                <span class='form-text'>{{form.hy_code||'暂无'}}</span>
            </el-form-item>

            <el-form-item label="创意名称："
                prop="name">
                <span class='form-text'
                    v-if='!isCopy'>{{form.name}}</span>
                <el-input v-model="form.name"
                    placeholder="请输入创意名称"
                    v-if='isCopy'></el-input>
            </el-form-item>

            <el-form-item label="广告主："
                prop="advertiser_name">
                <span class='form-text'>{{form.advertiser_name}}</span>
            </el-form-item>

            <el-form-item label="品牌："
                prop="brand_name">
                <span class='form-text'>{{form.brand_name}}</span>
            </el-form-item>

            <el-form-item label="项目："
                prop="project_name">
                <span class='form-text'>{{form.project_name}}</span>
            </el-form-item>

            <el-form-item label="产品线："
                temprop="product_line">
                <span class='form-text'>{{form.product_line?form.product_line:'暂无'}}</span>
            </el-form-item>

            <el-form-item label="活动：">
                <span class='form-text'>{{form.activity_name?form.activity_name:"暂无"}}</span>
            </el-form-item>

            <el-form-item label="媒体："
                prop="media_name">
                <span class='form-text'>{{form.media_name}}</span>
            </el-form-item>

            <el-form-item label="点位："
                prop="pos_name">
                <span class='form-text'>{{form.pos_name}}</span>
            </el-form-item>

            <el-form-item label="素材版本："
                prop="versions">
                <el-input v-model="form.versions"
                    placeholder="请输入素材版本"
                    style="width: 182px"></el-input>
            </el-form-item>

        </div>
        <div class="form_right">
            <transition mode="out-in"
                name="el-zoom-in-top">
                <point-require v-if='pointRequireShow'
                    :backfillUrl="bf_pointRequire_url"
                    :pointData="positionInfo"
                    :triggerSubmit='triggerSubmit'
                    @pointRequireEx='PointRequireEx'
                    @pointRequiretData='getPointRequire'
                    @validateResult-point='validateResult_point'>
                </point-require>
            </transition>
            <sohu v-if="form.media_id==1||form.media_id==2"
                :backfillData='bf_sohuPutType'
                :mediaType='form.media_id'
                :triggerSubmit='triggerSubmit'
                @adPutData='getPutType'
                @validateResult-sohu='validateResult_sohu'>
            </sohu>
            <!-- <el-form-item label="购买形式：" prop="buy_way">
              <span class='form-text'>{{buyWay(form.buy_way)}}</span>
            </el-form-item> -->
            <!-- <el-form-item  label="监测代码：" style='width:490px;'>
              <el-input v-model="utmcode" placeholder="请输入监测代码"></el-input>
            </el-form-item> -->

            <el-form-item label="曝光监测代码："
                prop="pv_monitor">
                <el-input v-model="form.pv_monitor"
                    placeholder="请输入曝光监测代码"></el-input>
            </el-form-item>

            <el-form-item label="点击监测代码："
                prop="click_monitor">
                <el-input v-model="form.click_monitor"
                    placeholder="请输入点击监测代码"></el-input>
            </el-form-item>

            <el-form-item label="落地页url："
                prop="url">
                <el-input v-model="form.url"
                    placeholder="请输入落地页url"></el-input>
            </el-form-item>
        </div>
        <div class="clearfix"></div>
        <div class="form_bottom">
            <el-form-item>
                <el-button type="primary"
                    @click="onSubmit">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </div>
    </el-form>

</template>
<script>
import _ from "lodash";
import PointRequire from "./pointRequire";
import sohu from "./sohu";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
var creativeNameReg = /^[a-zA-Z0-9\u4E00-\u9FA5_\(\)（）]{1,30}$/;
export default {
  name: "CreativeEditForm",
  components: {
    PointRequire,
    sohu
  },
  props: {
    isCopy: {
      type: Boolean, //是否是复制页面
      default: false
    },
    url: {
      type: String,
      required: true
    },
    creativeParam: {
      type: [Object],
      required: true
    }
  },
  data() {
    var validateHyCode = (rule, value, callback) => {
      callback();
    };
    var urlvalidator = (rule, value, callback) => {
      if (_.trim(value) != "" && !urlReg.test(_.trim(value))) {
        callback(new Error("请输入合法的url"));
      } else {
        callback();
      }
    };
    var nameValidator = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入创意名称"));
      } else if (30 < value.length) {
        callback(new Error("最大长度不能超过30个字符"));
      } else if (!creativeNameReg.test(value)) {
        callback(new Error("只允许是数字、字母、中文、下划线、括号"));
      } else {
        callback();
      }
    };
    return {
      isTemplate: false, //是否是模板页面
      pointRequireEx: {},
      bf_sohuPutType: [], //bf--backfill回填之意
      bf_pointRequire_url: [], //
      // bf_pointRequire_val: {},
      loading: true,
      fileURL: {}, //上传文件的URL
      triggerSubmit: 0,
      form: {},
      putType: [], //专门用来获取搜狐的广告投放类型，sohu组件会上推上来
      validateResultSohu: false, //搜狐子组件的校验结果
      validateResultPoint: false, //点位要求子组件的校验结果
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
      pointRequire: "", //专门用来点位要求。PointRequire组件会上推上来
      utmcode: "",
      exposureMonitorCode: "",
      clickMonitorCode: "",
      landPageURL: "",
      /*----------------------------*/
      rules: {
        hy_code: [{ validator: validateHyCode, required: true }],
        advertiser_name: [{ required: true }],
        brand_name: [{ required: true }],
        product_line: [{ required: true }],
        project_name: [{ required: true }],
        media_name: [{ required: true }],
        pos_name: [{ required: true }],

        name: [{ validator: nameValidator, trigger: "blur" }],
        versions: [{ required: true, message: "请输入素材版本" }],
        buy_way: [
          { required: true, message: "请选择购买形式", trigger: "change" }
        ],
        pv_monitor: [
          {
            validator: urlvalidator,
            message: "请输入合法的曝光监测代码",
            trigger: "blur"
          }
        ],
        click_monitor: [
          {
            validator: urlvalidator,
            message: "请输入合法的点击监测代码",
            trigger: "blur"
          }
        ],
        url: [
          {
            validator: urlvalidator,
            message: "请输入合法的落地页url",
            trigger: "blur"
          }
        ]
        // pointRequire: [{ required: true, message: "预算分配表不能为空" }],
      },

      positionInfo: []
    };
  },
  watch: {
    creativeParam: {
      handler: function (val, oldVal) {
        this.fetch_get();
      },
      deep: true
    },
    validateResultPoint(nVal, oVal) {
      if (nVal === true) {
        this.submitcore();
      }
    }
  },
  computed: {
    ...mapState("ad", ["ader_id", "ader_name"]),
    ...mapState("cm", ["mediaList"]),
    ...mapState("advertiser", ["brand_forms"]),
    pointRequireShow() {
      if (this.positionInfo && this.positionInfo.length) {
        return true;
      }
      return false;
    }
  },
  created() {
    //debugger
    this.fetch_brand_form(this.ader_id);
    this.fetch_media(this.ader_id);
    this.fetch_get();
    this.isTemplate = this.url == "/creative/view_temple";
  },
  methods: {
    ...mapActions("advertiser", ["fetch_brand_form"]),
    ...mapActions("cm", [
      "fetch_getProjects",
      "fetch_activities",
      "fetch_media"
    ]),
    PointRequireEx(val) {
      this.pointRequireEx = val;
    },
    
    fetch_get() {
      fetch.post(this.url, this.creativeParam).then(
        res => {
          if (res.ret == 0 && res.data) {
            this.loading = false;
            this.setForm(res.data);
            this.getPositionInfo(res.data.pos_id);
            this.bf_pointRequire_url = res.data.material;

            if(res.data.review){
              this.setBf_pointRequire_url_status(res.data.review);
            }
            this.bf_sohuPutType = this.setBFsohuPutType(res.data.media_info);
          } else {
            this.loading = false;
            this.$message.error("获取创意信息失败");
            console.error("res.ret", res.ret);
          }
        },
        err => {
          this.loading = false;
          console.error(err);
          this.$message.error("获取创意信息失败");
        }
      );
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
    validateResult_sohu(result) {
      this.validateResultSohu = result;
    },
    validateResult_point(result) {
      this.validateResultPoint = result;
    },
    onSubmit() {
      let validate = true;
      this.triggerSubmit = new Date() - 0; //触发子组件的submit
      // this.validateResultSohu = '';
      this.validateResultPoint = "";

      this.$refs["form"].validate(valid => ({}));
    },
    submitcore() {
      if (this.form.media_id == 1 && this.putType == "") {
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.isCopy) {
            this.fetch_copy();
          } else {
            this.fetch_edit();
          }
        }
      });
    },
    onCancel() {
      this.$emit("onCancel");
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
        // let tem = JSON.parse(objStr);
        // if (!tem) {
        //   return [];
        // }
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
    setForm(data) {
      if (this.isCopy) {
        data.name = "";
      }
      this.form = data;
    },

    
    setBf_pointRequire_url_status(review){
        this.bf_pointRequire_url = this.bf_pointRequire_url.map((point)=>{
          let status='';
          for(let r of review){
            if(r.pos_id==point.pos_id){
              status = r.status;
            }else{
              continue;
            }
          };
          return {...point,status}
        });
    },
    
    getFileUrl() {
      let c = {};
      for (let i in this.pointRequireEx) {
        c[i] = this.pointRequireEx[i][0]["_url"];
      }
      return c;
    },
    getSize() {
      let result = [];
      for (let point of this.positionInfo) {
        let arr = point.infos;
        for (let i of arr) {
          if (i.type == 1) {
            let sections = i.sections;
            let w = sections[0].width;
            let h = sections[0].height;
            result.push(w[1] + "x" + h[1]);
          }
        }
      }
      return result.join();
    },
    fetch_copy() {
      let data = {
        advertiser_id: this.ader_id - 0, //int  广告主ID 是
        media_id: this.form.media_id - 0, //int  媒体ID  是
        brand_id: this.form.brand_id - 0, //int  品牌ID  是
        product_line_id: this.form.product_line_id - 0, //int 产品线ID 是
        product_id: this.form.product_id - 0, //int  项目ID  是  to do
        activity_id: this.form.activity_id - 0, //int 活动ID  是
        versions: this.form.versions + "", //string 素材版本  是
        buy_way: this.form.buy_way - 0, //int 购买方式 1配送 2补量 3赠送  是
        name: this.form.name, //string 创意名称  是
        pos_id: this.form.pos_id - 0, //int  点位ID  是

        dest_url: this.form.url, //string 落地页 是
        // utmcode: this.utmcode, //string  检测代码  是
        impression_tracking_url: this.form.pv_monitor, //string  曝光检测代码  是
        clicking_tracking_url: this.form.click_monitor, //string  点击检测代码  是

        refs: this.pointRequireShow?this.getSize():'',    //bug 10551 
        material: this.pointRequireEx,     //媒体广告位相关数据
        position_info: this.pointRequire //string  媒体广告位相关数据 是  to do
      };
      //媒体是搜狐
      if (this.form.media_id == 1 || this.form.media_id == 2) {
        let type_tree = this.putType;
        let type = type_tree[type_tree.length - 1];
        data.media_info = { type, type_tree }; //string 媒体要求的素材附加信息 是  to do
      }

      fetch.post("/creative/create", data).then(res => {
          if (res.ret == 0) {
            this.$emit("onSubmit");
          } else {
            this.$alert(res.msg, '复制创意失败', {
              confirmButtonText: '确定',
              type: 'error'
            });
          }
        })
        .catch(err => {
          this.$alert('复制创意失败', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          });
          console.log(err);
        });
    },
    fetch_edit() {
      let data = {
        id: this.form.id, //  int 创意ID    是
        material: this.pointRequireEx, //   媒体广告位相关数据    是
        versions: this.form.versions, //    string  素材版本    是
        buy_way: this.form.buy_way, // int 购买方式 1配送 2补量 3赠送    是
        position_info: this.pointRequire, //   string  媒体广告位相关数据   是
        dest_url: this.form.url, //    string  落地页 是
        impression_tracking_url: this.form.pv_monitor, // string  曝光检测代码  是
        clicking_tracking_url: this.form.click_monitor, //   string  点击检测代码  是
        refs: this.pointRequireShow?this.getSize():'',
      };

      // this.creativeParam
      //媒体是搜狐
      if (this.form.media_id == 1 || this.form.media_id == 2) {
        let type_tree = this.putType;
        let type = type_tree[type_tree.length - 1];
        data.media_info = { type, type_tree }; //string 媒体要求的素材附加信息 是  to do
      }
      let url = !this.isTemplate
        ? "/creative/update"
        : "/creative/update_temple";
      /*console.log(JSON.stringify(_.extend(data,this.creativeParam)))*/
      fetch
        .post(url, _.extend(data, this.creativeParam))
        .then(res => {
          if (res.ret == 0) {
            this.$emit("onSubmit");
          } else {
            this.$alert(res.msg, '编辑创意失败', {
              confirmButtonText: '确定',
              type: 'error'
            });
          }
        })
        .catch(err => {
          this.$alert('编辑创意失败', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          });
          console.log(err);
        });
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
            this.positionInfo = [];
            this.$message.error("媒体点位信息返回值为空");
            console.error(res.msg || "媒体点位信息返回值为空");
          }
        })
        .catch(err => {
          this.$message.error(err);
          this.positionInfo = [];
          // reject(err);
          console.log(err);
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
