<template>
  <div class="form-wrap clearfix "  v-loading="isLoading">
    <h2>编辑项目</h2>
    <el-form  size="mini" ref="form" :model="form" :rules="rules" label-width="140px">
      <div class="form_normal">
      <el-form-item  label="广告主："  prop="ader_name" style='width:490px;'>
        <el-input :value="ader_name" :disabled="true" placeholder="请输入广告主名称" :title="ader_name"></el-input>
      </el-form-item>

      <el-form-item label="品牌：" prop="brand">
        <el-select v-model="form.brand" :disabled='hasActivity==1' placeholder="请选择">
          <el-option
            v-for="item in brand_forms"
            :key="item.brand_id"
            :label="item.brand"
            :value="item.brand_id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="productLine" label="产品线：">
        <el-select v-model="form.productLine" :disabled='hasActivity==1' placeholder="请选择">
          <el-option
            v-for="item in productListEx"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="projectName" label="项目名称：" style='width:490px;'>
        <el-input v-model.trim="form.projectName"></el-input>
      </el-form-item>
      <el-form-item prop="budget" label="总预算：">
        <el-input v-model.trim="form.budget"  style="width: 200px">>
          <template slot="append">元</template>
        </el-input>
        <div  id="f_budget" class="show_price" style="display: block">
          ¥{{f_budget}}
        </div>
      </el-form-item>
      <el-form-item label="投放日期：" prop="putTime">
        <el-date-picker
          v-model="form.putTime[0]"
          type="date"
          :picker-options="stimePickerOptions"
          :disabled='hasActivity==1'
          placeholder="开始日期">
        </el-date-picker>
        至
        <el-date-picker
          v-model="form.putTime[1]"
          type="date"
          @change='onDateChange'
          :picker-options="pickerOptions"
          placeholder="结束日期">
        </el-date-picker>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      </div>
    </el-form>

  </div>
</template>
<script>
import fetch from "@/services/fetch";
import moment from "moment";
import { mapState, mapGetters, mapActions,mapMutations } from "vuex";
const dayMilliSecond = 24 * 60 * 60 * 1000;
const numReg = /^[1-9]([0-9]*)+(.[0-9]{1,2})?$/;
var startTime = '';
export default {
  name: "ProjectEdit",
  data() {
    var validateBudget = (rule, value, callback) => {
      if (value === "") {
        this.f_budget = '';
        document.getElementById("f_budget").style.display = "none";
        callback(new Error("请输入总预算"));
      } else if (!numReg.test(value)) {
        document.getElementById("f_budget").style.display = "none";
        callback(new Error("预算值只允许是正整数或者最多保留2位小数的正实数！"));
      } else {
        document.getElementById("f_budget").style.display = "block";
        this.f_budget = this.$formatPrice(this.$toDecimal2(value));
        callback();
      }
    };
    var validateTime = (rule, value, callback) => {
      if (!value[0]) {
        callback(new Error("请选择开始投放时间"));
      } else if (!value[1]) {
        callback(new Error("请选择结束投放时间"));
      } else {
        if (this.form.putTime[1]-this.form.putTime[0]<0) {
          callback(new Error("结束时间不能大于开始时间"));
        }else{
          callback();
        }
        
      }
    };
    return {
      isLoading:false,
      hasActivity:1,//该项目下是否有活动，1是有活动，0是没有活动
      pickerOptions: {
        disabledDate(time) {
          let now = new Date()-24 * 60 * 60 * 1000;
          let s = startTime - 0;
          return time.getTime() < (now>s?now:s);
        }
      },
      stimePickerOptions:{
        disabledDate(time) {
          return time.getTime() < moment()-24 * 60 * 60 * 1000;
          // return time.getTime() < moment()-0;
        }
      },
      balance:0,
      scheduleData: {},
      isFirst: true,
      isAverage: false, //false,
      form: {
        ader_name:'xx',
        brand: "",
        productLine: "",
        projectName: "",
        budget: null,
        schedule:'',
        putTime: [] //投放时间
      },
      f_budget:'',
      rules: {
        ader_name: [{ required: true, message: "请输入广告主名称", trigger: "blur" }],
        brand: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
        schedule: [{ required: true, message: "预算分配表不能为空" }],
        projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        budget: [{ validator: validateBudget,required: true, trigger: "change" }],
        putTime: [{ validator: validateTime,trigger:"change"}]

      },
      tableData: {
        time: [],
        budget: 0,
        isAverage: false
      },
      downloadUrl: ""
    };
  },
  watch: {
    downloadUrl(newurl, old) {
      if (newurl != "") {
        window.open(newurl);
        this.downloadUrl = "";
      }
    },
    scheduleData:{
      handler: function(val, oldVal) {
        if (val.schedule.length) {
          this.form.schedule = 'schedule';
          this.balance = val.balance;
        }else{
          this.form.schedule = ''
        }
      },
      deep: true
    },
  },
  computed: {
    // ...mapGetters("ad", ["productListEx"]),
    ...mapState({
      ader_name: state => state.ad.ader_name,
      brand_forms: state => state.advertiser.brand_forms
    }),
    productListEx () {
      var result = [];
      if( this.form.brand ){
        if(!this.isFirst){
          this.form.productLine = '';
        }else{
          this.isFirst = false;
        }
        
        var brand = this.brand_forms.filter( item => {
          return item.brand_id == this.form.brand
        });

        if( brand && brand.length > 0) {
          result = brand[0].products;
          result = _.cloneDeep(result);
          result.unshift({'id':'-1','name':"暂不选择产品线"})
        }
      }
      return result;
    }
  },
  methods: {
    ...mapMutations('ad',['update_project_name']),
    fetch_project_info(){
      this.isLoading = true;
      let id = this.$route.params.id;
      fetch.post("/project/project_schedule", {id})
      .then(res => {
        this.isLoading = false;
        if (res.ret == 0) {
          let data = res.data[0];
          this.initData(data);
        } else {
          this.$alert(res.msg, "获取项目信息失败，请稍后重试");
        }
      })
      .catch(err => {
        this.isLoading = false;
        console.error(err);
      });
    },
    initData(obj){
      
      this.hasActivity = obj.is_activity;
      // this.form.brand = obj.brand_name;
      this.form.brand = obj.brand_id;
      // this.form.productLine = obj.productLine_name;
      this.form.productLine = obj.product_line;
      this.form.projectName = obj.name;
      this.form.budget = obj.budget;
      this.f_budget = this.$formatPrice(obj.budget);
      this.form.putTime[0] = moment(obj.start_time);
      this.form.putTime[1] = moment(obj.end_time);
      startTime = this.form.putTime[0];
      let data = this.formatScheduleData(obj.schedule);
      this.sendTableData(false, data);
    },
    formatScheduleData(arr){
      let result = [];
      if (Array.isArray(arr)) {
        for (let i of arr) {
          let time = i.day;
          let budget = i.budget;
          let percent = i.percent;
          result.push({time,budget,percent});
        }
      }
      return result;
    },
    /**
     * [checkExcelBudget 检查上传的Excel中总预算是否大于已过去时间内的预算和]
     * @param  {[type]} res [description]
     * @return {[type]}     [ture:总预算大于已过去时间的预算和  false：不大于]
     */
    checkExcelBudget(res){
      let totalBudget = res.data.budget-0;
      let schedule = res.data.schedule;
      let allBudgetPast = 0;
      for (let i of schedule) {
        if (!moment().isBefore(i.time)) {
          allBudgetPast = allBudgetPast+(i.budget-0);
        }
      }
      return totalBudget>=allBudgetPast?true:false;
    },
    handle_upload_success(res) {
      if (this.checkExcelBudget(res)) {
        let data = res.data;
        let stime = new Date(data.start_time);
        let etime = new Date(data.end_time);
        this.form.putTime = [stime, etime];
        this.form.budget = data.budget;

        this.sendTableData(false, data.schedule);
      }else{
        this.$message.error("上传预算分配表总预算小于过去时间已分配的预算总和，请修改后重新上传");
      }
    },
    handle_before_upload(file) {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        this.$message.error("上传模板只能是 xlsx 或者 xls 格式!");
      }
      return isExcel;
    },
    setScheduleData(data) {
      this.scheduleData = data;
    },
    validateBudget() {
      return numReg.test(this.form.budget);
    },
    validatePutTime() {
      let time = this.form.putTime;
      if (Array.isArray(time) && time.length == 2) {
        return true;
      } else {
        return false;
      }
    },

    onDateChange() {
      if (this.validateBudget() && this.validatePutTime()) {
        this.sendTableData();
      }
    },
    sendTableData(isAverage = false, excelData = []) {
      // if (this.validateBudget()&&this.validatePutTime()) {
      let data = this.tableData; //this.isFirst
      this.tableData.time = this.form.putTime;
      this.tableData.budget = this.form.budget;
      this.tableData.isAverage = isAverage;
      this.tableData.excelData = excelData;
      // this.tableData.fromExcel = fromExcel;

      // }
    },
    getSubmitData() {
      let data = {
        id: this.$route.params.id,
        name: this.form.projectName,
        budget: this.form.budget,
        start_time: moment(this.form.putTime[0]).format("YYYY-MM-DD"),
        end_time: moment(this.form.putTime[1]).format("YYYY-MM-DD"),
        brand_id:this.form.brand,
      };
      if (this.form.productLine!=-1&&this.form.productLine!='') {
        data.product_line = this.form.productLine;
      }
      return data;
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.balance!=0) {
            this.$message.error("日预算之和不等于总预算，请修改！");
          }else{
            let data = this.getSubmitData();
            this.isLoading = true;
            fetch
              .post("/project/edit", data)
              .then(res => {
                this.isLoading = false;
                if (res.ret == 0) {
                  let id = this.$route.params.id-0;
                  let name = res.data.name;
                  // debugger
                  this.update_project_name({id,name});
                  this.$alert("项目编辑成功", "提示", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.$router.push({
                        path: "/ad/project/manage"
                      });
                    }
                  });
                } else {
                  this.$alert(res.msg, "编辑项目失败，请稍后重试");
                }
              })
              .catch(err => {
                this.isLoading = false;
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
        path: "/ad/project/manage"
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
    onDownload() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = this.getSubmitData();
          fetch
            .post("/excel/export", data)
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
  created() {
    this.fetch_project_info();
  },
  components: {  }
};
</script>
<style scoped>

.cost-table-wrap .btn {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}
.cost-table-wrap .btn i {
  cursor: pointer;
  display: block;
  font-size: 30px;
  font-weight: bolder;
  margin: 5px 0 5px 0;
}
.cost-table-wrap {
  padding-left: 70px;
  display: flex;
  margin-bottom: 13px;
}
.cost-table {
  margin-left: 39px;
  overflow: auto;
}
.cost-table table {
  margin-bottom: 5px;
}
</style>
