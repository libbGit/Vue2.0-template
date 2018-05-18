<template>
    <div class="hy-card">
        <div class="hy-card__header clearfix">
            <!-- 新建报告 -->
            <router-link :to='{path}'>
                <el-button type="primary"
                    size="mini">新建媒体点位</el-button>
            </router-link>
            <el-button @click="exportData"
                size="mini">导出</el-button>

            <el-dropdown @command='handleOperationChange'>
                <el-button type="primary"
                    size="mini"
                    plain
                    icon="el-icon-menu">
                    操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1"
                        label="暂停"
                        :disabled='isOpenDisable'>开启
                    </el-dropdown-item>
                    <el-dropdown-item command="0"
                        label="停用"
                        :disabled='isStopDisable'>停用
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <div class="pull-right"
                :inline="true">
                <el-form :inline="true"
                    class="demo-form-inline"
                    :model="$data"
                    size="mini">
                    <el-form-item label="媒体">
                        <el-select v-model="media_name"
                            placeholder="请选择">
                            <el-option key=""
                                label="全部"
                                value="">
                            </el-option>
                            <el-option v-for="item in media_list "
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <!--<el-form-item label="点位">-->
                    <!--<el-select v-model="form.pos_id" placeholder="请选择" @change="searchMedia">-->
                    <!--<el-option-->
                    <!--key="0"-->
                    <!--label="全部"-->
                    <!--value="0">-->
                    <!--</el-option>-->
                    <!--<el-option-->
                    <!--v-for="item in pos_list "-->
                    <!--:key="item.id"-->
                    <!--:label="item.name"-->
                    <!--:value="item.id">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item>
                        <el-input placeholder="HY编码\点位名称\描述"
                            v-model="hy_code">
                            <el-button slot="append"
                                icon="el-icon-search"
                                @click="searchMedia"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>

            </div>
        </div>
        <!-- 报告列表 -->
        <media-list @selectedData='selectedData'
            ref="mediaList"
            :mediaName="media_name"
            :keyword='keyword' />
    </div>

</template>
<script>
import fetch from '@/services/fetch'
import { mapState, mapActions } from 'vuex'
import MediaList from './media-list'

export default {
  name: 'Media-manage',
  data() {
    return {
      hy_code: '',
      media_name: '',
      path: '',
      keyword: '',
      media_list: [],
      downloadFile: "",
      selectedPos: [],
      batchOpera: ''//批量操作
    }
  },

  mounted() {
    this.fetch_media_list();
    this.path = this.$route.path + '/create';

  },
  computed: {
    isOpenDisable() {
      if (this.selectedPos.length) {
        let opened = this.selectedPos.find(i => i.status == '1');
        return !!opened;
      } else {
        return true;
      }
    },
    isStopDisable() {
      if (this.selectedPos.length) {
        let opened = this.selectedPos.find(i => i.status == '0');
        return !!opened;
      } else {
        return true;
      }
    }
  },
  methods: {
    selectedData(arr) {
      this.selectedPos = arr;
    },
    handleOperationChange(command) {
      let ids = this.selectedPos.map(i => i.id).join();
      this.$refs.mediaList.editStatus(ids, command);
    },
    fetch_media_list() {
      return new Promise((resolve, reject) => {
        fetch.post('/mediaPos/mediaList').then(res => {
          if (res.ret === 0 && res.data) {
            this.media_list = res.data;
          }
          resolve(res);
        })
          .catch(err => {
            reject(err);
          })
      })
    },
    searchMedia() {
      this.keyword = this.hy_code;
    },
    //      fetch_pos_list(){
    //        if(this.form.media_id!=="0"){
    //          let media = this.media_list.filter(data =>{
    //            return data.id === this.form.media_id;
    //          });
    //          this.pos_list = media[0].pos;
    //        }else{
    //          this.pos_list = [];
    //          this.form.pos_id = "0";
    //        }
    //      },
    /*searchMedia(){
      return new Promise((resolve, reject) => {
        fetch.post('/mediaPos/getList', {
          media_name:this.media_name,
          keyword:this.hy_code,
          page: this.$refs.mediaList.currentPage,
          limit: this.$refs.mediaList.pageSize
        }).then( res => {
          if (res.ret === 0 && res.data) {
            this.$refs.mediaList.mediaPosList = res.data;
            this.$refs.mediaList.total = parseInt(res.total);
            this.$message({
              message: '查询到'+this.$refs.mediaList.total+'条结果',
              type: 'success'
            });
          }else {
            this.$message({
              message: '查询不到信息！',
            });
          }
          resolve(res);

        })
          .catch( err => {
            reject(err);
          })
      })
    },*/
    exportData() {
      return new Promise((resolve, reject) => {
        fetch.post('/mediaPos/exportData', {
          media_name: this.media_name,
          keyword: this.hy_code,
        }).then(res => {
          if (res.ret === 0 && res.data) {
            window.open("../" + res.data.file);
          } else {
            this.$message({
              message: '导出信息失败！',
            });
          }
          resolve(res);

        })
          .catch(err => {
            reject(err);
          })
      })

    },
  },
  components: {
    MediaList
  }
}
</script>

