<template>
  <el-dialog :visible="visible" title="复制计划" @close="handleClose" width="500px" @open="handleOpen">
    <el-form class="form-container" size="mini" ref="form" :model="form" :rules="rules" label-width="120px">

      <el-form-item prop="brand_id" label="品牌：">
        <el-select v-model="form.brand_id" placeholder="请选择"  @change="handle_brand_change">
          <el-option
            v-for="item in brand_forms"
            :key="item.brand_id"
            :label="item.brand"
            :value="item.brand_id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="product_id" label="产品线：">
        <el-select v-model="form.product_id" disabled placeholder="请选择">
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="project_id" label="项目名称：">
        <el-select v-model="form.project_id" placeholder="请选择项目"  @change="handle_project_change">
          <el-option
            v-for="item in project_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item prop="activity_id" label="活动名称：">
        <el-select v-model="form.activity_id" placeholder="请选择活动" @change="handle_activity_change">
          <el-option
            v-for="item in activity_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="campaign_name" label="计划名称：">
        <el-input v-model="form.campaign_name" style="width: 200px" />
      </el-form-item>

      <el-form-item label="投放日期：" prop="daterange" :required="true">
        <el-date-picker
          v-model="form.daterange"
          type="daterange"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <!--
        <el-date-picker :clearable="false" v-model="form.start_date" value-format="yyyy-MM-dd" type="date" placeholder="开始日期" />
        <span>至</span>
        <el-date-picker :clearable="false" v-model="form.end_date" value-format="yyyy-MM-dd" type="date" placeholder="结束日期" />
         -->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>

</template>
<script>

  import moment from 'moment'
  import fetch from "@/services/fetch"
  import { mapState, mapGetters, mapActions } from "vuex"

  var checkName = (rule, value, callback) => {
    if ( !/^[\u4e00-\u9fa5A-Za-z0-9_()（）]{3,}$/.test(value) ) {
      callback(new Error('只能包含数字、英文、下划线、中英文括号,长度至少三个字符!'));
    } else {
      callback();
    }
  }
  var activity_start_date =  '';
  var activity_end_date =  '';

  var checkTime = (rule, value, callback) => {
    var start = value[0];
    var end = value[1];

    if ( moment(start).isBefore(new Date()-24 * 60 * 60 * 1000) ) {
      callback(new Error('计划的开始日期必须大于昨天'));
    }
    else if(moment(activity_start_date && start).isBefore(activity_start_date))  {
      callback(new Error('计划的开始日期必须大于等于活动的开始日期(' + activity_start_date + ')' ));
    }
    else if(activity_end_date && moment(activity_end_date).isBefore(end)) {
      callback(new Error('计划的结束日期必须小于等于活动的结束日期(' + activity_end_date + ')' ));
    }
    else {
      callback();
    }
  }

  export default {
    name: 'dialog-copy',
    props: {
      visible: {
        type: Boolean
      },
      campaign: {
        type: Object,
        required: true,
      },
      campaignId: {
        type: String,
        required:  true
      }
    },
    data () {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < moment()-24 * 60 * 60 * 1000;
          }
        },
        project_list: [],
        activity_list: [],
        form : {
          brand_id: this.campaign.brand_id,
          product_id: this.campaign.product_line,
          project_id: this.campaign.project_id,
          activity_id: this.campaign.activity_id,
          campaign_name: '',
          daterange: []
        },
        rules: {
          brand_id: [{ required: true, message: "请选择品牌", trigger: "change" }],
          product_id:[{ required: true, message: "请选择产品线", trigger: "change" }],
          project_id: [{ required: true, message: "请选择项目", trigger: "change" }],
          activity_id: [{ required: true, message: "请选择活动", trigger: "change" }],
          campaign_name: [
            { required: true, message: "请输入计划名称", trigger: "change" },
            { validator: checkName, trigger: 'change' }
          ],
          daterange: [
            { required: true, message: "请选择投放日期", trigger: "change" },
            { validator: checkTime, trigger: 'change' }
          ],
        },
      }
    },
    computed: {
      ...mapState({
        ader_id: state => state.ad.ader_id,
        ader_name: state => state.ad.ader_name,
        brand_forms: state => state.advertiser.brand_forms
      }),
      start_date () {
        return this.form.daterange[0];
      },
      end_date () {
        return this.form.daterange[1];
      },
      productList () {
        var result = [];
        if( this.form.brand_id ){
          this.form.product_id = '';
          var brand = this.brand_forms.filter( item => {
            return item.brand_id == this.form.brand_id
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
      ...mapActions('advertiser', [
        'fetch_brand_form'
      ]),
      handleClose () {
        this.$emit('update:visible', false)
      },
      handleOpen () {
        this.form.campaign_name = '';
        this.form.daterange = [];
        this.form.brand_id = this.campaign.brand_id;
        // this.form.product_id = this.campaign.product_line;
        this.form.project_id = this.campaign.project_id;
        this.form.activity_id = this.campaign.activity_id;
        this.fetch_brand_form(this.ader_id).then(res=>{
          this.fetch_project_list();
          this.fetch_activity_list();
          this.handle_activity_change(this.form.activity_id);
        });

        /*this.fetch_project_list();
        this.fetch_activity_list();
        this.handle_activity_change(this.form.activity_id);*/
      },
      handle_brand_change (){
        this.form.product_id = '';
        this.form.project_id = '';
        this.form.activity_id = '';
        this.fetch_project_list();
      },
      handle_project_change (){
        this.form.activity_id = '';
        this.fetch_activity_list();
      },
      handle_activity_change(id){
        fetch.post('/query', {
          activity_id: id
        }).then( res => {
          if( res.ret == 0 ) {
            activity_start_date = res.data.start_time;
            activity_end_date = res.data.end_time;
            this.form.product_id = res.data.product_line_id
            // res.data.product_name

          }
        })
      },
      fetch_project_list() {
        return fetch.post('/campaign/project', {
          brand_id: this.form.brand_id
        }).then( res => {
          if( res.ret == 0 ) {
            this.project_list = res.data;
          }
          else {
            this.message.error(res.msg);
          }
        })
      },
      fetch_activity_list () {
        return fetch.post('/campaign/activity', {
          project_id: this.form.project_id
        }).then( res => {
          if( res.ret == 0 ) {
            this.activity_list = res.data;
          }
          else {
            this.message.error(res.msg);
          }
        })
      },
      onSubmit (form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            fetch.post('/campaign/copy', {
              id: this.campaignId,
              advertiser_id: this.ader_id,
              brand_id: this.form.brand_id,
              product_line: this.form.product_id,
              project_id: this.form.project_id,
              activity_id: this.form.activity_id,
              name: this.form.campaign_name,
              start: this.start_date,
              end: this.end_date,
            }).then( res => {
                if( res.ret == 0) {
                  this.$message.success('复制计划成功');
                  this.$emit('success');
                  this.handleClose();
                }
                else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  })
                }
              }).catch( err=> {
                this.$message({
                  type: 'error',
                  message: err.message
                })
              })
          } else {
            return false;
          }
        });
      },
      onCancel () {
        this.$emit('update:visible', false)
      }
    }
  }
</script>
