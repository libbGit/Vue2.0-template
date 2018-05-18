<template>
  <el-dialog title="编辑创意组" top="-50px" class="popCyEdi" :visible="popcyVisible" @click="closeEditBox" append-to-body @close='closeEditBox'>
    <!--:visible.sync="popDiaCy"-->
    <div v-show="errstatus">
      <el-alert
        :title="errMsg"
        type="error"
        show-icon
        :closable="false"
      >
      </el-alert>
    </div>
    <el-form  size="mini" class="popCyEditbox">
      <div style="display: inline-block;width: 300px;vertical-align: top;">
        <el-form-item label="广告主：" :label-width="formLabelWidth">
          {{detailCyz.advertiser_name}}
        </el-form-item>
        <el-form-item label="品牌：" :label-width="formLabelWidth">
          {{detailCyz.brand_name}}
        </el-form-item>
        <el-form-item label="产品线：" :label-width="formLabelWidth">
          {{detailCyz.product_line || "无"}}
        </el-form-item>
        <el-form-item label="项目：" :label-width="formLabelWidth">
          {{detailCyz.project_name}}
        </el-form-item>
        <el-form-item label="活动：" :label-width="formLabelWidth">
          {{detailCyz.activity}}
        </el-form-item>
        <el-form-item label="推广计划：" :label-width="formLabelWidth">
          {{detailCyz.plan?detailCyz.plan:detailCyz.plan_name?detailCyz.plan_name:'无'}}
        </el-form-item>
        <!-- <el-form-item label="媒体：" :label-width="formLabelWidth">
          {{detailCyz.media_name}}
        </el-form-item>
        <el-form-item label="点位：" :label-width="formLabelWidth">
          {{detailCyz.position_name}}
        </el-form-item> -->

      </div>
      <div style="display: inline-block;width: 620px;vertical-align: top;border-left: 1px solid #eee;padding: 0 10px;height: 422px;overflow-y: auto">
        <el-form-item label="创意组名称：" :label-width="formLabelWidth">
          {{detailCyz.name}}
        </el-form-item>
        <el-form-item label="创意：" :label-width="formLabelWidth">
          {{detailCyz.creatives_name}}
        </el-form-item>
      <el-form-item label="创意模式：" :label-width="formLabelWidth">
        <el-radio v-model="cyType" label="1">随机投放</el-radio>
        <el-radio v-model="cyType" label="2">顺序轮播</el-radio>
        <el-radio v-model="cyType" label="3">权重投放</el-radio>
      </el-form-item>
      <div v-show="cyType==2">
        <el-form-item label="创意排序：" :label-width="formLabelWidth" >
          <div>
            <div style="padding: 10px; background: #f5f5f5;border-radius: 3px">
            <p v-for="(cyrank,index) in cylistRank">
              {{index}}--{{cyrank.name}} <el-button class="upbutton" icon="el-icon-arrow-up" @click="touponeStep(index,cyrank)" v-if="index!=0"></el-button>
            </p>
            </div>
            <div style="line-height: 40px">
              <span>轮播执行次数：</span>
              <el-radio v-model="cyNumType" label="1">1次</el-radio>
              <el-radio v-model="cyNumType" label="2">无限次</el-radio>
              <el-radio v-model="cyNumType" label="3">自定义</el-radio>
              <input v-show="cyNumType==3" v-model="cyNt3Num"  placeholder="请输入数字"></input>
            </div>
            <div v-show="cyNumType!=2">
              <span>定针创意：</span>
              <el-select v-model="cyDz" placeholder="请选择">
                <el-option
                  v-for="item in cyListInit"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
      </div>
        <el-form-item label="权重设置：" :label-width="formLabelWidth"  v-show="cyType==3">

        <div v-for="item in qzCyList" style="line-height: 40px">
        <div style="width: 70px; float: left">
          <el-input type="text" v-model="item.value">
            <template slot="append">%</template>
          </el-input>
        </div>
        <div  class="name" :title=" item.name">
          {{item.name}}
        </div>
        </div>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeEditBox" size="mini">取 消</el-button>
      <el-button type="primary" @click="saveCy()" size="mini" >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import fetch from '@/services/fetch'
    import _ from 'lodash'

    export default {
      name: "cy-edit",
      props:{
        popcyVisible:{
          type: Boolean,
          required:true
        },
        editCyModelId:{
          required: true
        },
        editCyPlanId:{
          required: true
        }
      },
      data(){
        return {
          detailCyz:{},
          cyListInit: [],   //selected创意列表
          cylistRank: [],   //rank 创意列表
          cyType:"",
          qzCyList:[],
          cyNumType: "",
          cyDz:"",
          cyNt3Num: "",
          formLabelWidth: '120px',

          errMsg:"",
          errstatus : false
        }
      },
      watch:{
        editCyModelId(){
          this.getInitData(this.editCyModelId,this.editCyPlanId);
        },
      },
      methods:{
        getInitData(id,pid){
          this.detailCyz = {};
          this.cyListInit=[];
          this.cylistRank = [];
          this.cyType = "";
          this.qzCyList = [];
          this.cyNumType = "";
          this.cyDz = "";
          this.cyNt3Num = "";

          fetch.post("/creative_group/details",{id:id,plan_id:pid}).then(res =>{
            if(res.ret===0 && res.data){
              this.detailCyz = res.data;
              let initList = [];
              var _id = res.data.creatives_id.split(",");
              var _name = res.data.creatives_name.split(",");
              _id.forEach((id,i)=>{
                var _obj = {};
                _obj.id = id;
                _obj.name = _name[i];
                initList.push(_obj);
              });
              this.cyType = res.data.pattern;
              this.cyListInit = _.cloneDeep(initList);

              if(res.data.pattern==1){
                this.cylistRank =  _.cloneDeep(initList);
                this.qzCyList = _.cloneDeep(initList);
              }
              else if(res.data.pattern==2){
                var _list = res.data.pattern_value.creative_id;
                _list.forEach((val)=>{
                  var _obj = {};
                  _obj.id = val;
                  _id.findIndex((v,ind)=>{
                    if(val==v){
                      _obj.name = _name[ind];
                    }
                  })
                  this.cylistRank.push(_obj);
                });
                this.cyNt3Num = res.data.pattern_value.num;
                this.cyNumType = String(res.data.pattern_value.type);
                this.cyDz = res.data.pattern_value.frame;

                this.qzCyList = _.cloneDeep(initList);
              }
              else if(res.data.pattern==3){
                this.cylistRank = _.cloneDeep(initList);
                this.qzCyList = _.cloneDeep(initList);
                var _list = res.data.pattern_value.priority;
                _list.forEach((val,ind)=>{
                  this.qzCyList[ind].value = val;
                })

              }
            }
          })
        },

        closeEditBox(){
          this.$emit('closeCyModleEditBox')
        },

        touponeStep(i,tar){
          this.cylistRank.splice(i,1);
          this.cylistRank.splice((i-1),0,tar);
        },

        saveCy(){
          var setData = {};
          // setData.id = this.editCyModelId;
          // setData.ad_id = this.detailCyz.ad_id;
          setData.creative_group_id = this.detailCyz.id;
          setData.pattern = this.cyType;
          if(this.cyType==2){
            var _obj = {};

            if(this.cyNumType==""){
              this.errMsg = "请选择轮播执行次数！";
              this.errstatus = true;
              return false;
            }

            if(this.cyNumType==1){

              if(!this.cyDz){
                this.errMsg = "请选择轮播定针创意！";
                this.errstatus = true;
                return false;
              }

              _obj.type = 1;
              _obj.creative_id = [];
              this.cylistRank.forEach(obj=>{
                _obj.creative_id.push(obj.id);
              });
              _obj.frame = this.cyDz;
            }
            else if(this.cyNumType==2){
              _obj.type = 2;
              _obj.creative_id = [];
              this.cylistRank.forEach(obj=>{
                _obj.creative_id.push(obj.id);
              });
            }
            else if(this.cyNumType==3){
              _obj.type = 3;
              _obj.creative_id = [];
              this.cylistRank.forEach(obj=>{
                _obj.creative_id.push(obj.id);
              });
              _obj.frame = this.cyDz;
              _obj.num = this.cyNt3Num;

              var reg = new RegExp("^\\+?[1-9][0-9]*$");
              if(!reg.test(this.cyNt3Num)){
                this.errMsg = "请输入数字格式的自定义次数！";
                this.errstatus = true;
                return false;
              }
              if(!this.cyDz){
                this.errMsg = "请选择轮播定针创意！";
                this.errstatus = true;
                return false;
              }
            }
            setData.pattern_value = _obj;
          }
          else if(this.cyType==3){
            var _obj = {
              creative_id:[],
              priority:[]
            };
            var stat = false;
            var total = Number();
            this.qzCyList.forEach(obj=>{
              _obj.creative_id.push(obj.id);
              _obj.priority.push(obj.value);
              total+= Number(obj.value);
              if(!/^[0-9]*$/.test(obj.value)){
                stat = true;
              }
            });
            if(stat){
              this.errMsg = "请输入权重数值，不需要%！";
              this.errstatus = true;
              return false;
            }
            else if(total!=100){
              this.errMsg = "权重总和必须等于100！";
              this.errstatus = true;
              return false;
            }
            setData.pattern_value = _obj;
          }
          fetch.post("/campaign/edit_creative_group",setData).then(res=>{
            if(res.ret===0 && res.data){
              this.errstatus = false;
              this.$emit('closeCyModleEditBox');
            }
            else if(res.ret==1 && res.msg=="暂无更新"){
              this.$message({
                showClose: true,
                message: '暂无更新！',
                type: 'warning'
              });
              this.$emit('closeCyModleEditBox');
              this.errstatus = false;
            }
          })
        }
      }
    }
</script>

<style scoped>
  @import "cy.css";
</style>
