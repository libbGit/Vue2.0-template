<template>
  <div style="margin: 500px 100px; background-color: #fff;">
    <el-button @click="download">下载</el-button>
<!--     <test :value="check_columns" @input="handle_input" :items="extral_column" />
    <test :value="check_columns" @input="handle_input" :items="datas" :props="props"/> -->
  </div>
</template>
<script>
  import Test from '@/views/public/checkbox-list'
  export default {
    name: 'foo',
    data () {
      return {
        check_columns: [],
        extral_column: [
          {
            label: "推广计划ID",
            prop: "id"
          },{
            label: "品牌",
            prop: "brand_name"
          },{
            label: "产品线",
            prop: "product_line"
          },{
            label: "活动名称",
            prop: "activity_name"
          },{
            label: "开始时间",
            prop: "start_time"
          },{
            label: "结束时间",
            prop: "end_time"
          },{
            label: "每日预算",
            prop: "budget"
          },{
            label: "人群定向",
            prop: "group_name"
          },{
            label: "创意",
            prop: "creative"
          },{
            label: "CTR",
            prop: "ctr"
          },{
            label: "CPC",
            prop: "cpc"
          },{
            label: "CPM",
            prop: "cpm"
          },{
            label: "Leads",
            prop: "leads"
          },{
            label: "CPL",
            prop: "CPL"
          }
        ],
        datas: [
          {
            "id": 1,
            "name": "PC"
          },
          {
            "id": 2,
            "name": "WAP"
          },
          {
            "id": 3,
            "name": "APP"
          },
          {
            "id": 4,
            "name": "TABLET"
          }
        ],
        props: {
          prop: 'id',
          label: 'name'
        }
      }
    },
    methods: {
      handle_input (value) {
        this.check_columns = value;
      },
      download() {
        var sUrl = "http://bitest.hylinkad.com/static/Uploads/20171219/53ac222aaec073230d3a57a91a23c19c.png";
        this.$downloadFile(sUrl)
      }
    },
    components: {
      Test
    }
  }
</script>

