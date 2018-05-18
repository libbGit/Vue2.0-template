<template>
  <div class="m__content">
    <!-- 导航栏 -->
    <div class="clearfix nav-wrap">
      <div class="pull-left">
        <activity-nav />
      </div>
    </div>

    <div class="campaign__wrap" v-loading="isLoading">
      <campaign-steps />
      <!-- <a href="@/assets/test.mp4" >222</a> -->
      <div class="form-wrap" style="padding-top:0px;">
        <div class="hy-card">
          <div class="btn-wrap">
            <el-button size="small" style="float:left" type="primary" @click="onCreate">新建创意组</el-button>
            <el-button size="small" @click="handle_prev()">上一步</el-button>
            <el-button size="small" type="success" @click="handle_save_push">保存并推送PBS</el-button>
            <el-button size="small" type="primary" @click="handle_save" tem-disabled>保存</el-button>
            <!-- <el-button size="small" @click="handle_cancel">取消</el-button> -->
          </div>
          <div class="hy-card__content" style="margin-top: -15px;">
            <el-table border size="mini" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
              <el-table-column type="selection" width="40">
              </el-table-column>

              <el-table-column prop="id" label="ID" width="60">
              </el-table-column>
              <el-table-column label="创意组名称" prop="name" width="200">
              </el-table-column>
              <el-table-column label="创意组模式" width="120">
                <template slot-scope="scope">
                  {{creativeMode(scope.row['status'])}}
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="120" prop='create_time'>
              </el-table-column>
              <el-table-column label="操作状态" width="100">
                <template slot-scope="scope">
                  <el-tag :type="formatOperationStatus(scope.row['ad_status'],scope.row['pushed']).type">
                    {{formatOperationStatus(scope.row['ad_status'],scope.row['pushed']).text}}
                    </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  
                  <template v-if="scope.row.pushed==0">
                    <el-button type="text" @click="onPush(scope.row)">推送</el-button>
                    <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="onDelete(scope.row,scope.$index)">删除</el-button>
                  </template>
                  <template v-else>
                    <el-button type="text" @click="onDetail(scope.row)">详情</el-button>
                    <el-button type="text" @click="onArchive(scope.row,scope.$index)">归档</el-button>
                    <el-button type="text" @click="onPause(scope.row)" v-if="scope.row.ad_status=='1'">暂停</el-button>
                    <el-button type="text" @click="onOpen(scope.row)" v-else >开启</el-button>
                    <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-wrap clearfix">
              <el-pagination class="pull-right" 
                layout="total, sizes, prev, pager, next" 
                :total="total" 
                :current-page="currentPage" 
                :page-size="pageSize"
                :page-sizes="[5, 10,15]" 
                @size-change="handle_size_change"
                @current-change="handle_page_change">
              </el-pagination>
            </div>
          </div>
        </div>

      </div>
    </div>
    <create-edit-creative-group 
      v-if="isOpenCreativeDialog"
      :isOpen.sync='isOpenCreativeDialog' 
      :creativeGroupid='currentCreativeGroupID'
      :type='cgType'
      @refreshList='refreshList'
    />

    <el-dialog title="创意组详情" width='1000px' :visible="true"  
      @close='creativeGroupDetailDiag=false' 
      v-if='creativeGroupDetailDiag'>
      <creative-group-detail 
        :id='currentCreativeGroupID' 
        :plan_id='campaign_id+""' 
      />
    </el-dialog>
  </div>
</template>
<script>
  import {
    mapState,
    mapGetters,
    mapActions
  } from "vuex";
  import ActivityNav from "@/views/ad/public/activity-nav";
  import CampaignSteps from "../public/campaign-steps";
  import CreativeGroupDetail from "@/views/ad/creative-group/detail-core";
  import CreateEditCreativeGroup from "./create-edit-creative-group";
  import fetch from "@/services/fetch";
  import _ from "lodash";

  export default {
    name: "CampaignStep4",
    components: {
      ActivityNav,
      CampaignSteps,
      CreateEditCreativeGroup,
      CreativeGroupDetail
    },
    data() {
      return {
        cgType:'create',//create新建  editBefore推送前编辑 editAfter推送后编辑
        selection:[],//用户选择的表单项
        isLoading:false,
        currentCreativeGroupID:'',//当前操作的创意组的id.
        creativeGroupDetailDiag:false,//创意组详情窗口是否显示
        tableData:[],
        total:0,//总页码
        currentPage:0,//当前页码
        pageSize:5,//每页请求的数据条数
        isOpenCreativeDialog: false, //是否显示创意组编辑新建弹窗

      };
    },
    computed: {
      ...mapState("ad", [
        "ader_id",
        "activity_id",
        "ader_id",
        "ader_name",
        "brand_id",
        "brand_name",
        "product_id",
        "product_name",
        "project_id",
        "project_name",
        "activity_id",
        "activity_name",
        "campaign_id",
        "campaign_name"
      ]),
      ...mapState("ad/campaign", [
        "ad_pos_list",
        "ad_pos",
        "zone_info",
        "campaign_audit_status"
      ]),
      ...mapGetters("ad/campaign", ["ad_pos_selected"]),
      seleted_pos_list() {
        return this.ad_pos_list.filter(row => {
          return this.ad_pos_selected.indexOf(row.id) > -1;
        });
      }
    },
    created() {
      this.update_step_index(3);
      this.getCreativeGroupList();
    },
    methods: {
      ...mapActions("ad/campaign", [
        "update_step_index",
        "create_campaign_step4",
        "push_campaign",
        "update_zone_info"
      ]),
      onCreate(){
        this.cgType='create';
        this.isOpenCreativeDialog=true;
      },
      /**
       * [onEdit 编辑]
       * @param  {[type]} obj [description]
       * @return {[type]}     [description]
       */
      onEdit(obj){
        if (obj.pushed!='0') {
          this.cgType='editAfter';
        }else{
          this.cgType='editBefore';
        }
        this.currentCreativeGroupID = obj.id-0;
        this.isOpenCreativeDialog=true;
      },
      //操作状态  1运行 0暂停
      formatOperationStatus(status,pushed) {
        var _status;
        if (pushed==0) {
          _status = -1;
        }else{
          _status = status - 0;
        }
        var result = {};
        switch (_status) {
          case 1:
            result = {
              type: "success",
              text: "正常"
            };
            break;
          case 0:
            result = {
              type: "warning",
              text: "已暂停"
            };
            break;
          case -1:
            result = {
              type: "",
              text: "--"
            };
            break;
          default:
        }
        return result;
      },
      refreshList(){
        this.getCreativeGroupList();
      },
      /**
       * [onArchive 归档动作]
       * @param  {[type]} item  [对象]
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      onArchive(item,index){
        this.$confirm('您确定要归档此创意组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isLoading = true;
          let params = {
            status:1,
            creative_group_id:item.id,
            ad_id:item.ad_id
          };
          fetch.post("/creative_group/archive",params)
            .then(res => {
              this.isLoading = false;
              if (res.ret == 0) {
                this.tableData.splice(index,1);
                // resolve();
              } else {
                this.$message.error('归档失败请稍后重试');
              }
            })
            .catch(err => {
              this.isLoading = false;
              this.$message.error('归档失败请稍后重试');
            });
          
        }).catch(() => {
          
        });

      },
      /**
       * [onDetail 详情]
       * @param  {[type]} obj [description]
       * @return {[type]}     [description]
       */
      onDetail(obj){
        this.creativeGroupDetailDiag = true;
        this.currentCreativeGroupID = obj.id-0;
      },
      /**
       * [onPush 单独的推送]
       * @param  {[type]} obj [description]
       * @return {[type]}     [description]
       */
      onPush(obj){
        this.isLoading = true;
        this.fetch_push(obj.id).then(res => {
          obj.pushed = '1';
          obj.ad_status = '1';
          // pbs_plan_id
        })
      },
      
      /**
       * [onDelete 删除]
       * @param  {[type]} obj   [description]
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      onDelete(obj,index){
        this.$confirm('您确定要删除此创意组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            plan_id:this.campaign_id,
            creative_group_id:obj.id
          };
          this.isLoading = true;
          fetch.post("/creative_group/delete",params)
            .then(res => {
              this.isLoading = false;
              if (res.ret == 0) {
                this.tableData.splice(index,1);
              } else {
                this.$message.error(res||'删除失败请稍后重试');
              }
            })
            .catch(err => {
              this.isLoading = false;
              this.$message.error('删除失败请稍后重试');
            });
          
        }).catch(() => {
          
        });

        
      },
      /**
       * [onPause 暂停]
       * @param  {[type]} obj [description]
       * @return {[type]}     [description]
       */
      onPause(obj){
        this.fetch_set_status({creative_group_id:obj.id,ad_status:0}).then(()=>{
          obj.ad_status = '0';
        });
      },
      /**
       * [onOpen 开启]
       * @param  {[type]} obj [description]
       * @return {[type]}     [description]
       */
      onOpen(obj){
        this.fetch_set_status({creative_group_id:obj.id,ad_status:1}).then(()=>{
          obj.ad_status = '1'; 
        });
      },
      /**
       * [fetch_set_status 暂停开启使用的ajax]
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      fetch_set_status(data){
        this.isLoading = true;
        return new Promise((resolve, reject) => {
          return fetch.post("/creative_group/status",data)
            .then(res => {
              this.isLoading = false;
              if (res.ret == 0) {
                resolve();
              } else {
                reject(res.msg||'操作失败');
                this.$message.error(res.msg||'操作失败，请稍后重试');
              }
            })
            .catch(err => {
              this.isLoading = false;
              reject(err||'操作失败');
              this.$message.error(err||'操作失败，请稍后重试');
            });
        });
      },
      fetch_push(ids){
        return new Promise( (resolve, reject) => {
          return fetch.post('/campaign/step', {
            id: this.campaign_id,
            creative_group_ids: ids
          }).then( res => {
            if( res.ret == 0 ) {
              fetch.post('/campaign/push', {
                id: this.campaign_id
              }).then( res => {
                if( res.ret == 0 ) {
                  this.isLoading = false;
                  resolve(res)
                }else {
                  this.isLoading = false;
                  this.$message.error(res.msg||'推送失败，请稍后重试');
                  reject(new Error(res.msg))
                }
              }).catch( err => {
                this.isLoading = false;
                this.$message.error(err.msg||'推送失败，请稍后重试');
                reject( err )
              })
            }else {
              this.isLoading = false;
              this.$message.error(res.msg||'推送失败，请稍后重试');
              reject(new Error(res.msg))
            }
          }).catch( err => {
            this.isLoading = false;
            this.$message.error(err.msg||'推送失败，请稍后重试');
            reject( err )
          })
        })
      },
      /**
       * [creativeMode 创意组模式显示]
       * @param  {[type]} state [description]
       * @return {[type]}       [description]
       */
      creativeMode(state){
        if (state==1) {
          return '随机投放'
        }else if (state==2) {
          return '顺序轮播'
        }else if (state==3) {
          return '权重轮播'
        }else{
          return '未知'
        }
      },

      /**
       * [handleSelectionChange 当选择项发生变化时会触发该事件]
       * @return {[type]} [description]
       */
      handleSelectionChange(val){
        this.selection = val;
      },
      //翻页
      handle_page_change(currentPage){
        this.currentPage = currentPage;
        this.getCreativeGroupList();
      },
      // 每页请求的数据条数
      handle_size_change(size){
        this.pageSize = size;
        this.getCreativeGroupList();
      },
      /**
       * [getCreativeGroupList 从服务端获取创意组列表]
       * @return {[type]} [description]
       */
      getCreativeGroupList() {
        let project_id = this.project_id;
        let activity_id = this.activity_id;
        let campaign_id = this.campaign_id;
        let name = this.searchVal;
        let status = 0;

        let page = this.currentPage;
        let limit = this.pageSize;
        this.isLoading = true;
        fetch
          .post("/creative_group/list", {
            activity_id,
            project_id,
            campaign_id,
            name,
            status,
            page,
            limit
          })
          .then(res => {
            this.isLoading = false;
            if (res.ret == 0 && Array.isArray(res.data)) {
              this.tableData = res.data;
              this.total = isNaN(res.total - 0) ? 0 : res.total - 0;
            } else {
              this.$message.error("获取创意组列表失败，请稍后重试");
              console.error("res.ret不等于0");
            }
          })
          .catch(err => {
            this.isLoading = false;
            this.$message.error("获取创意组列表失败，请稍后重试");
            console.error(err || "/creative_group/list");
          });
      },
      /**
       * [handle_save 保存]
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      handle_save(formName) {
        this.$router.push('/ad/campaign/manage')
      },
      /**
       * [handle_save_push 保存并推送]
       * @return {[type]} [description]
       */
      handle_save_push() {
        // let arr = _.filter(this.selection, {"pushed":"0"});
        if (this.selection.length) {
          let ids = this.selection.map(item=>item.id).join(',');
          this.isLoading = true;          
          this.fetch_push(ids).then(res=>{
            this.$router.push('/ad/campaign/manage')
          });
        }else{
          this.$message.error("请先选择要保存并推送的创意组");
        }
      },
      /**
       * [handle_cancel 点击取消按钮]
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      handle_cancel(formName) {
        this.$confirm("取消后你将会丢失创建的计划内容?", "提示", {
          type: "warning"
        }).then(() => {
          this.$router.push("/ad/campaign/manage");
        });
      },

      //fix bug 9874
      handle_prev() {
        this.$router.push("step3");
      },

    },
    
  };

</script>
