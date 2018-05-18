<template>
  <div>
    <el-form label-width="120px" size="mini">
      <el-form-item label="人群包名称:" prop="group_name">
        <el-input :value="group_name" @input="update_group_name" style="width: 200px;"></el-input>
        <el-checkbox :value="is_save_group" @input="update_is_save_group" :disabled="disabled" style="margin-left: 15px;">
          保存为常用人群包
        </el-checkbox>
      </el-form-item>
      <el-form-item label="有效期:" prop="group_type">
        <el-radio-group :value="group_validaty" @input="update_group_validaty">
          <el-radio label="30">30天</el-radio>
          <el-radio label="60">60天</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="定向类型:" prop="group_type">
        <el-radio-group :value="group_type" @input="update_group_type">
          <el-radio label="1">属性定向</el-radio>
          <el-radio label="2">ID 定向</el-radio>
          <el-radio label="3">重定向</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <template v-if="group_type == '1'">
          <group-tree
            :checked-keys="group_keys"
            @keys-change="update_group_keys"
            @data-change="update_group_info"
          />
        </template>
        <template v-if="group_type == '2'">
          <div>
            <div class="title">PC定向</div>
            <el-form-item label="Cookie文件:">
              <el-input :value="group_cookie" readonly class="upload_input"></el-input>
              <div class="upload_wrap">
                <el-upload v-if="!group_cookie"
                           :before-upload="handle_before_upload"
                           action="/api/advertiser/upload"
                           :limit="1"
                           :on-success="handle_upload_success('group_cookie')"
                           :show-file-list="false">
                  <el-button><i class="el-icon-plus"></i>上传</el-button>
                </el-upload>
                <el-button v-if="group_cookie" type="text" @click="handle_upload_remove('group_cookie')">删除</el-button>
              </div>
              <div class="el-upload__tip">支持csv、txt格式文件</div>
            </el-form-item>
          </div>
          <div>
            <div class="title">移动定向</div>
            <el-form-item label="设备号类型:">
              <el-radio-group :value="group_id_type" @input="update_group_id_type">
                <el-radio label="1">IDFA</el-radio>
                <el-radio label="2">IMEI</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文件上传:">
              <el-input :value="group_device" readonly class="upload_input"></el-input>
              <div class="upload_wrap">
                <el-upload v-if="!group_device"
                           :before-upload="handle_before_upload"
                           action="/api/advertiser/upload"
                           :limit="1"
                           :on-success="handle_upload_success('group_device')"
                           :show-file-list="false">
                  <el-button><i class="el-icon-plus"></i>上传</el-button>
                </el-upload>
                <el-button v-if="group_device" type="text" @click="handle_upload_remove('group_device')">删除</el-button>
              </div>
              <div>
                <el-checkbox :value="group_encrypt" @input="update_group_encrypt">手机号使用MD5加密</el-checkbox>
              </div>
              <div class="el-upload__tip">支持csv、txt格式文件</div>
            </el-form-item>
          </div>
        </template>
        <template v-if="group_type == '3'">
          <!-- <rqb-create></rqb-create> -->
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex';
  import GroupTree from './group-tree'
  // import rqbCreate from './rqb-create'

  export default {
    name: 'create-group',
    props: {
      disabled : {
        type: Boolean,
        default: false
      },
      activeTab: {
        type: String,
        required: true
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'group_name',
        'is_save_group',
        'group_type',
        'group_validaty',
        'group_info',
        'group_keys',
        'group_cookie',
        'group_id_type',
        'group_device',
        'group_encrypt',
      ])
    },
    watch : {
      activeTab (value) {
        if( value == 'create') {
          this.padding_group({});
          this.update_group_id = '';
        }
      }
    },
    methods: {
      ...mapActions('ad/campaign', [
        'padding_group',
        'update_group_id',
        'update_group_name',
        'update_is_save_group',
        'update_group_type',
        'update_group_validaty',
        'update_group_info',
        'update_group_keys',
        'update_group_cookie',
        'update_group_id_type',
        'update_group_device',
        'update_group_encrypt',
      ]),
      handle_before_upload(file) {
        var flag = true;
        const isJPG = file.type === 'text/plain' || file.type === 'text/csv';
        const isLt3M = file.size / 1024 / 1024 < 10;

        if (!isJPG && file.name.indexOf('zip') == -1 ) {
          flag = false
          this.$message.error('上传附件只能是 txt 或 csv 格式!');
        }
        // if (!isLt3M) {
        //   flag = false
        //   this.$message.error('上传附件大小不能超过 10MB!');
        // }
        return flag;
      },
      handle_upload_success(name){
        var _this = this;
        return function(res){
          if( name == 'group_cookie') {
            _this.update_group_cookie(res.data.url)
          }
          else {
            _this.update_group_device(res.data.url);
          }
        }
      },
      handle_upload_remove(name) {
        if( name == 'group_cookie') {
          this.update_group_cookie('')
        }
        else {
          this.update_group_device('');
        }
      },
    },
    components: {
      GroupTree,
      // rqbCreate
    }
  }
</script>
<style scoped>
  .wrap {
    display: flex;
  }
  .wrap .left {
    width: 80px;
    flex: none;
  }
  .wrap .right {
    flex: auto;
  }
  .upload_input {
    width: 200px;
    vertical-align: top;
  }
  .upload_wrap {
    display: inline-block;
  }
</style>
