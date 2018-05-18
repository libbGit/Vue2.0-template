<template>
<div>
  <div>点位选择</div>
  <el-table border size="mini" ref="include_table" max-height="300" class="pos-table"
    :data="ad_pos_list"
    style="width: 100%;"
    @selection-change="handle_include_selection_change"
    @select-all='handle_include_select'
    @select="handle_include_select">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="media_name"
      label="媒体"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      width="200"
      label="点位">
    </el-table-column>
    <el-table-column
      prop="dealID"
      label="dealID">
    </el-table-column>
  </el-table>

  <div>点位排除</div>
  <el-table border size="mini" ref="exclude_table" max-height="300" class="pos-table"
    :data="ad_pos_list"
    style="width: 100%;"
    @selection-change="handle_exclude_selection_change"
    @select="handle_exclude_select">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="media_name"
      label="媒体"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      width="200"
      label="点位">
    </el-table-column>
    <el-table-column
      prop="dealID"
      label="dealID">
    </el-table-column>
  </el-table>
</div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import fetch from '@/services/fetch'
  export default {
    name: 'media-config',
    data () {
      return {
        selection_include: [],
        selection_exclude: [],
        defaultProps: {
          children: 'pos',
          label: 'name'
        }
      }
    },
    props: {
      check: {
        type: Boolean,
        required: true,
      }
    },
    computed: {
      ...mapState('ad',[
        'ader_id'
      ]),
      ...mapState('ad/campaign',[
        'campaign_update_type',
        'ad_pos_list',
        'ad_pos',
        'ad_pos_except',
        'platform_id',
        'mediatype_id',
        'channel_id',
        'position_id',
        'adform_id',
      ]),
      include_rows () {
        return this.ad_pos_list.filter( row => {
          return this.ad_pos.indexOf(row.id) > -1
        })
      },
      exclude_rows () {
        return this.ad_pos_list.filter( row => {
          return this.ad_pos_except.indexOf(row.id) > -1
        })
      },
      all_pos () {
        return this.ad_pos_list.map( item => item.id)
      }
    },
    watch: {
      platform_id () {
        this.fetch_media_list()
      },
      mediatype_id () {
        this.fetch_media_list()
      },
      channel_id () {
        this.fetch_media_list()
      },
      position_id () {
        this.fetch_media_list()
      },
      adform_id () {
        this.fetch_media_list()
      },
      // 不勾选怎默认选择全部点位  产品的傻逼需求 
      check (value) {
        if ( !value ) {
          //为false表示，媒体定向不选择，则之前选择的平台也应清空
          this.fetch_media_list().then(()=>{    //bug  9876  
            this.update_ad_pos(this.all_pos);   // 必须等到this.all_pos 异步更新后，才能执行update
            this.update_ad_pos_except([]);
          })
        }
        else {
          this.check_row();
        }
      }
    },
    created () {
      this.fetch_media_list()
        .then( () => {
          // 新建选择全部点位
          if( this.campaign_update_type == 'create' ) {
            this.update_ad_pos(this.all_pos);
          }
          this.check_row();
        })
        .catch( err => {
          console.log(err);
        })
    },
    methods: {
      ...mapActions('ad/campaign',[
        'update_ad_pos_list',
        'update_ad_pos',
        'update_ad_pos_except',
      ]),
      // 选中复选框
      check_row () {
        this.$nextTick(function(){
          this.$refs.include_table.clearSelection()
          this.include_rows.forEach(row => {
            this.$refs.include_table.toggleRowSelection(row, true);
          })
          this.$refs.exclude_table.clearSelection()
          this.exclude_rows.forEach(row => {
            this.$refs.exclude_table.toggleRowSelection(row, true);
          })
        })
      },
      // 点位列表
      fetch_media_list() {
        return new Promise( (resolve, reject) => {
          this.$emit("pos:status", "progress");
          fetch.post('/campaign/pos', {
            advertiser_id: this.ader_id,
            platform_id: this.platform_id.join(','),
            mediatype_id: this.mediatype_id.join(','),
            channel_id: this.channel_id.join(','),
            position_id: this.position_id.join(','),
            adform_id: this.adform_id.join(','),
          }).then( res => {
            if( res.ret == 0) {
              this.update_ad_pos_list(res.data);
              resolve();
            }
            else {
              this.$message.error('获取媒体点位出错！')
              reject(new Error(res.msg))
            }
          }).finally(()=>{
            //加载完成的事件通知
            this.$nextTick(()=>{
              setTimeout(()=>{
                this.$emit("pos:status", "finished");  
              },2500);
            });

          }).catch( err => {
            this.$message.error( err.message);
            reject( err )
          })
        });
      },
      // 选择
      handle_include_selection_change (selection) {
        this.selection_include = selection;
      },
      handle_include_select(){
        this.update_ad_pos(this.selection_include.map(item => item.id));
      },
      // 排除
      handle_exclude_selection_change (selection) {
        this.selection_exclude = selection;
      },
      handle_exclude_select(){
        this.update_ad_pos_except(this.selection_exclude.map(item => item.id));
      }
    }
  }
</script>
<style>
  .tree-wrap {
    max-height: 300px;
    overflow: auto;
    border: 1px solid #dfe4ed;
  }
  .tree-wrap .el-tree-node__content {
    height: 35px;
  }

  .el-table__body-wrapper{
    overflow: auto!important;
  }

  .el-table.pos-table{
    max-height: 325px!important;
  }
</style>
