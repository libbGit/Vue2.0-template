<template>
  <div class="dialog-wrap">
    <template v-if="brand_forms.length">
      <table class="hy-table">
        <tr>
          <th>品牌</th>
          <th>行业</th>
          <th>产品线</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in brand_forms">
          <td>{{item.brand}}</td>
          <td>{{getIndustry(item.industry)}}</td>
          <td>{{formatProduct(item.products)}}</td>
          <td>
            <el-button type="text" size="mini" @click="editBrand(item)">编辑</el-button>
            <el-button type="text" size="mini" @click="delBrand(item)">删除</el-button>
          </td>
        </tr>
      </table>
      <br>

    </template>

    <p v-if="!brand_forms.length" style="text-align: center;">
      暂无品牌产品线
    </p>


    <el-dialog :visible.sync="brand_dialog" :lock-scroll="false"
        :title="brand_dialog_title"
        width="360px"
        top="18vh"
        append-to-body>
      <div>
        <el-form size="mini" label-width="80px" :model="current_form" ref="current_form" :rules="rules">
          <el-form-item label="品牌：" prop="brand">
            <el-input v-model="current_form.brand" class="input-120"/>
          </el-form-item>
          <el-form-item label="行业：" prop="industry">
            <!-- <el-input v-model="current_form.industry" class="input-120" /> -->
            <el-select v-model="current_form.industry" placeholder="请选择" class="input-120">
              <el-option
                v-for="item in industryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品线：">
            <div v-for="(product, index) in current_form.products" class="product-input-wrap">
              <el-input v-model="product.name" class="input-120" />
              <div class="option-wrap">
                <el-button type="text" v-if="current_form.products.length > 1" @click="removeProduct(current_form, index)"><i class="el-icon-delete"></i></el-button>
                <el-button type="text" @click="addProduct(current_form)"><i class="el-icon-plus"></i></el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="">
          <el-button type="primary" @click="onSubmit(current_form)" size="mini">保存</el-button>
          <el-button @click="onCancel" size="mini">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import _ from "lodash";
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'

  // 空白的 brand
  var emptyForm =function () {
    return {
      brand_id:'',
      brand: '',
      industry: '',
      products: [{
        id:'',
        name:''
      }]
    }
  }
  export default {
    name: 'dialog_brand',
    props: ['aderId'],
    computed: {
      ...mapState({
        industryList: state => state.advertiser.industryList,
        brand_forms: state => state.advertiser.brand_forms
      })
    },
    data () {
      return {
        brand_dialog_title: '新建品牌/产品线',
        brand_dialog: false,
        current_form: emptyForm(),
        rules: {
          brand: [
            { required: true, message: '请输入品牌', trigger: 'change' }
          ]
        }
      }
    },
    created () {
    },
    methods: {
      ...mapActions('advertiser', [
        'fetch_brand_form'
      ]),
      getIndustry(industry_id){
        let obj = _.find(this.industryList,{id:industry_id});
        if (obj) {
          return obj.name;
        }
        return '';
      },
      addBrand() {
        this.brand_dialog_title = '添加品牌/产品线';
        this.brand_dialog = true;
        this.current_form = emptyForm();
      },
      editBrand(form){
        this.brand_dialog_title = '编辑品牌/产品线';
        this.brand_dialog = true;
        this.current_form = this.$deepClone(form);
        // 如果产品线没有则新增一个空数据
        if( this.current_form.products &&  !this.current_form.products.length) {
          this.current_form.products.push({
            id:'',
            name:''
          })
        }
      },
      delBrand(item) {
        var ader_id = this.aderId;
        this.$confirm('你确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll: false,
          type: 'warning'
        }).then( () => {
          fetch.post('/brands/del', {
            brand_id: item.brand_id
          }).then( res => {
            if(res.ret == 0) {
              this.fetch_brand_form(ader_id);
            }
            else {
              alert(res.msg);
            }
          }).catch( err => {
            alert(err.message);
          })
        })
      },
      addProduct (form) {
        form.products.push({
          id:'',
          name:''
        })
      },
      removeProduct (form, index) {
        form.products.splice(index, 1);
      },
      clearProductEmpty(arr){
        let products = arr.products;
        if (Array.isArray(products)) {
          products = _.remove(products, function(n) {
            return _.trim(n.name) == '';
          });
          
        }
      },
      onSubmit (form) {
        var _this = this;
        var ader_id = this.aderId;
        this.$refs['current_form'].validate((valid) => {
          if (valid) {
            var data = _.cloneDeep(form);
            this.clearProductEmpty(data);
            data.ader_id = ader_id;
            if(data.brand_id) {
              var url = '/brands/edit'
            }
            else {
              var url = '/brands/add';
            }
            fetch.post(url, data)
              .then( res => {
                // debugger
                if (res.ret==0) {
                  _this.fetch_brand_form(ader_id)
                    .then( () => {
                      _this.brand_dialog = false;
                    })
                    .catch( err => {
                      alert(err.message);
                      _this.brand_dialog = false;
                    })
                }else{
                  this.$message.error(res.msg||'操作失败，请稍后重试');
                }
                
              })
          } else {
            return false;
          }
        });
      },
      onCancel () {
        this.brand_dialog = false;;
      },
      formatProduct (products) {
        return products.map( product => {
          return product.name;
        }).join(', ')
      }
    }
  }
</script>
<style scoped>
  .dialog-wrap {
    margin: -30px auto;
  }
  .input-120 {
    width: 150px;
  }
  .product-input-wrap + .product-input-wrap {
    margin-top: 10px;
  }
  .option-wrap {
    display: inline-block;
    padding-left: 10px;
  }
  .option-wrap i {
    font-size: 15px;
    color: #333;
  }
  .option-wrap i:hover {
    color: #409EFF;
  }
</style>
