<script>
import fetch from "@/services/fetch";
import moment from "moment";
import math from "mathjs";
import { mapState, mapGetters, mapActions } from "vuex";
math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});
const dayMilliSecond = 24 * 60 * 60 * 1000;
const numReg = /^[1-9]([0-9]*)+(.[0-9]{1,2})?$/;
export default {
  name: "ActivityCommon",
  data() {

    return {
      _isEdit:false,
      _editDefaultBudget:'',
      brand_name:'',
      brand_id:'',
      product_isEmpty:true,
      product_name:'',
      project_name:'',
      project_stime: "", //项目开始时间
      project_etime: "", //项目结束时间
      restBudget:'',//项目剩余可用预算
    };
  },
  watch: {

  },
  computed: {
    ...mapState({
      ader_name: state => state.ad.ader_name,
      project_id: state => state.ad.project_id,

      ader_id: state => state.ad.ader_id,
      ader_name: state => state.ad.ader_name,
      brand_forms: state => state.advertiser.brand_forms,
      // project_name: state => state.ad.project_name,
      // brand_names: state => state.ad.brand_name,
      // product_names: state => state.ad.product_name
    }),
    productListEx () {
      var result = [];
      var brand = this.brand_forms.filter( item => {
        return item.brand_id == this.brand_id
      });

      if( brand && brand.length > 0) {
        result = brand[0].products;
        // result = _.cloneDeep(result);
        // result.unshift({'id':'-1','name':"暂不选择产品线"})
      }
      return result;
    }
  },
  created() {

  },
  methods: {
    setValidateBudget(){
      let self = this;
      return (rule, value, callback) => {
        let editBudget = '';
        if (self._isEdit) {
          editBudget = math.eval(self._editDefaultBudget+"+"+self.restBudget)-0;
        }
        
        if (value == null||value == undefined||value == '') {
          self.f_budget = '';
          callback(new Error("请输入总预算"));
        } else if (!numReg.test(value)) {
          callback(new Error("预算值只允许是正整数或者最多保留2位小数的正实数！"));
        } else if((!self._isEdit&&(value-0)>(self.restBudget-0))||(self._isEdit&&editBudget<(value-0))){
          callback(new Error("活动预算不能大于项目剩余可用预算!"));
        }else {
          //debugger
          self.f_budget = self.$formatPrice(self.$toDecimal2(value));
          callback();
        };
      }
    },
    // 获取项目信息
    fetch_project_info() {
      return new Promise((resolve, reject) => {
        fetch
          .post("/query", { project_id: this.project_id })
          .then(res => {
            
            if (res.ret == 0&&res.data) {
              this.project_stime = moment(res.data.start_time);
              this.project_etime = moment(res.data.end_time);
              this.restBudget = (res.data.budget-0)>0?res.data.budget:0;
              this.brand_name = res.data.brand_name;
              this.brand_id = res.data.brand_id;
              this.product_name = res.data.product_name?res.data.product_name:'';
              this.product_isEmpty = res.data.product_name?false:true;
              this.project_name = res.data.name
              resolve(res.data);
            } else {//debugger
              this.$message.error('获取项目信息失败');
              reject(res.ret || "获取项目信息失败");
            }
          })
          .catch(err => {
            this.$message.error('获取项目信息失败');
            reject(err);
          });
      });

    },
    getDownloadParam(){
      return {
        adr_name:this.ader_name,
        brand_name:this.brand_name,
        product_name:this.product_name,
        project_name:this.project_name
      }
    },
    //获取excel中的天预算之和
    getExcelBudgets(arr){
      let rs = 0;
      for(let i of arr){
        rs = math.eval(rs+"+"+i.budget);
        // rs = (i.budget-0)+rs;
      }
      return rs-0;
    },
    //获取文件后缀名
    getSuffixName(str){
      let index = str.lastIndexOf('.')+1;
      return str.substring(index,str.length);
    },
    /*
    checkExcelInfo(stime,etime,budget){
      let s = moment(stime)-0;
      let e = moment(etime)-0;
      let ps = moment(this.project_stime)-0;
      let pe = moment(this.project_etime)-0;
      let tomorrow = moment(moment().format('YYYY-MM-DD'))-0+dayMilliSecond;
      let msg = ''
      if (ps>s) {
        msg = '活动开始时间不能早于项目开始时间,请修改后重新上传';
      }else if(tomorrow>s){
        msg = '活动开始时间不能早于明天,请修改后重新上传';
      }else if(e>pe){
        msg = '活动结束时间不能晚于项目结束时间,请修改后重新上传';
      }else if(this.restBudget>=budget){
        msg = '活动预算不能大于项目剩余可用预算,请修改后重新上传';
      }else{
        return true;
      }
      this.$message.error(msg);
    },
    // 上传成功的回调
    handle_upload_success(res) {
      let data = res.data;
      if (data) {
        let budget = this.getExcelBudgets(data.schedule);
        if (this.checkExcelInfo(data.start_time,data.end_time,budget)) {
          let stime = moment(data.start_time);
          let etime = moment(data.end_time);
          this.form.putTime = [stime, etime];
          // this.form.budget = data.budget;//产品说了，不使用excel中的总金额。那就使用界面上的了
          this.sendTableData(false, data.schedule);
        }
      }else{
        this.$message.error('上传文件，服务器返回数据为空，请稍后重试');
      }
    },
    // 上传之前的回调
    handle_before_upload(file) {
      //总预算为空不允许上传
      if (!this.form.budget) {
        this.$refs["form"].validateField('budget');
        return false;
      }else{
        const isExcel =
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel";
        if (!isExcel) {
          this.$message.error("上传模板只能是 xlsx 或者 xls 格式!");
        }
        return isExcel;
      }

    },
    setScheduleData(data) {
      this.scheduleData = data;
    },
    validatePutTime() {
      let time = this.form.putTime;
      if (Array.isArray(time) && time.length == 2) {
        return true;
      } else {
        return false;
      }
    },
    //总预算改变时
    onBlurBudget(){
      if (this.validatePutTime()&&this.isFirst) {
        this.$refs["form"].validateField('budget',errMsg=>{
          if (errMsg==undefined) {
            this.sendTableData(true);
            this.isFirst = false;
          }
        })
      }
    },
    //日期改变时
    onDateChange() {
      this.$refs["form"].validateField('budget',errMsg=>{
        if (errMsg==undefined&&this.validatePutTime()) {
          this.sendTableData(this.isFirst);
          this.isFirst&&(this.isFirst = false);
        }
      })
    },
    sendTableData(isAverage = false, excelData = []) {
      this.tableData.time = this.form.putTime;//开始时间结束时间
      this.tableData.budget = this.form.budget;//总预算
      this.tableData.isAverage = isAverage;//是否分均分配
      this.tableData.excelData = excelData;//Excel数据块
    },
    getCreateData() {
      let data = {
        name: this.form.name,
        budget: this.form.budget,
        type: this.form.type,
        start_time: moment(this.form.putTime[0]).format("YYYY-MM-DD"),
        end_time: moment(this.form.putTime[1]).format("YYYY-MM-DD"),
        schedule: this.scheduleData.schedule
      };

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
            fetch
              .post("/activity/create", data)
              .then(res => {
                if (res.ret == 0) {
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
    },
    onAverage() {
      this.$refs["form"].validateField('budget',errMsg=>{
        if (errMsg==undefined) {
          if (!this.validatePutTime()) {
            this.$message.error("请选择正确的投放时间");
          } else {
            this.sendTableData(true);
          }
        }else{
          this.$message.error(errMsg);
        }
      });
    }*/


  },


  components: {  }
};
</script>
