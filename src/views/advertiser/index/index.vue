<template>
  <div>
    <div class="hy-card">
      <!-- 计划预警  -->
      <alert-list
        url='/advertiser/warn'
        @onView='viewWarn' 
      />
      <!-- 新建广告主 -->
      <div class="hy-card__header clearfix">
        <router-link to="/advertiser/create">
          <el-button type="primary" size="mini">新建广告主</el-button>
        </router-link>
        <div class="pull-right">
          <el-input size="mini" style="width:200px;"
            placeholder="请输入广告主名称"
            @keyup.enter.native='handleSearch'
            v-model="searchVal">
            <el-button slot="append" icon="el-icon-search" @click='handleSearch'></el-button>
          </el-input>
        </div>
      </div>
      <!-- 广告主列表 -->
      <ader-list :keyword='keyword' />
    </div>
      <!-- 数据显示 -->
    <ader-data :keyword='keyword' />
  </div>
</template>
<script>
import AderList from "./ader-list/index";
import AderData from "./ader-data/index";
import AlertList from '@/views/public/alert-list'
export default {
  name: "ader-manage",
  components: {
    AderList,
    AderData,
    AlertList
  },
  data() {
    return {
      searchVal: "",
      keyword: ""
    };
  },
  methods: {
    viewWarn(obj){
      this.searchVal = obj.name
      this.keyword = obj.name
    },
    handleSearch() {
      this.keyword = this.searchVal;
    }
  }
};
</script>

