<template>
    <el-form size="mini"
        ref="form"
        :model="form"
        :rules="rules"
        :class="{'point-array':true}">

        <template v-for='(point,index) in pointData'>
            <div :key="point.pos_id"
                class="pbs-pos">
                <el-form-item :label="'PBS点位'+(index+1)+'：'"
                    class="require-label"
                    label-width="100px">
                    <span style="font-size:12px;">{{point.pos_name}}</span>
                </el-form-item>
                <template v-for='(item) in point.infos'>
                    <el-form-item :label="item.name+'：'"
                        label-width="150px"
                        :prop="point.pos_id+'_'+item.key"
                        :key="point.pos_id+'_'+item.key">

                        <!-- type=1 文件上传类型 start -->
                        <template v-if='item.type==1'>
                            <el-upload class="upload-demo"
                                :disabled="form[point.pos_id +'_status']=='3'"
                                :limit="1"
                                action="/api/creative/upload"
                                :show-file-list="true"
                                :list-type="listType(item)"
                                :file-list="fileList[point.pos_id+'_'+item.key]"
                                :data='uploadParam(item.sections)'
                                :on-remove="removeFlieFn(point.pos_id+'_'+item.key)"
                                :before-upload="beforeUploadFn(item)"
                                :on-success="uploadSuccessFn(point.pos_id+'_'+item.key)"
                                :on-change="uploadChangeFn(point.pos_id+'_'+item.key)"
                                :on-progress="uploadProgressFn(point.pos_id+'_'+item.key)"
                                :on-error="uploadErrorFn(point.pos_id+'_'+item.key)">
                                <el-button>
                                    <i class="el-icon-plus"></i>上传文件
                                </el-button>
                                <div slot="tip"
                                    class="el-upload__tip">{{createTip(item)}}</div>
                            </el-upload>

                            <!-- <div class="media" v-if="fileURL[item.key]">
                              <div class="media-left">
                                <img :src="fileURL[item.key]">
                              </div>
                              <div class="media-body">
                                <el-button type="text" @click="handle_upload_remove(item.key)">删除</el-button><br>
                                <el-button type="text" @click="$previewImage(show_pic(fileURL[item.key]))">查看大图</el-button>
                              </div>
                            </div> -->
                        </template>
                        <!-- type=1 文件上传类型 end -->

                        <!-- type=2 text类型 start -->
                        <template v-if='item.type==2'>
                            <el-input v-model="form[point.pos_id+'_'+item.key]"
                                size="mini"
                                :placeholder="'请输入'+item.name"
                                style="width: 90%;">
                            </el-input>
                        </template>
                        <!-- type=2 text类型 end -->

                        <!-- type=3 textarea类型 start -->
                        <el-input v-if='item.type==3'
                            type="textarea"
                            autosize
                            size="mini"
                            :placeholder="'请输入'+item.name"
                            v-model="form[point.pos_id+'_'+item.key]"
                            style="width: 90%;">
                        </el-input>
                        <!-- type=3 textarea类型 end -->

                        <!-- type=4 radio类型.里面是数组 start -->
                        <el-radio-group v-if='item.type==4'
                            v-model="form[point.pos_id+'_'+item.key]">
                            <el-radio v-for='(value, label) in item.sections'
                                :label="label"
                                :key="label">
                                {{value}}
                            </el-radio>
                        </el-radio-group>
                        <!-- type=4 radio类型.里面是数组 end -->

                        <!-- type=5 checkbox类型.里面是对象 start -->
                        <el-checkbox-group v-if='item.type==5'
                            v-model="form[point.pos_id+'_'+item.key]">
                            <el-checkbox v-for='value in item.sections'
                                :label="value"
                                :key="value">
                                {{value}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <!-- type=5 radio类型.里面是对象 end -->
                    </el-form-item>
                </template>
            </div>
        </template>
    </el-form>
</template>

<script>
import _ from "lodash";
import math from "mathjs";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";

math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});
const picType = ["jpg", "jpeg", "gif", "png", "bmp"];

export default {
  name: "PointRequire",
  props: {
    triggerSubmit: [String, Number],
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
      fileSize: {},
      form: {},
      rules: {},
      fileList: {},
      isSubmit: ""
    };
  },
  watch: {
    triggerSubmit: function (val, oldVal) {
      this.onSubmit();
    }
  },
  computed: {
    ...mapState({
      ader_id: state => state.ad.ader_id
    })
  },
  created() {
    this.setRule();
    //设置文件上传列表
    this.setFileList();

    //设置表单输入列表
    this.initEdit();
  },
  methods: {
    uploadParam(sections) {
      return {
        advertiser_id: this.ader_id,
        sections: JSON.stringify(sections)
      };
    },
    initEdit() {
      for (let point of this.pointData) {
        for (let item of point.infos) {
          if (this.backfillUrl && this.backfillUrl.length > 0) {
            //编辑时
            if (item.type != 1) {
              let obj = this.getItem(point.pos_id, item.key);
              this.$set(
                this.form,
                point.pos_id + "_" + item.key,
                obj[item.key]
              );

              //设置状态
              this.$set(this.form, point.pos_id +"_status", this.getPosStatus(point.pos_id).status);
            }
          } else {
            //新建时
            if (item.type == 2) {
              this.$set(this.form, point.pos_id + "_" + item.key, "");
            }
            if (item.type == 3) {
              this.$set(this.form, point.pos_id + "_" + item.key, "");
            }
            if (item.type == 4) {
              this.$set(this.form, point.pos_id + "_" + item.key, "");
            }
            if (item.type == 5) {
              this.$set(this.form, point.pos_id + "_" + item.key, []);
            }
          }
        }
      }
    },
    /*show_pic (url) {
        return this.$host + url;
    },
    handle_upload_remove(key){
      this.fileURL[key]='';
    },
    showUploading(obj) {
      return obj.upload;
    },*/
    createTip(item) {
      let type = item.type;
      let arr = item.sections;
      let fileTypeStr = this.fileTypeTip(arr);
      let durationStr = this.durationTip(arr);
      let ratioStr = this.ratioTip(arr);
      let sizeStr = this.sizeTip(type, arr); //duration
      let widthHeightStr = this.widthHeightTip(type, arr);
      let str = [fileTypeStr, sizeStr, widthHeightStr, durationStr,ratioStr];
      str = _.without(str, "");
      return str.join(",");
    },
    ratioTip(arr) {
      let str = "";
      let tem = [];
      for (let i of arr) {
        if (i.ratio) {
          tem.push(i.ratio);
        }
      }
      if (tem.length) {
        str = "素材比例为" + tem.join("或");
      }
      return str;
    },
    durationTip(arr) {
      let str = "";
      let tem = [];
      for (let i of arr) {
        if (i.duration) {
          tem.push(i.duration[0] + "-" + i.duration[1]);
        }
      }
      tem = _.uniq(tem);
      if (tem.length) {
        str = "文件时长为" + tem.join("或") + "秒";
      }
      return str;
    },
    widthHeightTip(type, arr) {
      let str = "";
      let tem = [];
      if (type == 1) {
        for (let i of arr) {
          let w = "";
          let h = "";
          if (i.width) {
            let tw = this.convertSymbol(i.width[0]);
            w = "宽度" + tw + i.width[1];
          }
          if (i.height) {
            let th = this.convertSymbol(i.height[0]);
            h = "长度" + th + i.height[1];
          }
          tem.push(w + h);
        }
        tem = _.uniq(tem);
        str = tem.join("或");
      }
      return str;
    },
    convertSymbol(symbol) {
      let rs = "";
      switch (symbol) {
        case ">":
          rs = "大于";
          break;
        case ">=":
          rs = "大于等于";
          break;
        case "=":
          rs = "等于";
          break;
        case "<":
          rs = "小于";
          break;
        case "<=":
          rs = "小于等于";
          break;
        default:
      }
      return rs;
    },
    /*widthHeightTip2(type, arr) {
      let wo = [];
      let w = [];
      let ho = [];
      let h = [];
      let hmax = "";
      let hmin = "";
      let wmax = "";
      let wmin = "";
      let str = "";
      if (type == 1) {
        for (let i of arr) {
          wo = wo.concat(i.width[0]);
          w = w.concat(i.width[1]);
          ho = ho.concat(i.height[0]);
          h = h.concat(i.height[1]);
        }
        // wo = _.uniq(wo)
        w = _.uniq(w);
        // ho = _.uniq(ho)
        h = _.uniq(h);

        w.sort((x, y) => x.y);
        h.sort((x, y) => x.y);
        wmax = w[w.length - 1];
        wmin = w[0];
        hmax = h[w.length - 1];
        hmin = h[0];
        str = "文件尺寸为宽度大于等于" + wmin + "，高度大于等于" + hmin;
      }
      return str;
    },*/
    sizeTip(type, arr) {
      let size = [];
      let sizeStr = "";
      let max = "";
      let min = "";
      for (let i of arr) {
        if (i.size !== undefined && i.size !== null && i.size !== "") {
          size = size.concat(i.size);
        }
      }

      size.sort((x, y) => x-y);  //bug #10628 将数组增序排列

      if (size.length) {
        max = size[size.length - 1];
        min = size[0];
        if (type == 1) {
          sizeStr = "文件大小为" + min + "-" + max + "KB之间";
        } else if (type == 2 || type == 3) {
          sizeStr = "文长度为" + min + "-" + max + "个字符之间";
        }
      }

      return sizeStr;
    },
    fileTypeTip(arr) {
      let fileType = [];
      let fileTypeStr = "";
      for (let i of arr) {
        fileType = fileType.concat(i.media_types);
      }
      fileType = _.uniq(fileType);
      fileTypeStr = fileType.length ?
        "只能上传" + fileType.join(",") + "文件" :
        "";
      return fileTypeStr;
    },
    /*getFileListObj(urlstr) {
      let name = urlstr.substr(urlstr.lastIndexOf("/") + 1);
      return { url: this.$host + urlstr, _url: urlstr, name };
    },*/
    setFileList() {
      //在编辑时使用
      for (let point of this.pointData) {
        for (let item of point.infos) {
          if (item.type == 1) {
            if (this.backfillUrl && this.backfillUrl.length > 0) {
              let obj = this.getItem(point.pos_id, item.key);
              let file = obj.url[0];
              this.$set(this.fileList, point.pos_id + "_" + item.key, [
                { ...file }
              ]);
              this.$set(
                this.form,
                point.pos_id + "_" + item.key,
                obj[item.key]
              );
              //设置状态
              this.$set(this.form, point.pos_id +"_status", this.getPosStatus(point.pos_id).status);
            } else {
              this.$set(this.fileList, point.pos_id + "_" + item.key, []);
            }
          }
        }
      }
    },
    //start
    getItem(pos_id, key) {
      for (let point of this.backfillUrl) {
        if (point.pos_id == pos_id) {
          for (let item of point.pos) {
            let keys = Object.keys(item);
            for (let ikey of keys) {
              if (key == ikey) {
                return item;
              }
            }
          }
        }
      }
    },

    
    getPosStatus(pos_id) {
      for (let point of this.backfillUrl) {
        if (point.pos_id == pos_id) {
          return point;
        }
      }
      return {status:''}
    },

    getUrl(pos_id, key) {
      let item = this.getItem(pos_id, key);
      return item.url[0].url;
    },
    getName(pos_id, key) {
      let item = this.getItem(pos_id, key);
      return item.url[0].name;
    },

    getValue(pos_id, key) {
      let item = this.getItem(pos_id, key);
      return item[key];
    },

    // changePosRadio(key) {
    //   console.log("111111111");
    // },
    // //end

    setRule() {
      for (let point of this.pointData) {
        for (let item of point.infos) {
          let required = false;
          let isUrl = false;
          //必输
          if (item.validate.indexOf("required") != -1) {
            required = true;
          }
          //url  bug#10572
          if (item.validate.indexOf("url") != -1) {
            isUrl = true;
          }

          let message = "";
          let trigger = "";
          let validator = this.getFlieValidator();
          if (item.type == 1) {
            message = "请上传文件";
          } else if (item.type == 2 || item.type == 3) {
            let getTextValidator = this.getTextValidator(item, required, isUrl);
            trigger = "blur";

            if(required){
              this.$set(this.rules, point.pos_id + "_" + item.key, [
                { required, validator: getTextValidator, trigger }
              ]);
            }else{
              this.$set(this.rules, point.pos_id + "_" + item.key, [
                { validator: getTextValidator, trigger }
              ]);
            }
            continue;
          } else if (item.type == 4 || item.type == 5) {
            message = "请选择" + item.name;
            trigger = "change";
          }

          if (required) {
            this.$set(this.rules, point.pos_id + "_" + item.key, [
              { required, message, trigger }
            ]);
          }
        }
      }
    },

    //校验输入文本的格式，如url
    validateIntAndUrl(str, isUrl) {
      if (isUrl) {
        let tem = this.$constReg.url.test(str);
        if (!tem) {
          return { msg: "请输入合法的url地址", validate: false }
        }
      }
      return { validate: true }
    },

    getTextValidator(obj, required, isUrl) {
      var self = this;
      return function (rule, value, callback) {
        let valTrim = _.trim(value);
        if (valTrim == "") {
          if (required) {
            callback(new Error("请输入" + obj.name));
          } else {
            callback();
          }
        } else {
          let result = self.validateIntAndUrl(valTrim, isUrl);
          if (result.validate) {
            let sections = obj.sections;
            if (sections != undefined) {
              let sizes = [];
              for (let i of sections) {
                if (Array.isArray(i.size)) {
                  sizes.push(i.size);
                }
              }
              let valLen = valTrim.length;
              //有size要求的
              if (sizes.length) {
                let flag = false;
                for (let j = 0; j < sizes.length; j++) {
                  let min = sizes[j][0];
                  let max = sizes[j][1];
                  if (min <= valLen && max >= valLen) {
                    flag = flag || true;
                    break;
                  }
                }
                if (flag) {
                  callback();
                } else {
                  let tip = self.getTextSizeTip(sizes);
                  callback(new Error(tip));
                }
              } else {//没有size要求的
                callback();
              }
            } else {
              callback();
            }
          } else {
            callback(new Error(result.msg));
          }
        };
      }
    },

    getTextSizeTip(arr) {
      let rs = [];
      for (let j = 0; j < arr.length; j++) {
        let min = arr[j][0];
        let max = arr[j][1];
        rs.push(min + "-" + max);
      }
      return "要求输入长度为" + rs.join("或") + "个字符长度的内容";
    },
    getFlieValidator() {
      return (rule, value, callback) => {
        if (!value) {
          callback(new Error("请上传文件"));
        } else {
          callback();
        }
      };
    },
    uploadErrorFn(key) {
      return res => {
        this.$refs["form"].validateField(key);
        this.$message.error("上传失败，请重新上传");
      };
    },
    //上传成功后
    uploadSuccessFn(key) {
      return res => {
        if (res.ret == 0) {
          this.fileSize[key] = res.data.file.width + "x" + res.data.file.height; //10573

          this.form[key] = res.data.pbs_material_id - 0; //转换为字符串，只为检验插件可以通过
          this.$refs["form"].validateField(key); //debugger
          let url = res.data.url;
          let name = res.data.name;
          let file = res.data.file;
          let obj = { url: this.$host + url, _url: url, name };

          this.$set(this.fileList[key], 0, obj);

          // this.fileList[key].push(obj)
          // this.fileList[key] = _.cloneDeep(this.fileList); //debugger
          // console.log("key---a",key,obj)
        } else {
          this.fileList[key] = [];
          this.$message.error(res.msg || "上传失败，请重新上传");
        }
      };
    },
    // getFileRule(key) {
    //   let item = this.pointData.infos.find((i, index) => i.key == key);
    //   if (item) {
    //     return item.sections;
    //   }
    // },
    uploadChangeFn() {
      return (file, fileList) => {
        // console.log('1--',file, fileList)
      };
    },
    uploadProgressFn() {
      return (event, file, fileList) => {
        // console.log('2--',event, file, fileList)
      };
    },
    removeFlieFn(key) {
      return res => {
        this.form[key] = ""; //转换为字符串，只为检验插件可以通过

        this.$set(this.form, key, "");
        this.$set(this.fileList, key, []);

        this.$refs["form"].validateField(key);
      };
    },
    listType(obj) {
      let isPic = true;
      for (let i of obj.sections) {
        let typeArr = i.media_types;
        for (let j of typeArr) {
          let type = j.toLowerCase();
          isPic = isPic && picType.indexOf(type) != -1;
        }
      }
      return isPic ? "picture" : "text";
    },
    //上传之前的检验 动态返回一个函数  因为模板是一个for
    beforeUploadFn(obj) {
      return file => {
        let suffixName = this.getSuffixName(file.name).toLowerCase();
        let fileType = [];
        for (let i of obj.sections) {
          fileType = fileType.concat(i.media_types);
        }
        if (fileType.indexOf(suffixName) == -1) {
          this.$message.error("文件格式错误，请重新选择文件!");
          return false;
        }
      };
    },
    getSuffixName(str) {
      let index = str.lastIndexOf(".") + 1;
      return str.substring(index, str.length);
    },
    /*submitUploadFn(key) {
      this.$refs[key].submit();
    },*/
    onSubmit() {
      this.$refs["form"].validate(valid => {
        // console.log("valid", true);
        this.$emit("validateResult-point", valid);

        let data = [];
        let fileData = [];
        for (let point of this.pointData) {
          let position = { pos_id: point.pos_id, pos: {} };
          let fileItem = { pos_id: point.pos_id, pos: [] };
          for (let item of point.infos) {
            let obj = {};
            obj[item.key] = this.form[point.pos_id + "_" + item.key];
            position.pos[item.key] = obj[item.key];
            fileItem.pos.push({
              ...obj,
              url: this.fileList[point.pos_id + "_" + item.key]
            });
          }
          data.push(position);
          fileData.push(fileItem);
        }
        this.$emit("pointRequiretData", data);
        this.$emit("pointRequireEx", fileData);
      });
    }
  }
};
</script>
<style scoped>
.pbs-pos {
  margin-bottom: 40px;
}

.point-array {
  max-height: 370px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  margin-left: 25px;
  margin-bottom: 20px;
}

.media {
  overflow: hidden;
  zoom: 1;
}
.media-left,
.media-body {
  display: table-cell;
  vertical-align: top;
}
.media-left {
  padding-right: 10px;
}
.media-left img {
  max-width: 100px;
  max-height: 100px;
}
.media-body {
  vertical-align: middle;
}

.upload-demo {
  margin-bottom: 5px;
}
.require-label {
  margin-bottom: 0;
}
</style>

<style>
.require-label > label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>
