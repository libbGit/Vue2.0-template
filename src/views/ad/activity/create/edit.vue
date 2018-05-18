<template>
  <div class="form-wrap clearfix">
    <h2>编辑活动</h2>
       <el-form class="form-container" size="mini" ref="form" :model="$data" :rules="rules" label-width="140px">

      <el-form-item  label="广告主："  style='width:490px;'>
        <el-input :value="ader_name" :disabled="true" placeholder="请输入广告主名称"></el-input>
      </el-form-item>

      <el-form-item  label="品牌：" style='width:490px;'>
        <el-select v-model="brand_name" disabled placeholder="请选择">
        </el-select>
      </el-form-item>

      <el-form-item label="产品线：">
        <el-select v-model="product_name_c" disabled placeholder="请选择">
        </el-select>
      </el-form-item>

      <el-form-item prop="project_name" label="项目：" style='width:490px;'>
        <el-input  :value="project_name" :disabled="true"></el-input>
      </el-form-item>

        <el-form-item prop="name" label="活动名称：" style='width:490px;'>
        <el-input  v-model="name" ></el-input>
      </el-form-item>

      <el-form-item prop="type" label="计费方式">
        <el-row>
          <el-col style="width:160px">
              <el-radio-group v-model="type">
                  <el-radio label="1">CPM</el-radio>
                  <el-radio label="2">CPC</el-radio>
              </el-radio-group>
          </el-col> 
          <el-col  style="width:140px; margin-left:50px">
              <div style="font-size:12px;">按照目标CPC优化 <el-checkbox v-model="isCpcSelected" size="mini"></el-checkbox></div>
              <div style="display:flex;font-size:12px;" v-if="isCpcSelected">
                <label style="width:100px ">目标CPC: </label>
                <el-input v-model.number="cpc_value" placeholder="" size="mini" :max="5"></el-input>
              </div>
          </el-col>
        </el-row>
      </el-form-item>

         <el-form-item prop="budget" label="总预算：">
           <el-input v-model="budget" :value="budget" @blur='onBlurBudget($event)' style='width:200px;'>
             <template slot="append">元</template>
           </el-input>
        <div  class="show_price" style="background-color: transparent; border: none; color: #333;display: block;font-size:12px;" >
             <span v-if="f_budget">¥</span>{{f_budget}}
           </div>
         </el-form-item>

      <el-form-item label="投放日期：" prop="putTime">
        <el-date-picker
          v-model="putTime[0]"
          type="date"
          disabled
          placeholder="开始日期">
        </el-date-picker>
        至
        <el-date-picker
          v-model="putTime[1]"
          type="date"
          @change='onDateChange'
          :picker-options="pickerOptions">
          placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

         <el-form-item label="预算分配表：" prop="schedule">

           <div class="cost-table-wrap">
             <el-upload
               action="/api/project/upload"
               :before-upload="handle_before_upload"
               :on-success="handle_upload_success"
               :show-file-list="false">
               <el-button  size="mini" icon="el-icon-upload2" title="上传预算分配表" type="primary" plain>上传预算分配表</el-button>
             </el-upload>
             <div style="margin-left: 20px">
               <el-button @click="onDownload"  size="mini" icon="el-icon-download" title="下载到本地">下载到本地</el-button>
             </div>
           </div>
           <span style="color:red; font-size: 12px">上传排期预算表将覆盖现有的排期预算设置</span>

          <cost-table class='cost-table'
            ref='costTable'
            :totalBudget='budget_c'
            :time="putTime"
            :dataChunk='excelData'
            @scheduleData="setScheduleData">
          </cost-table>

         </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import fetch from "@/services/fetch";
import moment from "moment";
import costTable from "./table";
import common from "./common";
import math from "mathjs";
import { mapState, mapGetters, mapActions,mapMutations } from "vuex";
math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});
const numReg = /^[1-9]([0-9]*)+(.[0-9]{1,2})?$/;
const ExcelType = ['xlsx','xlsm','xlsb','xltx','xltm','xls','xlt','xls'];

export default {
  name: "ActivityEdit",
  data() {
    var validateBudget = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入总预算"));
      } else if (!numReg.test(value)) {
        callback(new Error("预算值只允许是正整数或者最多保留2位小数的正实数！"));
      } else {
        callback();
      }
    };
    return {
      product_line_id:'',
      activity_stime:'',//活动默认的开始时间
      activity_etime:'',//活动默认的结束时间
      activity_restBudget:'',//本活动的可用金额
      activity_budget:'',//本活动的默认金额
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      balance: 0,
      scheduleData: {},
      isAverage: false, //false,
      name:'',
      budget:'',
      f_budget:'',
      putTime: [],
      type: "",
      rules: {
        name: [{ required: true, message: "活动名称不能为空", trigger: "blur" }],
        brand: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
        budget: [
          { validator: validateBudget, required: true, trigger: "blur" }
        ],
        putTime: [{ required: true, message: "请选择投放日期" }],
        type: [{ required: true, message: "请选择投放方式" }]
      },
      excelData:[],
      downloadUrl: "",
      isCpcSelected:false,   //按目标CPC优化
      cpc_value:0
    };
  },
  mixins: [common],
  watch: {
    scheduleData: {
      handler: function(val, oldVal) {
        if (val.schedule.length) {
          // this.form.schedule = "schedule";
          this.balance = val.balance;
        } else {
          // this.form.schedule = "";
        }
      },
      deep: true
    },
    downloadUrl(newurl, old) {
      if (newurl != "") {
        this.$downloadFile(newurl);
        this.downloadUrl = "";
      }
    }
  },
  computed: {
    ...mapState({
      ader_id: state => state.ad.ader_id,
      ader_name: state => state.ad.ader_name,
      brand_forms: state => state.advertiser.brand_forms,
      // project_name: state => state.ad.project_name,
      project_id: state => state.ad.project_id,
      // brand_names: state => state.ad.brand_name,
      // product_names: state => state.ad.product_name
    }),
    budget_c(){
      let rs = 0;
      if (this.budget!='') {
        let t = Number(this.budget);
        rs = t>0?t:0;
      }
      return rs;
    },
    product_name_c(){
      if (this.productListEx.length&&this.product_line_id) {
        let obj = _.find(this.productListEx,{id:this.product_line_id});
        return obj.name
      }
      return '';
    }
  },
  created() {
    this._isEdit = true;
    Promise.all([this.fetch_project_info(),this.fetch_activity_info(),this.fetch_schedule()])
      .then((res)=>{
        this.initData(res);
      });
  },
  methods: {
    ...mapMutations('ad',['update_activity_name']),
    //总预算改变时
    onBlurBudget(event){
      if (!moment(this.putTime[1]).isBefore(moment(moment()-24 * 60 * 60 * 1000))) {
        let val = _.trim(event.target.value);
        this.budget = val;
        this.rules.budget[0]['validator'] = this.setValidateBudget();
      }else{
        this.$message.error('活动开始时间和结束时间都在今天之前，此时无法修改总金额');
      }
    },
    setDisabledDate() {
      return time => {
        let now = moment()-24 * 60 * 60 * 1000;
        let stime = now>this.activity_stime?now:this.activity_stime;
        let etime = moment(this.project_etime);
        let oneYear = moment(this.activity_stime).add(364, 'days');
        if (etime-oneYear>0) {
          etime = oneYear;
        }
        return time.getTime() < stime || time.getTime() > etime;
      };
    },
    formatScheduleData(arr){
      let result = [];
      for (let i of arr) {
        let time = i.day;
        let budget = i.budget;
        let percent = i.percent;
        let locked = i.locked-0;
        result.push({time,budget,percent,locked});
      }
      result.sort((a,b)=>moment(a.time)-moment(b.time))
      return result;
    },
    fetch_schedule(){
      return new Promise((resolve, reject) => {
        fetch
          .post("/activity/schedule", { id: this.$route.params.id })
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data.schedule);

            } else {//debugger
              this.$message.error('获取活动预算分配信息失败');
              reject(res.msg || "获取活动预算分配信息失败");
            }
          })
          .catch(err => {
            this.$message.error('获取活动预算分配信息失败');
            reject(err);
          });
      });

    },

    fetch_activity_info() {
      let id = this.$route.params.id;
      return new Promise((resolve, reject) => {
        fetch
          .post("/activity/list", { id })
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(res.ret);
              this.$message.error('获取活动信息失败');
            }
          })
          .catch(err => {
            reject(err);
            this.$message.error('获取活动信息失败');
          });
      });
    },
    initData(arr) {
      let [project,activity,schedule] = arr;

      this.name = activity.name;
      this._editDefaultBudget = this.budget = activity.budget;
      this.f_budget = this.$formatPrice(this.$toDecimal2(activity.budget));
      this.activity_budget = activity.budget;
      this.type = activity.type;
      this.isCpcSelected = activity.cpc==1?true:false;
      this.cpc_value = activity.cpc_value;
      this.product_line_id = activity.product_line;
      this.activity_stime = this.putTime[0] = moment(activity.start_time);
      this.activity_etime = this.putTime[1] = moment(activity.end_time);

      this.rules.budget[0]['validator'] = this.setValidateBudget();

      this.pickerOptions.disabledDate =  this.setDisabledDate();
      
      this.excelData = this.formatScheduleData(schedule);
      this.setActivityRestBudget(this.excelData);
      // this.sendTableData(false, data);

    },
    // 设置该活动剩余可用金额
    setActivityRestBudget(arr){
      let rs = 0;
      for(let i of arr){
        if (!moment(moment()-24 * 60 * 60 * 1000).isBefore(i.time)) {
          rs = math.eval(rs+"+"+i.budget);
        }else{
          break;
        }
      }
     this.activity_restBudget = math.eval(this.budget+'-'+rs) - 0;
    },
    checkExcelInfo(stime,etime,budget){
      let s = moment(stime)-0;
      let e = moment(etime)-0;
      let [as,ae,ps,pe] = [this.activity_stime-0,this.activity_etime-0,this.project_stime-0,this.project_etime-0];
      let now = moment(moment(moment()-24 * 60 * 60 * 1000).format('YYYY-MM-DD'));
      let msg = ''
      if (as>s) {
        msg = '模板中活动开始时间不能早于目前活动开始时间,请修改后重新上传';
      }else if(e>pe){
        msg = '活动结束时间不能晚于项目结束时间（'+this.project_etime+'）,请修改后重新上传';
      }else if(now>s){
        msg = '活动开始时间不能早于今天,请修改后重新上传';
      }else if((this.restBudget+this.activity_restBudget)<budget){
        msg = '活动预算不能大于项目剩余可用预算与该活动剩余预算之和,请修改后重新上传';
      }else{
        return true;
      }
      this.$message.error(msg);
    },
    handle_upload_success(res) {
      let data = res.data;
      if (data) {
        let budget = this.getExcelBudgets(data.schedule);
        if (this.checkExcelInfo(data.start_time,data.end_time,budget)) {
          let etime = moment(data.end_time);
          let usedBudget = this.activity_budget - this.activity_restBudget;

          if (moment(this.putTime[1])-moment(etime)<0) {
            this.putTime[1] = etime;
          }

          let old = this.budget;//界面的金额
          let _new = budget+usedBudget;//算出来的金额（excel中天金额之和+当前活动明天及明天以后的金额）
          this.budget = old>_new?old:_new;
          this.excelData = data.schedule;
          // this.sendTableData(false, data.schedule);
        }
      }else{
        this.$message.error('上传文件，服务器返回数据为空，请稍后重试');
      }
    },
    handle_before_upload(file) {
      /*const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        this.$message.error("上传模板只能是 xlsx 或者 xls 格式!");
      }
      return isExcel;*/
      let type = this.getSuffixName(file.name);
      let isExcel = ExcelType.indexOf(type)!=-1;
      if (!isExcel) {
        this.$message.error("上传模板只能是excel文件格式!");
      }
      return isExcel;
    },
    setScheduleData(data) {
      this.scheduleData = data;
    },
    validateBudget() {
      return numReg.test(this.budget);
    },
    validatePutTime() {
      let time = this.putTime;
      if (Array.isArray(time) && time.length == 2) {
        return true;
      } else {
        return false;
      }
    },
    onDateChange() {
      /*if (this.validateBudget() && this.validatePutTime()) {
        this.sendTableData();
      }*/
    },
    
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.balance != 0) {
            this.$message.error("日预算之和不等于总预算，请修改！");
          } else {
            let data = this.getSubmitData();
            // console.log(JSON.stringify(data))
            fetch
              .post("/activity/edit", data)
              .then(res => {
                if (res.ret == 0) {
                  let project_id = this.project_id
                  let activity_id =  +this.$route.params.id;//将字符串转换为number
                  let activity_name = this.name;
                  this.update_activity_name({project_id,activity_id,activity_name});
                  this.$alert("编辑活动成功", "提示", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.$router.push({
                        path: "/ad/activity/manage"
                      });
                    }
                  });
                } else {
                  this.$alert(res.msg, "编辑活动失败，请稍后重试");
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.$router.push({
        path: "/ad/activity/manage"
      });
    },
    onAverage() {
      if (!this.validateBudget()) {
        this.$message.error("请输入正确的预算金额");
      } else if (!this.validatePutTime()) {
        this.$message.error("请选择正确的投放时间");
      } else {
        this.sendTableData(true);
      }
    },
    getSubmitData() {
      let data = {
        id: this.$route.params.id,
        name: this.name,
        budget: this.budget,
        type: this.type,
        start_time: moment(this.putTime[0]).format("YYYY-MM-DD"),
        end_time: moment(this.putTime[1]).format("YYYY-MM-DD"),
        schedule: this.scheduleData.schedule
      };
      return data;
    },
    onDownload() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = this.getSubmitData();
          let exData = this.getDownloadParam();

          fetch
            .post("/excel/export",  _.extend(data,exData,{product_name:this.product_name_c}))
            .then(res => {
              if (res.ret == 0) {
                if (res.data && res.data.filename) {
                  this.downloadUrl = res.data.filename; // {filename: "/static/Uploads/excel/test.xlsx"}
                }
              } else {
                this.$alert(res.msg, "下载失败，请稍后重试");
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  },

  components: { costTable }
};
</script>
<style scoped>
  .form-wrap {
    margin: auto;
    background: #fff;
    padding: 10px 25px;
  }
  .form-wrap h2 {
    margin-bottom: 20px;
    padding: 10px 10px;
    font-size: 16px;
    margin-top: -10px;
    border-bottom: 1px solid #f0f2f5;
  }
  .form-wrap .form-container {
    width: 1000px;
  }
  .cost-table-wrap{
    display: flex;
  }
  .cost-table {
    background: #f5f5f5;
    border-radius: 3px;
    overflow: auto;
    max-height: 500px;
  }
  .cost-table table {
    font-size: 12px;
  }
</style>
