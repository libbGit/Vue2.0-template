<template>

    <div class="form-wrap clearfix ">
        <h2>新建创意</h2>
        <el-form class="form-container"
            size="mini"
            ref="form"
            :model="$data"
            :rules="rules"
            label-width="140px"
            v-loading="isLoading">
            <div class="form_left">
                <el-form-item label="广告主："
                    prop="aderName">
                    {{ader_name}}
                </el-form-item>

                <el-form-item label="创意名称："
                    prop="creativeName">
                    <el-input v-model="creativeName"
                        placeholder="请输入创意名称"
                        clearable></el-input>
                </el-form-item>

                <el-form-item prop="brand"
                    label="品牌：">
                    <el-select v-model="brand"
                        placeholder="请选择"
                        clearable>
                        <el-option v-for="item in brand_forms"
                            :key="item.brand_id"
                            :label="item.brand"
                            :value="item.brand_id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="project"
                    label="项目：">
                    <el-select v-model="project"
                        placeholder="请选择"
                        clearable>
                        <el-option v-for="item in projectList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item temprop="productLine"
                    label="产品线：">
                    <el-select v-model="productLine"
                        placeholder="请选择"
                        clearable>
                        <el-option v-for="item in productListEx"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="活动：">
                    <el-select v-model="activity"
                        placeholder="请选择"
                        clearable>
                        <el-option v-for="item in activityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="media"
                    label="媒体：">
                    <el-select v-model="media"
                        placeholder="请选择"
                        clearable>
                        <el-option v-for="item in mediaList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="point"
                    label="点位：">
                    <el-select v-model="point"
                        placeholder="请选择"
                        clearable>
                        <el-option v-for="item in pointList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="素材版本："
                    prop="materialVer">
                    <el-input v-model="materialVer"
                        placeholder="请输入素材版本"
                        style="width: 182px"
                        clearable></el-input>
                </el-form-item>
            </div>

            <div v-if="point"
                class="form_right">
                <el-collapse-transition mode="out-in">
                    <point-require ref="pointRequire"
                        v-if='pointRequireShow'
                        :pointData="positionInfo"
                        :triggerSubmit='triggerSubmit'
                        @pointRequireEx='PointRequireEx'
                        @pointRequiretData='getPointRequire'
                        @validateResult-point='validateResult_point'>
                    </point-require>
                </el-collapse-transition>
                <sohu v-if="media==1||media==2"
                    :triggerSubmit='triggerSubmit'
                    :mediaType='media'
                    @adPutData='getPutType'
                    @validateResult-sohu='validateResult_sohu'>
                </sohu>
                <!-- <el-form-item prop="purchaseForm" label="购买形式：">
                  <el-select v-model="purchaseForm" placeholder="请选择" disabled>
                    <el-option
                      v-for="item in purchaseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item> -->

                <!-- <el-form-item  label="监测代码：" style='width:490px;'>
                  <el-input v-model="utmcode" placeholder="请输入监测代码"></el-input>
                </el-form-item> -->
                <el-form-item label="曝光监测代码："
                    prop="exposureMonitorCode">
                    <el-input v-model.trim="exposureMonitorCode"
                        placeholder="请输入曝光监测代码"></el-input>
                </el-form-item>

                <el-form-item label="点击监测代码："
                    prop="clickMonitorCode">
                    <el-input v-model.trim="clickMonitorCode"
                        placeholder="请输入点击监测代码"></el-input>
                </el-form-item>

                <el-form-item label="落地页url："
                    prop="landPageURL">
                    <el-input v-model.trim="landPageURL"
                        placeholder="请输入落地页url"></el-input>
                </el-form-item>
            </div>
            <div v-else
                style="vertical-align: top; padding-top: 100px; text-align: center;color: #999">
                请先选择媒体和点位
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
    </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import CreativeNav from "@/views/cm/public/creative-nav";
import PointRequire from "./pointRequire";
import sohu from "./sohu";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
var creativeNameReg = /^[a-zA-Z0-9\u4E00-\u9FA5_\(\)（）]{1,30}$/;
export default {
  name: "CreativelibCreate",
  components: {
    CreativeNav,
    PointRequire,
    sohu
  },
  data() {
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
      isLoading: false,
      pointRequireEx: {},
      sohuPutType: [], //搜狐的广告投放类型，是arr，主要是编辑时回填使用
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
      media: "",
      point: "",
      materialVer: "",
      purchaseForm: "1",
      pointRequire: "", //专门用来点位要求。PointRequire组件会上推上来
      utmcode: "",
      exposureMonitorCode: "",
      clickMonitorCode: "",
      landPageURL: "",
      purchaseList: [
        { name: "购买", id: "1" },
        { name: "补量", id: "2" },
        { name: "赠送", id: "3" }
      ],
      /*----------------------------*/
      rules: {
        creativeName: [{ validator: nameValidator, trigger: "blur" }],
        aderName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ],
        brand: [{ required: true, message: "请选择品牌", trigger: "change" }],
        productLine: [
          { required: true, message: "请选择产品线", trigger: "change" }
        ],
        project: [{ required: true, message: "请选择项目" }],
        // activity: [{ message: "预算分配表不能为空" }],
        media: [{ required: true, message: "请选择媒体" }],
        point: [{ required: true, message: "请选择点位" }],
        materialVer: [{ required: true, message: "请输入素材版本" }],
        purchaseForm: [
          { required: true, message: "请选择购买形式", trigger: "change" }
        ],
        exposureMonitorCode: [
          {
            validator: urlvalidator,
            message: "请输入合法的曝光监测代码",
            trigger: "blur"
          }
        ],
        clickMonitorCode: [
          {
            validator: urlvalidator,
            message: "请输入合法的点击监测代码",
            trigger: "blur"
          }
        ],
        landPageURL: [
          {
            validator: urlvalidator,
            message: "请输入合法的落地页url",
            trigger: "blur"
          }
        ]
        // pointRequire: [{ required: true, message: "预算分配表不能为空" }],
        // exposureMonitorCode: [{ required: true, message: "预算分配表不能为空" }],
        // clickMonitorCode: [{ required: true, message: "预算分配表不能为空" }],
        // landPageURL: [{ required: true, message: "预算分配表不能为空" }],
      },

      projectList: [],
      projectsCache: {}, //项目缓存

      activityList: [],
      activityCache: {}, //活动缓存

      // positionInfo:{},
      positionInfo: [],
      positionCache: {}, //媒体点位信息缓存

      mediaInfoData: [],
      mediaInfoCache: {}, //媒体素材附加信息缓存

      mediaData: [],
      mediaCache: {} //媒体缓存
    };
  },
  watch: {
    brand(nVal, oVal) {
      if (nVal != "") {
        this.updateProject(nVal);
      }
    },
    project(nVal, oVal) {
      if (nVal != "") {
        this.productLine = "";
        this.activity = "";
        this.updateActivity(nVal);
      }
    },
    productLine(nVal, oVal) {
      if (nVal != "") {
        this.activity = "";
        this.updateActivity2(this.project, nVal);
      }
    },
    point(nVal, oVal) {
      this.positionInfo = [];
      this.$nextTick(() => {
        if (nVal != "") {
          this.updatePointInfo(nVal);
        }
      });
      /*if (nVal != "") {
        this.updatePointInfo(nVal);
      } else {
        this.positionInfo = "";
      }*/
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
    },
    productListEx() {
      var result = [];
      if (this.brand) {
        this.productLine = "";
        var brand = this.brand_forms.filter(item => {
          return item.brand_id == this.brand;
        });

        if (brand && brand.length > 0) {
          result = brand[0].products;
        }
      }
      return result;
    },
    pointList() {
      var result = [];
      if (this.media) {
        this.point = "";
        var point = this.mediaList.filter(item => {
          return item.id == this.media;
        });

        if (point && point.length > 0) {
          result = point[0].pos;
        }
      }
      return result;
    }
  },
  created() {
    //debugger
    // this.fetch_brand_form(this.ader_id);
    // this.fetch_media(this.ader_id);
    this.loading = true;
    Promise.all([
      this.fetch_brand_form(this.ader_id),
      this.fetch_media(this.ader_id)
    ])
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        console.log(err);
      });
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
      this.validateResultPoint = false;

      if (!this.pointRequireShow) {
        //如果点位为空，则不校验点位
        this.$nextTick(() => {
          this.validateResultPoint = true;
        });
      }

      this.$refs["form"].validate(valid => ({}));
    },
    submitcore() {
      if ((this.media == 1 || this.media == 2) && !this.putType.length) {
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.fetch_create();
        }
      });
    },
    onCancel() {
      this.$router.push({
        path: "/cm/creativelib/manage"
      });
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
    /*getFileUrl() {
      let urls = {};
      // if(this.pointRequireEx.length!=0){
        for (let i in this.pointRequireEx) {
          let item = this.pointRequireEx[i];
          if(item.length!=0){
            urls[i] = item[0]["_url"];
          }
          // c[i] = this.pointRequireEx[i][0]["_url"];
        }
      // }
      return urls;
    },*/
    fetch_create() {
      let data = {
        advertiser_id: this.ader_id - 0, //int  广告主ID 是
        media_id: this.media - 0, //int  媒体ID  是
        brand_id: this.brand - 0, //int  品牌ID  是
        product_line_id: this.productLine - 0, //int 产品线ID 是
        product_id: this.project - 0, //int  项目ID  是  to do
        activity_id: this.activity - 0, //int 活动ID  是
        versions: this.materialVer + "", //string 素材版本  是
        buy_way: this.purchaseForm - 0, //int 购买方式 1配送 2补量 3赠送  是
        name: this.creativeName, //string 创意名称  是
        pos_id: this.point - 0, //int  点位ID  是
        // material: this.getFileUrl(),
        material: this.pointRequireEx,    //保存的编辑和详情页面的数据
        position_info: this.pointRequire, //string  媒体广告位相关数据 是  to do
        dest_url: this.landPageURL, //string 落地页 是
        // utmcode: this.utmcode, //string  检测代码  是
        impression_tracking_url: this.exposureMonitorCode, //string  曝光检测代码  是
        clicking_tracking_url: this.clickMonitorCode, //string  点击检测代码  是
        refs: this.pointRequireShow ? this.getSize() : ""    //bug 10551 
      };

      //媒体是搜狐 或 爱奇艺
      if (this.media == 1 || this.media == 2) {
        let type_tree = this.putType;
        let type = type_tree[type_tree.length - 1];
        data.media_info = { type, type_tree }; //string 媒体要求的素材附加信息 是  to do
      }
      // console.log("data-", JSON.stringify(data));
      this.loading = true;
      fetch
        .post("/creative/create", data)
        .then(res => {
          this.loading = false;
          if (res.ret == 0) {
            this.$router.push({
              path: "/cm/creativelib/manage"
            });
          } else {
            this.$alert(res.msg, '新建创意失败', {
              confirmButtonText: '确定',
              type: 'error'
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$alert("新建创意失败", '提示', {
            confirmButtonText: '确定',
            type: 'error'
          });
          console.log(err);
        });
    },
    updateProject(brand_id) {
      if (this.projectsCache[brand_id]) {
        this.projectList = this.projectsCache[brand_id];
      } else {
        this.fetch_getProjects({ brand_id }).then(data => {
          this.projectsCache[brand_id] = data;
          this.projectList = data;
        });
      }
    },
    /*updateProject2(brand_id, product_line) {
      if (this.projectsCache[brand_id + "" + product_line]) {
        this.projectList = this.projectsCache[brand_id + "" + product_line];
      } else {
        let obj = { brand_id, product_line };
        this.fetch_getProjects(obj).then(data => {
          this.projectsCache[brand_id + "" + product_line] = data;
          this.projectList = data;
        });
      }
    },*/
    updateActivity(project_id) {
      if (this.activityCache.project_id) {
        this.activityList = this.activityCache[project_id];
      } else {
        this.fetch_activities({ project_id }).then(data => {
          this.activityCache[project_id] = data;
          this.activityList = data;
        });
      }
    },
    updateActivity2(project_id, product_line) {
      if (this.activityCache[project_id + "" + product_line]) {
        this.activityList = this.activityCache[project_id + "" + product_line];
      } else {
        let obj = { project_id, product_line };
        this.fetch_activities(obj).then(data => {
          this.activityCache[project_id + "" + product_line] = data;
          this.activityList = data;
        });
      }
    },
    updatePointInfo(pos_id) {
      if (this.positionCache[pos_id]) {
        this.positionInfo = this.positionCache[pos_id];
      } else {
        this.getPositionInfo(pos_id);
      }
    },
    //获取媒体点位信息
    getPositionInfo(pos_id) {
      this.loading = true;
      fetch
        .post("/creative/media_positions", { pos_id: pos_id })
        .then(res => {
          this.loading = false;

          if (res.ret == 0 && res.data) {
            let positions = res.data;

            this.positionInfo = positions;
            this.positionCache[pos_id] = positions;
            // resolve();
          } else {
            // reject(new Error(res.msg));
            this.positionInfo = [];
            this.$message.error("媒体点位信息返回值为空");
            console.error(res.msg || "媒体点位信息返回值为空");
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("媒体点位信息获取失败");
          this.positionInfo = [];
          // reject(err);
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>

</style>
