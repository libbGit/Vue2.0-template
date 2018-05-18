<template>
  <el-dialog :visible="visible" :lock-scroll="false" :title="campaignName + '计划 - 创意详情'" @close="handleClose" width="90%">
  <div class="hy-card" style="margin: -40px -20px -20px;">
    <div class="hy-card__header clearfix no-border">
      <div class="pull-left">
        <span class="title"></span>
      </div>
      <div class="pull-right">
        <el-select v-model="audit_status" placeholder="请选择状态" size="mini" style="width: 120px">
          <el-option
            v-for="item in audit_status_list"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="type" placeholder="请选择类别" size="mini" style="width: 120px">
          <el-option
            v-for="item in type_list"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>

        <el-input v-model="keyword" size="mini" style="width:200px;">
        <el-button slot="append" icon="el-icon-search" @click="fetch_list"></el-button>
      </el-input>
      </div>
    </div>
    <div class="hy-card__content" style="margin-top: -15px;">
      <el-table :data="list" size="mini" border>
          <el-table-column
            prop="creativeGroup_name"
            label="创意组" >
            <template slot-scope="scope">
              {{scope.row.creativeGroup_name}}
              <el-button  size="mini" type="text" icon="el-icon-edit"  @click="sendId(scope.row)" title="编辑创意组">
              </el-button>

            </template>
          </el-table-column>
          <el-table-column
            prop="creative_name"
            label="创意名称" >
          </el-table-column>
          <el-table-column
            prop="media_name"
            width="100"
            label="媒体" >
          </el-table-column>
          <el-table-column
            prop="pos_name"
            width="150"
            label="点位" >
          </el-table-column>
          <el-table-column
            prop="pbs_pos_name"
            label="PBS点位">
          </el-table-column>
          <el-table-column
            prop="status"
            width="100"
            align="center"
            label="审核状态" >
            <template slot-scope="scope">
              <el-tooltip v-if='hasTooltip(scope.row)'
                class="item" effect="dark" 
                :content="scope.row['msg']" 
                placement="top">
                <el-tag :type="format_status(scope.row['status']).type">
                  {{format_status(scope.row['status']).text}}
                </el-tag>
              </el-tooltip>
              <el-tag v-else
                :type="format_status(scope.row['status']).type">
                {{format_status(scope.row['status']).text}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            width="100px"
            label="操作" >
            <template slot-scope="scope">
              <el-button  size="mini" icon="el-icon-edit" v-if="editable(scope.row.status)" @click='onEdit(scope.row)' title="编辑创意">
              </el-button>
              <span v-else>--</span>
            </template>
          </el-table-column>
      </el-table>
    </div>
  </div>
    <el-dialog v-if="visibleEditCtv" title="编辑创意"  width="1100px"
      :visible='true' 
      :lock-scroll="false"  
      @close='visibleEditCtv = false'
      append-to-body>
      <form-edit
        @onCancel='visibleEditCtv = false'
        @onSubmit='visibleEditCtv = false'
        :creativeParam='creativeParam'
        url='/creative/view'>
      </form-edit>
    </el-dialog>



</el-dialog>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapGetters, mapActions } from "vuex"
  import FormEdit from '@/views/cm/creativelib/create/form-edit'

  export default {
    name: 'creative-list',
    components: {
      FormEdit
    },
    data () {
      return {
        loading: false,
        list: [],
        audit_status: '1',
        audit_status_list: [{
          name: '全部状态',
          value: '1'
        },{
          name: '审核中',
          value: '2'
        },{
          name: '审核成功',
          value: '3'
        }, {
          name: '审核失败',
          value: '4'
        }],
        type: '',
        type_list: [{
          name: '请选择类别',
          value: ''
        },{
          name: '创意组',
          value: '1'
        },{
          name: '创意名称',
          value: '2'
        },{
          name: '媒体',
          value: '3'
        },{
          name: '点位',
          value: '4'
        }],
        keyword: '',
        visibleEditCtv:false,
        visibleDetailCtv:false,
        creativeParam:{
          ad_id:'',
          creative_id:''
        }//正在编辑的创意的id
      }
    },
    props: {
      visible: {
        type: Boolean
      },
      campaignId: {
        type: String,
        required: true,
      },
      campaignName: {
        type: String,
        required: true,
      }
    },
    computed: {
      ...mapState({
        ader_id: state => state.ad.ader_id
      })
    },
    watch: {
      campaignId () {
        this.fetch_list();
      }
    },
    methods: {
      hasTooltip(obj){
        if (obj.status==4&&obj.msg) {
          return true;
        }
      },
      handleClose () {
        this.$emit('update:visible', false)
      },
      fetch_list () {
        this.loading = true;
        return new Promise( (resolve, reject) => {
          return fetch.post('/plan/creativeList', {
            plan_id: this.campaignId,
            // plan_id: 237,
            status: this.audit_status || '1',
            type: this.type,
            keyword: this.keyword,
          }).then( res => {
              this.loading = false;
              if( res.ret == 0) {
                this.list = res.data;
                resolve();
              }
              else {
                this.list = [];
                reject( new Error(res.msg));
              }
            }).catch( err => {
              this.loading = false;
              reject( err );
            })
        })
      },
      editable(status) {
        return status == '4'
      },
      format_status( status ) {
        if( status == '2') {
          return {
            type: '',
            text: '审核中'
          }
        }
        else if( status == '3') {
          return  {
            type: 'success',
            text: '审核通过'
          }
        }
        else if( status == '4') {
          return {
            type: 'danger',
            text: '审核失败'
          }
        }
        else {
          return {
            type: 'info',
            text: '-'
          }
        }
      },

      sendId(row){  
        let data = {
          id:row.creative_group_id,
          pid:row.plan_id,
          da_id:row.ad_id,
          pos_id:row.pos_id
        }
        this.$emit("editCyMoudel",data)
      },
      onEdit(row){  
        this.visibleEditCtv = true
        // this.creativeParam = {creative_id:cid,ad_id:ad_id};
        this.creativeParam = {creative_id:row.creative_id, plan_id:this.campaignId,ad_id:row.ad_id, creative_group_id:row.creative_group_id};
      },



    }
  }
</script>
