<template>
    <el-form class="point-detail">
        <template v-for='(point,index) in pointData'>
            <div :key="point.pos_id" class="pbs-pos">
                <el-form-item :label="'PBS点位'+(index+1)+'：'" class="require-label">
                    <span style="font-size:12px;">{{point.pos_name}}</span>
                </el-form-item>
                <template v-for='(item) in point.infos'>
                    <el-form-item 
                        :label="item.name+'：'" 
                        label-width="150px" 
                        :prop="point.pos_id+'_'+item.key" 
                        :key="point.pos_id+'_'+item.key" 
                        class="pos-require-content">

                        <!-- type=1 文件上传类型 start -->
                        <template v-if='item.type==1' class='form-image'>
                            <!-- 图片类型 -->
                            <template v-if='isImg(point.pos_id, item.key)'>
                                <li style="max-height: 70px;">
                                    <img :src="getUrl(point.pos_id, item.key)" style="max-height: 70px;">
                                </li>
                                <div class="media-body">
                                    <el-button type="text" @click="$previewImage(getUrl(point.pos_id, item.key))">查看大图</el-button>
                                </div>
                            </template>

                            <!-- 非图片类型 -->
                            <template v-else>
                                <a href="#" @click='downloadFile(getUrl(point.pos_id, item.key))'>{{getName(point.pos_id, item.key)}}</a>
                            </template>
                        </template>
                        <!-- type=1 文件上传类型 end -->

                        <!-- type=2 text类型 ||type=3 textarea类型  start -->
                        <span class='form-text' v-if='item.type==2||item.type==3'>{{getValue(point.pos_id, item.key)}}</span>
                        <!-- type=2 text类型 end -->

                        <!-- type=4 radio类型. start -->
                        <span class='form-text' v-if='item.type==4'>{{getRadioValue(point.pos_id, item.key, item.sections)}}</span>
                        <!-- type=4 radio类型. end -->

                        <!-- type=5 checkbox类型. start -->
                        <span class='form-text' v-if='item.type==5'>{{getCheckboxValue(point.pos_id, item.key, item.sections)}}</span>   <!--checkBoxJoin(item.key,item.sections)-->
                        <!-- type=5 radio类型. end -->
                    </el-form-item>
                </template>
            </div>
        </template>
    </el-form>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
const imgType = ["JPG", "JPEG", "GIF", "PNG", "BMP"]; //stringObject.toUpperCase()
export default {
  name: "PointRequireDetail",
  props: {
    backfillUrl: {
      type: Array
    },
    // backfillVal: {
    //   type: Object
    // },
    pointData: {
      type: Array,
      required: true
    }
  },
  components: {},

  data() {
    return {
      fileList: {}
    };
  },
  watch: {},
  computed: {
    ...mapState({
      ader_id: state => state.ad.ader_id
    })
  },
  created() {},
  methods: {
    downloadFile(url) {
      this.$downloadFile(url);
    },
    /*fileName(key) {
      let url = this.backfillUrl[key];
      if (url) {
        let name = url.substr(url.lastIndexOf("/") + 1);
        return name.toLowerCase();
      } else {
        // this.$message.error('服务端返回的素材文件url为空，请稍后重试');
      }
    },*/
    getItem(pos_id, key){
      for(let point of this.backfillUrl){
        if(point.pos_id==pos_id){
          for(let item of point.pos){
            let keys = Object.keys(item);
            for(let ikey of keys){
              if(key==ikey){
                return item;
              }
            }
          }
        }
      }
    },
    getUrl(pos_id, key){
      let item = this.getItem(pos_id, key);
      console.log(item.url[0].url);
      return item.url[0].url;
    },
    getName(pos_id, key){
      let item = this.getItem(pos_id, key);
      return item.url[0].name;
    },

    getValue(pos_id, key){
      let item = this.getItem(pos_id, key);
      return item[key];
    },
    getRadioValue(pos_id, key,sections){
      let item = this.getItem(pos_id, key);
      let value = item[key];
      debugger
      return sections[value];
    },
    getCheckboxValue(pos_id, key,sections){
      let item = this.getItem(pos_id, key);
      let value = item[key];
      return value.join("/");
    },
    isImg(pos_id, key) {
      let url = this.getUrl(pos_id, key);
      let fileType = this.getSuffixName(url).toUpperCase();
      return imgType.indexOf(fileType) != -1;
    },

    /*checkBoxJoin(key, sections) {
      let rs = [];
      for (let i of this.backfillVal[key]) {
        rs.push(sections[i]);
      }
      return rs.join(" / ");
    },*/
    /*show_pic(url) {
      return this.$host + url;
    },*/
    getSuffixName(str) {
      str = str + "";
      let index = str.lastIndexOf(".") + 1;
      return str.substring(index, str.length);
    }
  }
};
</script>
<style scoped>
.pic-list {
  display: inline-block;
  margin: 0;
  padding: 0;
  list-style: none;
}
.pic-list li {
  display: inline-block;
  margin-right: 5px;
  text-align: center;
}
.pic-list li img {
  max-width: 100px;
  max-height: 76px;
  display: block;
}
.pic-list li p {
  text-align: center;
  margin: 0;
}
.form-text {
  color: #5a5e66;
  font-size:12px;
}

.pbs-pos {
  margin-bottom: 10px;
  /* border-top: 1px solid #d2d2d2; */
}
.require-label{
  margin-bottom:0;
  margin-left: 15px;
}

.pos-require-content{
  margin-bottom: 0
}

.point-detail{
    max-height: 320px;
    overflow: auto;
    border: 1px solid #dcdfe6;
}
</style>

<style>
.require-label > label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>
