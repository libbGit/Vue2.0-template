<template>
  <div v-loading="loading">
    <el-form class="form-container" size="mini" ref="form" :model="form" label-width="140px">
      <div class="hy-card">
        <div class="hy-card__content">
          <div class="table-wrap">
            <div class="title">创意组：{{form.name}}
            </div>
            <div class="detail">
              <ul>
                <li> HY代码：{{form.hy_code||'--'}}</li>
                <li :title="form.advertiser_name"> 广告主：{{form.advertiser_name}}</li>
                <li :title="form.brand_name"> 品牌：{{form.brand_name}}</li>
                <li :title="form.product_line"> 产品线：{{form.product_line ?form.product_line :'--'}}</li>
                <li :title="form.project_name"> 项目：{{form.project_name}}</li>
                <li :title="form.activity"> 活动：{{form.activity}}</li>
                <li :title="form.plan"> 计划：{{form.plan_name?form.plan_name:form.plan?form.plan:"--"}}</li>
                <!-- <li :title="form.media_name"> 媒体：{{form.media_name}}</li>
                <li :title="form.position_name"> 点位：{{form.position_name}}</li> -->
                <li> 创意模式：{{creativeMode(form.pattern)}}</li>
                <li :title="form.creatives_name"> 创意名称：{{form.creatives_name}}</li>

              </ul>
              <div v-if='form.pattern==3'>
                <ul style=" padding: 10px ; margin-top: 10px;background: #f5f5f5;border-radius: 3px; width:100%" v-for='i in setProport(form)'>
                  <li style="width: 100%"> {{i.name}}：{{i.priority}}</li>
                </ul>
              </div>
              <ul v-if='form.pattern==2' style=" padding: 10px ; margin-top: 10px;background: #f5f5f5;border-radius: 3px; width:100%">
                <li style="width: 100%"> 顺序：{{form.creatives_name}}</li>
                <li style="width: 100%"> 轮播执行次数：{{exeCount(form.pattern_value)}}</li>
                <li style="width: 100%" v-if='form.pattern_value&&form.pattern_value.type!=2'> 定帧创意：{{setFrame(form)}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <h2>创意详情</h2>
    <div class='select-wrap' v-if="creativeList.length > 1">
      请选择创意:
      <el-select v-model="cid" size='mini' placeholder="请选择创意">
        <el-option v-for="item in creativeList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <form-detail :creativeParam='info' v-if='cid'></form-detail>
  </div>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";

import FormDetail from "@/views/cm/creativelib/create/form-detail";

export default {
  name: "CreativeGroupDetailCore",
  components: {
    FormDetail
  },
  props: {
    id: {
      type: [Number],
      required: true,
    },
    plan_id: {
      type: [String],
      required: true,
    },
  },
  data() {
    return {
      info: {
        url: "/creative/view",
        param: {}
      },
      form: {},
      ad_id: "",
      loading: true,
      creativeList: [],
      cid: ""
    };
  },
  watch: {
    cid(val) {
      if (val) {
        this.info.param = {
          plan_id:this.plan_id,
          // ad_id: this.ad_id,
          creative_id: val,
          creative_group_id: this.id
        };
      }
    }
  },
  computed: {
    ...mapState("ad", ["ader_name", "ader_id"])
  },
  created() {
    this.fetch_creative_group();
  },
  methods: {
    setProport(obj) {
      let rs = [];
      let idArr = obj.pattern_value.creative_id;
      let priorityArr = obj.pattern_value.priority;
      let nameArr = obj.creatives_name.split(",");
      for (let i = 0; i < idArr.length; i++) {
        let index = obj.creatives_id.split(",").indexOf(idArr[i]);
        let name = nameArr[index];
        let priority = priorityArr[i] + "%";
        rs.push({
          name,
          priority
        });
      }
      return rs;
    },
    setFrame(obj) {
      let idArr = obj.creatives_id.split(",");
      let nameArr = obj.creatives_name.split(",");
      let id = obj.pattern_value.frame;
      let index = idArr.indexOf(id);
      return nameArr[index];
    },
    exeCount(obj) {
      if (obj) {
        // type为1的时候，轮播执行次数为1次，值为2【无限次】，3为自定义次数
        let count = obj.type;
        if (count == 2) {
          count = "无数次";
        } else if (count == 3) {
          count = obj.num;
        }
        return count;
      } else {
        this.$message.error("服务端数据错误，pattern_value为空");
        console.error("服务端数据错误，pattern_value为空");
      }
      // return count;
    },
    setCreativeList(idStr, nameStr) {
      let idArr = idStr.split(",");
      let nameArr = nameStr.split(",");
      let rs = [];
      for (var i = 0; i < idArr.length; i++) {
        if (i == 0) {
          this.cid = idArr[i];
        }
        rs.push({
          id: idArr[i],
          name: nameArr[i]
        });
      }
      this.creativeList = rs;
    },
    //1，随机投放 2，顺序轮播 3，权重投放 4，创意优选
    creativeMode(pattern) {
      var pattern = pattern - 0;
      let str = "";
      switch (pattern) {
        case 1:
          str = "随机投放";
          break;
        case 2:
          str = "顺序轮播";
          break;
        case 3:
          str = "权重投放";
          break;
        default:
          str = "未知";
      }
      return str;
    },
    fetch_creative_group() {
      let id = this.id;
      let plan_id = this.plan_id;
      fetch
        .post("/creative_group/details", {
          id,
          plan_id
        })
        .then(res => {
          this.loading = false;
          if (res.ret == 0 && res.data) {
            if (_.isPlainObject(res.data)) {
              this.form = res.data;
              this.ad_id = res.data.ad_id;

              this.setCreativeList(
                res.data.creatives_id,
                res.data.creatives_name
              );
            }else{
              this.$message.error("服务端数据错误，res.data应该为对象");
            }
            
          } else {
            this.$message.error("获取创意组详情失败，请稍后重试");
            console.error(res.msg || "获取创意组详情失败，请稍后重试");
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("获取创意组详情失败，请稍后重试");
          console.error(err || "获取创意组详情失败，请稍后重试");
        });
    },

  }
};
</script>
<style scoped>
.select-wrap {
  padding-left: 10px;
}

.priority {
  color: red;
  padding-left: 3px;
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
