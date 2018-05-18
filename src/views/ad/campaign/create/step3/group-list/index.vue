<template>
  <div>
    <div class="hy-card">
      <div class="hy-card__header no-border clearfix">
        <div class="pull-left">
          <span class="title">已选择人群包：
            <span v-if="showClearRadio">
              {{current_name}}
              <!-- <i class="el-icon-edit" @click="open_group_re_edit_dialog(current_group)"></i> -->
              <el-button type="text" @click='clearRadio'>清空选择</el-button>
            </span>
          </span>
        </div>
        <div class="pull-right filter-query">
          <!-- PD上线后恢复 -->
          <!-- <el-select v-model="crowd_type" placeholder="请选择" size="mini" style="width: 25%;">
            <el-option
              v-for="(item) in crowdTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <el-input placeholder="人群包名称查询" v-model="keywords" size="small" style="width:70%">
            <el-button type="primary" slot="append" icon="el-icon-search" @click="fetch_group_list">
            </el-button>
          </el-input>
        </div>
      </div>
      <div class="hy-card__content" style="margin-top: -15px;">
        <!--@current-change="handle_current_change"-->

        <!--  max-height="510" -->
        <el-table size="mini"
          v-loading="isLoading"
          :data="group_list"
          border
          highlight-current-row
          style="width: 100%">
            <el-table-column
              width="50"
              align="center">
              <template slot-scope="scope">
                <!--<el-radio v-model="current_group_id" :label="scope.row.id">&nbsp;</el-radio>-->
                <span  @click="changeCurrent(scope.row)" :class="scope.row.class"></span>
              </template>
            </el-table-column>

            <el-table-column
              prop="id"
              align="center"
              label="人群包编号"
              width="100">
            </el-table-column>

            <el-table-column
              prop="name"
              label="人群包名称"
              width="150">
            </el-table-column>

            <el-table-column
              prop="group_type"
              label="类型"
              width="100"
              :formatter="format_type">
            </el-table-column>

            <el-table-column
              prop="validaty"
              label="有效期"
              width="100">
            </el-table-column>

            <el-table-column
              prop="count"
              label="人群数量"
              width="100">
            </el-table-column>

            <el-table-column label="详情">
              <template slot-scope="scope">
                <div v-html="format_ip_data(scope.row)"></div>
              </template>
            </el-table-column>

            <!-- <el-table-column
              align="center"
              label="操作"
              width="190">
              <template slot-scope="scope">
                  <el-button size="mini"  title="复制" @click="open_group_copy_dialog(scope.row, $event)">
                    <i class="iconfont icon-fuzhi"></i>
                  </el-button>
                <template v-if="scope.row.used == '0'">

                  <el-button  size="mini" icon="el-icon-edit" title="编辑" @click="open_group_edit_dialog(scope.row, $event)">

                  </el-button>
                  <el-button size="mini" icon="el-icon-delete" title="删除" @click="open_group_delete_dialog(scope.row, $event)"></el-button>
                </template>
              </template>
            </el-table-column> -->

            <el-table-column
              align="center"
              label="关联计划"
              width="100">
              <template slot-scope="scope">
                <el-button  size="mini" icon="el-icon-document" title="详情" @click="open_campaign_list(scope.row, $event)">详情</el-button>
              </template>
            </el-table-column>

        </el-table>
        <!-- 增加 分页 -->
        <div class="pagination-wrap clearfix">
            <el-pagination class="pull-right"
              layout="total, sizes, prev, pager, next"
              :total="total"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[5, 10, 20]"
              @size-change="handle_size_change"
              @current-change="handle_page_change"
              >
            </el-pagination>
          </div>
      </div>
    </div>
    <!-- 编辑人群包 （相当于新建）-->
    <el-dialog
      title="编辑人群包"
      :visible.sync="dialog_group_re_edit"
      width="600px">
      <group-create  active-tab="edit"/>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog_group_re_edit=false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialog_group_re_edit=false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑人群包 -->
    <el-dialog
      title="编辑人群包"
      :visible.sync="dialog_group_edit"
      width="600px">
      <group-create :disabled="true" active-tab="edit" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog_group_edit=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handle_group_edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 复制人群包 -->
    <el-dialog
      title="复制人群包"
      :visible.sync="dialog_group_copy"
      width="600px">
      <el-form :model="group_copy" label-width="100px" size="small" ref="form_copy">
         <el-form-item label="人群包名称" prop="name" :rules="[{ required: true, message: '人群包名称不能为空'}]">
           <el-input v-model="group_copy.name"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog_group_copy=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handle_group_copy">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 计划列表 -->
    <campaign-list
      :visible="campaign_list_dialog"
      :group-id="campaign_list_group_id"
      @update:visible="value => campaign_list_dialog = value"
    />
  </div>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  import GroupCreate from '../group-create'
  import CampaignList from './campaign-list'
  // import flat_group from "@/api/flat_group.json"
  import $ from "jQuery"

  export default {
    name:'GroupList',
    data () {
      return {
        group_tags:[],  // 人群包标签库

        campaign_list_group_id: '',
        campaign_list_dialog: false,
        keywords: '',
        current_group_id: '',
        group_list: [],
        dialog_group_re_edit: false,
        dialog_group_edit: false,
        dialog_group_copy: false,
        group_copy: {
          name: ''
        },
        crowd_type:'0',
        crowdTypes:[
          {value:'0', label:'全部'},
          {value:'1',label:"华扬DMP"},
          {value:'2',label:'腾讯DMP'},
          {value:'3',label:'秒针DMP'}
        ],

        typeAry:["","华扬DMP","腾讯DMP","秒针DMP"],
        showClearRadio: false,
        current_name:"",
        radioSt:"radioOff",
        isLoading:false,
        currentPage: 1,
        pageSize: 5,
        total: 0,
      }
    },
    props: {
      activeTab: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapState('ad', [
        'ader_id'
      ]),
      ...mapState('ad/campaign', [
        'group_id'
      ]),
      current_group () {
        var result = this.group_list.filter( item => {
          return item.id == this.group_id;
        });
        if( result.length == 0 ) {
          return {};
        }
        else {
          return result[0]
        }
      }
    },
    created (){
      this.fetch_group_tags().then(()=>{
        this.fetch_group_list();
      });

      this.current_group_id = this.group_id;
    },
    watch : {
      activeTab (value) {
        if( value == 'list') {
          this.current_group_id = '';
          this.fetch_group_list();
        }
      },
      group_id (value){
        this.current_group_id = value;
      }
    },
    methods: {
      ...mapActions('ad/campaign', [
        'update_group_id',
        'update_group_name',
        'padding_group',
        'create_group',
        'update_group'
      ]),
      clearRadio(){
        this.current_group_id = '';
        this.update_group_id('');
        this.showClearRadio = false;
        this.group_list.map( item => {
          item.class = "radioOff";
        })
      },
      fetch_group_list () {
        this.isLoading = true;
        fetch.post('/campaign/group', {
          advertiser_id: this.ader_id,
          keywords: this.keywords,
          group_type: this.crowd_type,
          page: this.currentPage,  
          limit:this.pageSize
        }).then( res => {
          this.isLoading = false;

          if ( res.ret == 0 ) {
            this.total =  isNaN(res.total)?0:parseInt(res.total);
            this.group_list = res.data.map( item => {
              item.checked = false;
              if(item.id==this.group_id){
                this.current_group_id = item.id;
                this.current_name = item.name;
                this.showClearRadio = true;
                item.class = "radioOn"
              }else{
                item.class = "radioOff"
              }
              return item;
            })
          }
          else {
            this.isLoading = false;
            this.$message.error(res.msg);
          }
        }).catch((err)=>{
            this.isLoading = false;
            this.$message.error(err.message);
        });
      },

      changeCurrent(row){
        this.handle_current_change(row);
        // this.current_group_id = row.id;
        // this.current_name = row.name;
        this.showClearRadio = true;
        row.class="radioOn";
        this.group_list.map( item => {
          if(item.id==row.id){
            item.class = "radioOn"
          }else{
            item.class = "radioOff"
          }
        })
      },
      format_type(row, column, value){
        return this.typeAry[Number(value)];
      },
      // 格式化 属性定向的人群包显示
      format_data(value){
        if(!value) {
          return '-';
        }
        var arr = value.split(',');
        return arr.map( item => {
          var data = item.split('=');
          var tmp = {}
          var title = data[0];
          var content = data[1].split('|').join(',');
          return title + ': ' + content;
        }).join('<br />');
      },
      // 格式化 IP定向的人群包显示
      format_ip_data(row){
        var _html="";
        if(row.type=="1"){
          _html="有效期："+row.validaty+"天<br/>";
          var ids = row.tag_ids.split(",");
          let idsary = [];
          ids.forEach(key=>{
            var _ids="";
            this.group_tags.map(flat=>{
              if(flat.tag_id==key){
                _ids = flat.tag_name.split("|").reverse()[0];
              }
            });
            idsary.push(_ids);
          });
          _html+="标签："+idsary.join(",");
        }
        if(row.type=="2"){
          _html="有效期："+row.validaty+"天";
          var fileType=["","Cookie","IDFA","IMEI"];
          _html+="<br/>文件类型："+fileType[Number(row.id_type)];
          _html+=Number(row.encryption)?"<br/>加密：MD5":"";
        }
        if(row.type=="3"){
          _html="有效期："+row.validaty+"天<br/>";
          var tarmode = {clk:"点击找回",url:"网站监测"}
          _html+="定向方式："+tarmode[row.re_target_mode]+"<br/>";
          _html+="数据时间："+row.data_scope_start+"/"+row.data_scope_end+"<br/>内容：";
          if(row.re_target_mode=="clk"){
            var _vary = [];
            $.each(row.idNames,function(i,v){
              _vary.push(v)
            });
            _html+=_vary.join(",");
          }else{
            _html+=row.site_keys;
          }
        }
        return _html
      },
      // 多余的编辑人群包功能（相当于新建人群包）
      open_group_re_edit_dialog(row){
        this.padding_group({
          group_id: row.id,
          group_name: row.name,
          is_save_group: true,
          group_type: row.type,
          group_validaty: row.validaty,
          group_info: row.info,
          group_keys: row.storage && row.storage.split(',') || '',
          group_cookie: row.cookie,
          group_id_type: row.idType == 'IDFA' ? "1" : "2",
          group_device: row.device,
          group_encrypt: row.encrypt,
        })
        this.dialog_group_edit = true;
      },
      // 编辑人群包
      open_group_edit_dialog(row, event){
        debugger;
        event.stopPropagation();
        this.padding_group({
          group_id: row.id,
          group_name: row.name,
          is_save_group: true,
          group_type: row.type,
          group_validaty: row.validaty,
          group_info: row.info,
          group_keys: row.storage && row.storage.split(',') || '',
          group_cookie: row.cookie,
          group_id_type: row.idType == 'IDFA' ? "1" : "2",
          group_device: row.device,
          group_encrypt: row.encrypt,
        })
        this.dialog_group_edit = true;
      },
      handle_group_edit () {
        this.update_group()
          .then( () => {
            this.dialog_group_edit = false;
            this.fetch_group_list();
            this.$message.success('修改人群包成功')
          })
          .catch( err => {
            this.dialog_group_edit = false;
            this.$message.error(err.message);
          })
      },
      // 复制人群包
      open_group_copy_dialog (row, event) {
        event.stopPropagation();
        this.group_copy.name = '';
        this.padding_group({
          group_id: row.id,
          group_name: '',
          is_save_group: true,
          group_type: row.type,
          group_validaty: row.validaty,
          group_info: row.info,
          group_keys: row.storage && row.storage.split(',') || '',
        })
        this.dialog_group_copy = true;
      },
      handle_group_copy () {
        this.$refs.form_copy.validate((valid) => {
          if (valid) {
            this.update_group_name(this.group_copy.name);
            this.create_group().then( () => {
                this.$message.success('复制人群包成功')
                this.fetch_group_list();
                this.dialog_group_copy = false;
              }).catch( err => {
                this.dialog_group_copy = false;
                this.$message.error(err.message)
              })
          }
        });
      },
      // 删除人群包
      open_group_delete_dialog (row, event) {
        event.stopPropagation();
        this.$confirm('你确定要删除该人群包吗?', '提示')
          .then(() => {
            this.handle_group_delete(row.id).then( () => {
              this.fetch_group_list();
              this.$message.success('删除人群包成功')
            }).catch( err => {
              this.$message.error(err.message);
            })
          }).catch( err => {})
      },
      handle_group_delete (id) {
        return new Promise( (resolve, reject) => {
          return fetch.post('/group/remove', {
            id: id
          }).then( res => {
            if( res.ret == 0) {
              resolve(res);
            }
            else {
              reject( new Error(res.msg))
            }
          }).catch( err => {
            reject( err );
          })
        })
      },
      handle_current_change (row){
        if(row) {
          this.current_group_id = row.id;
          this.update_group_id(row.id);
        }
        if(this.current_group_id!=""){
          this.showClearRadio = true;
          this.current_name = row.name;
        }
      },
      open_campaign_list (row, event) {
        event.stopPropagation();
        this.campaign_list_group_id = row.id
        this.campaign_list_dialog = true
      },
      
      /**
       * 改变每页条数
       */
      handle_size_change(size){
        this.pageSize = size;
        this.fetch_group_list();
      },

      /**
       * 改变当前页码
       */
      handle_page_change(currentPage){
        this.currentPage = currentPage;
        this.fetch_group_list();
      },

      /**
       * 获取人群包 标签库
       */
      async fetch_group_tags(){
        this.isLoading = true;
        await fetch.get('/group/tags').then( res => {
          if ( res.ret == 0 ) {
            this.group_tags = res.rawData;
          }
          else {
            this.$message.error("获取人群包标签库失败");
          }
        }).catch((err)=>{
            this.isLoading = false;
            this.$message.error(err.message);
        });
      }
    },
    components: {
      GroupCreate,
      CampaignList
    }
  }
</script>
<style>
  .radioOff{
    background: #fff;
    display: block;
    height: 14px;
    width: 14px;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
  }
  .radioOn{
    background: #409EFF;
    display: block;
    height: 14px;
    width: 14px;
    border-radius: 8px;
    border: 1px solid #409EFF;
    cursor: pointer;
  }

  .filter-query{
    width: 45%;
  }
</style>
