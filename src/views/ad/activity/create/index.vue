<template>
  <div class="form-wrap clearfix">
    <h2>新建活动</h2>
       <el-form class="form-container" size="mini" ref="form" :model="$data" :rules="rules" label-width="140px">

      <el-form-item  label="广告主：" prop="ader_name"  style='width:490px;'>
        <el-input :value="ader_name" :disabled="true" placeholder="请输入广告主名称"></el-input>
      </el-form-item>

      <el-form-item  label="品牌：" style='width:490px;'>
        <el-select v-model="brand_name" disabled placeholder="请选择">
        </el-select>
      </el-form-item>

      <el-form-item label="产品线：" prop="product_name">
        <el-select v-model="product_name" :disabled='product_isEmpty?false:true' placeholder="请选择">
          <el-option
            v-for="item in productListEx"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
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
          v-model="putTime"
          :picker-options="pickerOptions"
          @change='onDateChange'
          type="daterange"
          size='small'
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
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
          :time="putTime_c"
          :dataChunk='excelData'
          :isNew='isNew'
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
import { mapState, mapGetters, mapActions,mapMutations } from "vuex";

const numReg = /^[1-9]([0-9]*)+(.[0-9]{1,2})?$/;
const ExcelType = ['xlsx','xlsm','xlsb','xltx','xltm','xls','xlt','xls'];
export default {
  name: "ActivityCreate",
  data() {
    let validateBudget = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入总预算"));
      } else if (!numReg.test(value)) {
        callback(new Error("预算值只允许是正整数或者最多保留2位小数的正实数！"));
      } else {
        callback();
      }
    };
    let validateTime = (rule, arr, callback) => {
      if (arr.length == 0) {
        callback(new Error("请选择投放时间"));
        return;
      }else{
        let stime = arr[0];
        let etime = arr[1];
        let diff = moment(etime).diff(moment(stime), 'days');
        if (diff>364) {
          callback(new Error("开始时间截至结束时间跨度不能超过365天"));
        }else{
          callback();
        }
      }
    };
    return {
      // testArr:[{name:'mayue'},{name:'mayue2'}],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      isNew:true,
      balance: 0,
      scheduleData: {},
      isFirst: true,
      isAverage: false,
      f_budget:'',
      // ----------------
      name:'',//活动名称
      type:'1',
      brand: "",
      // brand_name: "",
      // product_name: "",
      budget: null,
      schedule: "",
      putTime: [], //投放时间
      // ----------------
      rules: {
        product_name:[{ required: true, message: "请选择产品线名称", trigger: "change" }],
        name: [{ required: true, message: "活动名称不能为空", trigger: "blur" }],
        brand: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
        budget: [{ validator: validateBudget, required: true, trigger: "change" }],
        putTime: [{ required: true,validator: validateTime, trigger: "change"}],//日期不用做校验，因为用户手动选择时间时，已经对不可用的日期做了灰化。但是上传excel的日期还是要校验的。
        type: [{ required: true, message: "请选择投放方式"}]
      },
      excelData:[],
      downloadUrl: "",
      isCpcSelected:false,   //按目标CPC优化 0 false, 1 true
      cpc_value:0
    };
  },
  mixins: [common],
  watch: {
    putTime(a,b){
      // debugger
    },
    scheduleData: {
      handler: function(val, oldVal) {
        if (val.schedule.length) {
          this.schedule = "schedule";
          this.balance = val.balance;
        } else {
          this.schedule = "";
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
      // ader_id: state => state.ad.ader_id,
      ader_name: state => state.ad.ader_name,
      // brand_forms: state => state.advertiser.brand_forms,
      // project_name: state => state.ad.project_name,
      // project_id: state => state.ad.project_id,
    }),
    budget_c(){
      let rs = 0;
      if (this.budget!='') {
        let t = Number(this.budget);
        rs = t>0?t:0;
      }
      return rs;
    },
    putTime_c(){
      return this.putTime==null?[]:this.putTime;
    }
  },
  created() {
    this.fetch_project_info().then(data => {
      this.init(data);
    });
  },
  methods: {
    ...mapMutations('ad',['insert_activity']),
    init(data){
      // this.brand_name = data.brand_name;
      // this.product_name = data.name;
      this.pickerOptions.disabledDate =  this.setDisabledDate();
      this.rules.budget[0]['validator'] = this.setValidateBudget();
    },
    //设置时间插件的时间可选性
    setDisabledDate(){
      return time=>{ 
        let stime = moment()-24 * 60 * 60 * 1000;
        if (stime-0<moment(this.project_stime)-0) {
          stime = moment(this.project_stime)
        }
        let etime = moment(this.project_etime);
        /*let oneYear = moment(stime).add(365, 'days');
        if (etime-oneYear>0) {
          etime = oneYear;
        }*/
        return time.getTime() < stime||time.getTime() > etime;
      };
    },
    checkExcelInfo(stime,etime,budget){
      let s = moment(stime)-0;
      let e = moment(etime)-0;
      let ps = moment(this.project_stime)-0;
      let pe = moment(this.project_etime)-0;
      let now = moment(moment(moment()-24 * 60 * 60 * 1000).format('YYYY-MM-DD'))-0;
      let msg = ''
      if (ps>s) {
        msg = '活动开始时间不能早于项目开始时间（'+this.project_stime+'）,请修改后重新上传';
      }else if(now>s){
        msg = '活动开始时间不能早于今天,请修改后重新上传';
      }else if(e>pe){
        msg = '活动结束时间不能晚于项目结束时间（'+this.project_etime+'）,请修改后重新上传';
      }else if(this.restBudget<budget){
        msg = '活动预算不能大于项目剩余可用预算（'+this.restBudget+'）,请修改后重新上传';
      }else{
        return true;
      }
      this.$message.error(msg);
    },
    // 上传成功的回调
    handle_upload_success(res) {
      let data = res.data;
      if (data) {
        let totalBudget = this.getExcelBudgets(data.schedule);
        if (this.checkExcelInfo(data.start_time,data.end_time,totalBudget)) {
          let stime = moment(data.start_time);
          let etime = moment(data.end_time);
          this.putTime = [stime, etime];
          this.budget = totalBudget;
          this.excelData = data.schedule;
          this.isFirst = false;
        }
      }else{
        this.$message.error('上传文件，服务器返回数据为空，请稍后重试');
      }
    },
    // 上传之前的回调
    handle_before_upload(file) {
      let type = this.getSuffixName(file.name);
      let isExcel = ExcelType.indexOf(type)!=-1;
      if (!isExcel) {
        this.$message.error("上传模板只能是excel文件格式!");
      }
      return isExcel;
      //这个校验其实没有作用，
      // this.$refs["form"].validateField('budget',errMsg=>{});
    },
    setScheduleData(data) {
      this.scheduleData = data;
    },
    validatePutTime() {
      let time = this.putTime;
      if (Array.isArray(time) && time.length == 2) {
        let stime = time[0];
        let etime = time[1];
        let diff = moment(etime).diff(moment(stime), 'days');
        if (diff>364) {
          return false;
          // callback(new Error("开始时间截至结束时间跨度不能超过365天"));
        }else{
          return true;
        }
        
      } else {
        return false;
      }
    },
    //总预算改变时
    onBlurBudget(event){
      let val = _.trim(event.target.value);
      this.budget = val;
      // console.log('budget:',this.budget)
      if (this.isFirst&&this.validatePutTime()) {
        this.$refs["form"].validateField('budget',errMsg=>{
          if (!errMsg) {
            this.isFirst = false;
            this.$nextTick(()=>{
              this.$refs.costTable.averageBudget()
            })
          }
        })
      }
    },
    //日期改变时
    onDateChange() {
      this.$refs["form"].validateField('budget',errMsg=>{
        if (!errMsg&&this.validatePutTime()) {
          if (this.isFirst) {
            this.isFirst = false
            this.$nextTick(()=>{
              this.$refs.costTable.averageBudget()
            })
          }
        }
      })
    },

    getCreateData() {
      let result = [];
      for (let item of this.scheduleData.schedule) {
        let time = item.time;
        let budget = item.budget;
        let percent = item.percent;
        let locked = item.locked;
        result.push({ time, budget, percent ,locked});
      }
      let data = {
        name: this.name,
        budget: this.budget,
        type: this.type,
        start_time: moment(this.putTime[0]).format("YYYY-MM-DD"),
        end_time: moment(this.putTime[1]).format("YYYY-MM-DD"),
        schedule: result,
        cpc: this.isCpcSelected?1:0,  //选中则cpc为1，没有选中则为0
        cpc_value: this.cpc_value
      };
      if (this.product_isEmpty) {
        data.product_line = this.product_name;
      }
      return data;
    },
    onSubmit() {
      // return
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.balance != 0) {
            this.$message.error("日预算之和不等于总预算，请修改！");
          } else {
            let data = this.getCreateData();
            // console.log('data',JSON.stringify(data))
            fetch
              .post("/activity/create", data)
              .then(res => {
                if (res.ret == 0) {
                  let project_id = this.project_id;
                  let activity_id = res.data.id;
                  let activity_name = res.data.name;
                  this.insert_activity({project_id,activity_id,activity_name});
                  this.$alert("创建活动成功", "提示", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.$router.push({
                        path: "/ad/activity/manage"
                      });
                    }
                  });
                } else {
                  this.$message.error("创建活动失败，请稍后重试");
                  console.error(res.ret.data);
                }
              })
              .catch(err => {
                console.error(err);
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
    onDownload() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = this.getCreateData();
          let exData = this.getDownloadParam();
          fetch
            .post("/excel/export", _.extend(data,exData))
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
    },

  },


  components: { costTable }
};
</script>
<style scoped>
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
