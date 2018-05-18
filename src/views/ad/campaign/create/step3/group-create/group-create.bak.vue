<template>
  <div>
    <el-form label-width="100px" size="small">
      <el-form-item label="人群包名称:" prop="group_name">
        <el-input v-model="group_name" style="width: 200px;"></el-input>
        <el-checkbox v-model="is_save_group" style="margin-left: 15px;">保存为常用人群包</el-checkbox>
      </el-form-item>
      <el-form-item label="定向类型:" prop="group_type">
        <el-radio v-model="group_type" :label="1">属性定向</el-radio>
        <el-radio v-model="group_type" :label="2">ID 定向</el-radio>
      </el-form-item>
      <el-form-item>
        <template v-if="group_type == 1">
          <div class="wrap">
            <label class="left">年龄</label>
            <div class="right">
              <el-checkbox-group v-model="年龄">
                <el-checkbox label="19岁以下"></el-checkbox>
                <el-checkbox label="19-25岁"></el-checkbox>
                <el-checkbox label="26-30岁"></el-checkbox>
                <el-checkbox label="31-35岁"></el-checkbox>
                <el-checkbox label="31-35岁"></el-checkbox>
                <el-checkbox label="36-40岁"></el-checkbox>
                <el-checkbox label="41-45岁"></el-checkbox>
                <el-checkbox label="46-60岁"></el-checkbox>
                <el-checkbox label="60岁以上"></el-checkbox>
                <el-checkbox label="未知"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="wrap">
            <label class="left">性别</label>
            <div class="right">
              <el-checkbox-group v-model="性别">
                <el-checkbox label="男"></el-checkbox>
                <el-checkbox label="女"></el-checkbox>
                <el-checkbox label="未知"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="wrap">
            <label class="left">学历</label>
            <div class="right">
              <el-checkbox-group v-model="学历">
                <el-checkbox label="小学"></el-checkbox>
                <el-checkbox label="初中"></el-checkbox>
                <el-checkbox label="高中"></el-checkbox>
                <el-checkbox label="大专"></el-checkbox>
                <el-checkbox label="本科"></el-checkbox>
                <el-checkbox label="研究生"></el-checkbox>
                <el-checkbox label="博士及以上"></el-checkbox>
                <el-checkbox label="未知"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="wrap">
            <label class="left">收入水平</label>
            <div class="right">
              <el-checkbox-group v-model="收入水平">
                <el-checkbox label="月收入2000以下"></el-checkbox>
                <el-checkbox label="月收入2000-5000"></el-checkbox>
                <el-checkbox label="月收入5000-10000"></el-checkbox>
                <el-checkbox label="月收入10000-20000"></el-checkbox>
                <el-checkbox label="月收入20000-50000"></el-checkbox>
                <el-checkbox label="月收入50000以上"></el-checkbox>
                <el-checkbox label="未知"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="wrap">
            <label class="left">身份职业</label>
            <div class="right">
              <el-checkbox-group v-model="身份职业">
                <el-checkbox label="学生"></el-checkbox>
                <el-checkbox label="工程师"></el-checkbox>
                <el-checkbox label="管理人员"></el-checkbox>
                <el-checkbox label="职员"></el-checkbox>
                <el-checkbox label="教师"></el-checkbox>
                <el-checkbox label="医生"></el-checkbox>
                <el-checkbox label="法律从业者"></el-checkbox>
                <el-checkbox label="自由职业者"></el-checkbox>
                <el-checkbox label="农民"></el-checkbox>
                <el-checkbox label="公务员"></el-checkbox>
                <el-checkbox label="未知"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="wrap">
            <label class="left">婚否</label>
            <div class="right">
              <el-checkbox-group v-model="婚否">
                <el-checkbox label="是">已婚</el-checkbox>
                <el-checkbox label="否">未婚</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </template>
        <template v-if="group_type ==2">
          <el-checkbox v-model="is_pc_type">PC定向</el-checkbox>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'create-group',
    data () {
      return {
      }
    },
    computed : {
      ...mapState('ad/campaign',[
        'group_name',
        'is_save_group',
        'group_type',
        'is_pc_type',
        'group_data',
        'group_keys',
      ])
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
</style>
