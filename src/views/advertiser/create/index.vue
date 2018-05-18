<template>
  <div class="form-wrap">
    <h2>创建广告主</h2>
    <el-form class="form-container" size="mini" ref="form" :model="form" :rules="rules" label-width="140px">
      <div class="form_left">
      <el-form-item prop="name" label="广告主名称：" >
        <el-input v-model="form.name" placeholder="请输入广告主名称"></el-input>  <!--Bug 9694-->
      </el-form-item>
      <el-form-item prop="type" label="广告主类型：">
        <el-radio-group v-model="form.type">
          <el-radio label="1">直客</el-radio>
          <el-radio label="2">代理商</el-radio>
        </el-radio-group>
        <div v-if="form.type == 2" style="margin-top: 5px;">
          <el-select v-model="form.agent_id" placeholder="请选择">
            <el-option
              v-for="item in agentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="addAgent" style="margin-left: 10px;">添加</el-button>
          <el-button @click="checkAgent">查看</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="industry" label="所属行业：">
        <el-select v-model="form.industry" placeholder="请选择">
          <el-option
            v-for="item in industryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌/事业部：">
        <el-input v-model="form.brand"></el-input>
      </el-form-item>
      <el-form-item label="客户负责人姓名：">
        <el-input v-model="form.customer_contact"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="联系电话：">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item prop="seller_contact" label="销售负责人姓名：">
        <el-input v-model="form.seller_contact"></el-input>
      </el-form-item>
      <el-form-item prop="officer" label="运营执行人：">
        <el-input v-model="form.officer"></el-input>
      </el-form-item>
      </div>
      <div class="form_right">
      <el-form-item prop="licence" label="营业执照：">
        <el-input v-model="form.licence" placeholder="请输入营业执照全称"></el-input>
      </el-form-item>
      <el-form-item prop="licence_pic" label="">
        <el-input v-model="form.licence_pic" class="hidden"></el-input>
        <el-upload v-if="!form.licence_pic"
          action="/api/advertiser/upload"
          :limit="1"
          :before-upload="handle_before_upload_img"
          :on-success="handle_upload_success('licence_pic')"
          :show-file-list="false">
          <el-button><i class="el-icon-plus"></i>上传图片</el-button>
          <span slot="tip" class="el-upload__tip">（仅支持jpg、png，大小3M以内）</span>
        </el-upload>
        <div class="media" v-if="form.licence_pic">
          <div class="media-left">
            <img :src="show_pic(form.licence_pic)">
          </div>
          <div class="media-body">
            <el-button type="text" @click="handle_upload_remove('licence_pic')">删除</el-button><br>
            <el-button type="text" @click="$previewImage(show_pic(form.licence_pic))">查看大图</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="组织机构代码证号：">
        <el-input v-model="form.code" placeholder="请输入组织机构代码证号"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="form.code_pic" class="hidden"></el-input>
        <el-upload v-if="!form.code_pic"
          action="/api/advertiser/upload"
          :limit="1"
          :before-upload="handle_before_upload_img"
          :on-success="handle_upload_success('code_pic')"
          :show-file-list="false">
          <el-button><i class="el-icon-plus"></i>上传图片</el-button>
          <span slot="tip" class="el-upload__tip">（仅支持jpg、png，大小3M以内）</span>
        </el-upload>
        <div class="media" v-if="form.code_pic">
          <div class="media-left">
            <img :src="show_pic(form.code_pic)">
          </div>
          <div class="media-body">
            <el-button type="text" @click="handle_upload_remove('code_pic')">删除</el-button><br>
            <el-button type="text" @click="$previewImage(show_pic(form.code_pic))">查看大图</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="法人身份证照片：">
        <el-input v-model="form.id_card" class="hidden"></el-input>
        <el-upload v-if="!form.id_card"
          action="/api/advertiser/upload"
          :limit="1"
          :before-upload="handle_before_upload_img"
          :on-success="handle_upload_success('id_card')"
          :show-file-list="false">
          <el-button><i class="el-icon-plus"></i>上传图片</el-button>
          <span slot="tip" class="el-upload__tip">（仅支持jpg、png，大小3M以内）</span>
        </el-upload>
        <div class="media" v-if="form.id_card">
          <div class="media-left">
            <img :src="show_pic(form.id_card)">
          </div>
          <div class="media-body">
            <el-button type="text" @click="handle_upload_remove('id_card')">删除</el-button><br>
            <el-button type="text" @click="$previewImage(show_pic(form.id_card))">查看大图</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="税务登记证照片：">
        <el-input v-model="form.tax_pic" class="hidden"></el-input>
        <el-upload v-if="!form.tax_pic"
          action="/api/advertiser/upload"
          :limit="1"
          :before-upload="handle_before_upload_img"
          :on-success="handle_upload_success('tax_pic')"
          :show-file-list="false">
          <el-button><i class="el-icon-plus"></i>上传图片</el-button>
          <span slot="tip" class="el-upload__tip">（仅支持jpg、png，大小3M以内）</span>
        </el-upload>
        <div class="media" v-if="form.tax_pic">
          <div class="media-left">
            <img :src="show_pic(form.tax_pic)">
          </div>
          <div class="media-body">
            <el-button type="text" @click="handle_upload_remove('tax_pic')">删除</el-button><br>
            <el-button type="text" @click="$previewImage(show_pic(form.tax_pic))">查看大图</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="ICP：">
        <el-input v-model="form.icp" class="hidden"></el-input>
        <el-upload v-if="!form.icp"
          action="/api/advertiser/upload"
          :limit="1"
          :before-upload="handle_before_upload_img"
          :on-success="handle_upload_success('icp')"
          :show-file-list="false">
          <el-button><i class="el-icon-plus"></i>上传图片</el-button>
          <span slot="tip" class="el-upload__tip">（仅支持jpg、png，大小3M以内）</span>
        </el-upload>
        <div class="media" v-if="form.icp">
          <div class="media-left">
            <img :src="show_pic(form.icp)">
          </div>
          <div class="media-body">
            <el-button type="text" @click="handle_upload_remove('icp')">删除</el-button><br>
            <el-button type="text" @click="$previewImage(show_pic(form.icp))">查看大图</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="其它资质：">
        <el-input v-model="form.others" class="hidden"></el-input>
        <el-upload v-if="!form.others"
          :before-upload="handle_before_upload"
          action="/api/advertiser/upload"
          :limit="1"
          :on-success="handle_upload_success('others')"
          :show-file-list="false">
          <el-button><i class="el-icon-plus"></i>添加附件</el-button>
          <span slot="tip" class="el-upload__tip">（仅支持jpg、zip，大小3M以内）</span>
        </el-upload>
        <div class="media" v-if="form.others">
          <div class="media-left">
            <input type="text" :value="form.others" readonly/>
          </div>
          <div class="media-body">
            <el-button type="text" @click="handle_upload_remove('others')">删除</el-button><br>
          </div>
        </div>
      </el-form-item>
      </div>
      <div class="form_bottom">
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
      </div>
    </el-form>
    <!-- 添加代理 -->
    <dialog-agent-add :visible="dialogAgentAdd" @update:visible="value => dialogAgentAdd = value" />

    <!-- 查看代理 -->
    <dialog-agent-list :visible="dialogAgentList" @update:visible="value => dialogAgentList = value" />
  </div>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  import DialogAgentAdd from './dialog-agent-add'
  import DialogAgentList from './dialog-agent-list'

  export default {
    name: 'AdvertiserCreate',
    data () {
      return {
        form: {
          name: '',
          type: '',
          agent_id: '',
          industry: '',
          brand: '',
          customer_contact: '',
          phone: '',
          seller_contact:'',
          officer: '',
          licence: '',
          licence_pic: '',
          code: '',
          code_pic: '',
          id_card: '',
          tax_pic: '',
          icp:'',
          others:''
        },
        dialogAgentAdd: false,
        dialogAgentList: false,
        rules: {
          name: [
            { required: true, message: '请输入广告主名称', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入广告主类型', trigger: 'blur' }
          ],
          industry: [
            { required: true, message: '请选择所属行业', trigger: 'blur' }
          ],
          phone: [
            {
              validator: (rule, value, callback) => {
                if( value && (!/^\d+$/.test(value)) ) {
                  callback(new Error('请输入正确的格式'));
                }
                else {
                	callback();
                }
              },
              trigger: 'blur'
            }
          ],
          seller_contact: [
            { required: true, message: '请输入销售负责人姓名', trigger: 'blur' }
          ],
          officer: [
            { required: true, message: '请输入运营执行人', trigger: 'blur' }
          ],
          licence: [
            { required: true, message: '请输入营业执照信息', trigger: 'blur' }
          ],
          licence_pic: [
            { required: true, message: '请上传营业执照扫描件', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        industryList: state => state.advertiser.industryList,
        agentList: state => state.advertiser.agentList
      })
    },
    methods: {
      ...mapActions('advertiser', [
        'fetch_industry_list',
        'fetch_agent_list'
      ]),
      handle_before_upload(file) {
        var flag = true;
        const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg';
        const isLt3M = file.size / 1024 / 1024 < 3;

        if (!isJPG && file.name.indexOf('zip') == -1 ) {
          flag = false
          this.$message.error('上传附件只能是 jpg 或 zip 格式!');
        }
        if (!isLt3M) {
          flag = false
          this.$message.error('上传附件大小不能超过 3MB!');
        }
        return flag;
      },
      getSuffixName(str){
        let index = str.lastIndexOf('.')+1;
        return str.substring(index,str.length);
      },
      handle_before_upload_img(file) {
        var flag = true;
        const isJPG = file.type === 'image/jpg' || file.type === 'image/png';
        const isLt3M = file.size / 1024 / 1024 < 3;
        let fileSuffix = this.getSuffixName(file.name).toLowerCase();

        if (!isJPG && ['jpg','png'].indexOf(fileSuffix)==-1 ) {
          flag = false
          this.$message.error('上传附件只能是 jpg 或 png 格式!');
        }
        if (!isLt3M) {
          flag = false
          this.$message.error('上传附件大小不能超过 3MB!');
        }
        return flag;
      },
      handle_upload_success(name){
        var _this = this;
        return function(res){
          if (res.ret == 0) {
            _this.form[name] = res.data.url;
          }
          else {
            this.$message.error(res.msg || '上传错误')
          }
        }
      },
      handle_upload_remove(name) {
        this.form[name] = '';
      },
      show_pic (url) {
        return this.$host + url;
      },
      addAgent () {
        this.dialogAgentAdd = true;
      },
      checkAgent () {
        this.dialogAgentList = true;
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            var loading = this.$loading({
              text: '提交中...',
              background: 'rgba(255,255,255,.8)'
            })
            fetch.post('/advertiser/add', this.form)
              .then( res => {
                loading.close();
                if(res.ret == 0) {
                  this.$alert('创建广告主成功', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push({
                        path: '/advertiser'
                      })
                    }
                  });
                }
                else {
                  this.$alert(res.msg, '提示');
                }
              })
              .catch( err => {
                loading.close();
                console.log(err);
              })
          } else {
            return false;
          }
        })
      },
      onCancel () {
        this.$router.push({
          path: '/advertiser'
        })
      }
    },
    created (){
      this.fetch_industry_list();
      this.fetch_agent_list();
    },
    components: {
      DialogAgentAdd,
      DialogAgentList
    }
  }
</script>
<style scoped>
.form_right{
  height: 395px;
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
</style>
