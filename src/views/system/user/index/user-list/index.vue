<template>
<div>
  <div class="hy-card">
    <div class="hy-card__content" v-loading="isLoading">
      <el-table size="mini"
        :data="userList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          label="序号"
          width="60"
          type="index"
          prop="id">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          width="140">
        </el-table-column>
        <el-table-column
          prop="role_level"
          width="120"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="contacts"
          width="120"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="contacts_telphone"
          width="120"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="client"
          label="客户">
        </el-table-column>
        <el-table-column
          prop="project"
          label="项目">
          <template slot-scope="scope">

            <span v-if="scope.row['project'] === null">--</span>
            <span v-else>{{scope.row.project}}</span>

          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="操作"
          align="right">
        <template slot-scope="scope">
          <router-link :to="'/system/user/edit/' + scope.row.username">
            <el-button size="mini" icon="el-icon-edit" title="编辑" >

            </el-button>
          </router-link>
          <!--<el-popover ref="popover{{$index}}"-->
                      <!--placement="left"-->
                      <!--width="200"-->
                      <!--trigger="click"-->
                      <!--v-model="scope.row.visible"-->
                      <!--title="确定要删除此客户吗？">-->
            <!--<p>删除后信息将无法恢复！</p>-->
            <!--<div style="text-align: right; margin: 0">-->
              <!--<el-button size="mini"  @click="scope.row.visible = false">取消</el-button>-->
              <!--<el-button type="danger" size="mini" @click="UserDelete(scope.row)">确定</el-button>-->
            <!--</div>-->
          <!--</el-popover>-->
          <el-button size="mini" icon="el-icon-delete" title="删除"  @click="openDelete(scope.row)" ></el-button>
        </template>
        </el-table-column>
      </el-table>
      <div class="clearfix" style="background:#fff;">
        <el-pagination class="pull-right"
          layout="total, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handle_page_change"
          >
        </el-pagination>
      </div>
    </div>
  </div>

</div>
</template>
<script>
  import fetch from '@/services/fetch'
  import { mapState, mapActions } from 'vuex'
  export default {
    name:'UserList',
    data() {
      return {
        // 用户列表
        userList:[],
        isLoading: false,
        currentPage: 1,
        pageSize: 20,
        total: 0,
      }
    },
    created() {
      this.fetch_user_list()
    },
    methods: {
      ...mapActions([
      ]),
      openDelete(row) {
        this.$confirm('是否继续删除该用户?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.UserDelete(row);
        }).catch(() => {

        });
      },
      fetch_user_list() {
        this.isLoading = true;
        return new Promise((resolve, reject) => {
          fetch.post('/manage/user_list', {
            page: this.currentPage,
            limit: this.pageSize
          }).then( res => {
            this.isLoading = false;
            if (res.ret == 0 && res.data) {
              this.userList = res.data;
              this.total = parseInt(res.total);
            }
            resolve(res);
          })
            .catch( err => {
              this.isLoading = false;
              reject(err);
            })
        })

      },
      UserDelete(row){
        let _UserId=row.id;
        return new Promise((resolve, reject) => {
          fetch.post('/manage/delete_user', {
            id: _UserId
          }).then( res => {

            if (res.ret == 0) {
              row.visible = false;
              this.fetch_user_list();
              this.$message({
                message: '用户信息删除成功',
                type: 'success'
              });
            }
            resolve(res);
          })
            .catch( err => {
              reject(err);
            })
        })


      },
      // 处理分页操作
      handle_page_change(currentPage) {
        this.currentPage = currentPage;
        this.fetch_user_list();
      },
    },
    components:{}
  }
</script>

