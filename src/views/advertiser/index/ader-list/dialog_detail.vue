<template>
  <div class="dialog-wrap">
    <div class="hy-card">
      <div class="hy-card__header"></div>
      <div class="hy-card__content">
        <div class="table-wrap">
          <div class="title">{{data.name}}<el-tag :type="formatAuditStatus(data.status).type">{{formatAuditStatus(data.status).text}}</el-tag></div>
          <div class="detail">
            <ul>
              <li> 广告主ID：{{data.id}}</li>
              <li> 广告主类型：{{formatType(data.type)}}</li>
              <li> 所属行业：{{formatIndustry(data.industry)}}</li>
              <li> 品牌/事业部：{{data.brand?data.brand:'--'}}</li>
              <li> 客户负责人姓名：{{data.customer_contact?data.customer_contact:'--'}}</li>
              <li> 联系电话：{{data.phone?data.phone:'--'}}</li>
              <li> 销售负责人姓名：{{data.seller_contact}}</li>
              <li> 运营执行人：{{data.officer}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="hy-card">
      <div class="hy-card__header">资质文件</div>
      <div class="hy-card__content">
        <div class="table-wrap">
          <ul class="pic-list">
            <li v-if="data.licence_pic">
              <img :src="show_pic(data.licence_pic)" @error="handle_img_error($event)" @click="$previewImage(show_pic(data.licence_pic))" title="点击查看大图">
              <p>营业执照</p>
            </li>
            <li v-if="data.code_pic">
              <img :src="show_pic(data.code_pic)" @click="$previewImage(show_pic(data.code_pic))" title="点击查看大图">
              <p>组织机构代码证</p>
            </li>
            <li v-if="data.id_card">
              <img :src="show_pic(data.id_card)" @click="$previewImage(show_pic(data.id_card))" title="点击查看大图">
              <p>法人身份证</p>
            </li>
            <li v-if="data.tax_pic">
              <img :src="show_pic(data.tax_pic)" @click="$previewImage(show_pic(data.tax_pic))" title="点击查看大图">
              <p>税务登记证</p>
            </li>
            <li v-if="data.icp">
              <img :src="show_pic(data.icp)" @click="$previewImage(show_pic(data.icp))" title="点击查看大图">
              <p>ICP证</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="hy-card">
      <div class="hy-card__header">媒体审核管理</div>
      <div class="hy-card__content">
        <div class="table-wrap">
          <table class="hy-table">
            <tr>
              <th>投放媒体</th>
              <th>审核状态</th>
              <th>审核时间</th>
            </tr>
            <tr v-for="item in data.mediaAudit">
              <td>{{item.name}}</td>
              <td>
                <div v-for="audit in item.audit_status">
                  <!-- 当媒体为搜狐时显示媒体名称 -->
                  <span v-if="item.audit_status.length > 1" >{{audit.media_name}} : </span>
                  <span v-if="audit.status == 3" >
                    <el-tooltip :content="audit.msg" placement="top" v-if='audit.msg'>
                      <span class="status_fail">{{ format_media_audit_status(audit.status) }}</span>
                    </el-tooltip>
                    <span class="status_fail" v-else>{{ format_media_audit_status(audit.status) }}</span>
                  </span>
                  <span v-else>
                    {{ format_media_audit_status(audit.status) }}
                  </span>
                </div>
              </td>
              <td>
                <div v-for="audit in item.audit_status">
                  <span v-if="item.audit_status.length > 1"> {{audit.media_name}} :  </span>
                  {{ audit.audit_time || '--' }}
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Detail',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        industryList: state => state.advertiser.industryList
      })
    },
    methods: {
      ...mapActions('advertiser',[
        'fetch_industry_list'
      ]),
      show_pic (url) {
        return this.$host + url;
      },
      handle_img_error(event){
        var target = event.target;
        console.log(target);
      },
      formatAuditStatus (status) {
        var result = {};
        switch( status ) {
          case 0:
          result = {
            type: 'warning',
            text: '待审核'
          }
          break;
          case 1:
          result = {
            type: 'warning',
            text: '审核中'
          }
          break;
          case 2:
          result = {
            type: 'success',
            text: '审核成功'
          }
          break;
          case 3:
          result = {
            type: 'danger',
            text: '审核失败'
          }
          break;
          default:
          result = {
            type: 'info',
            text: '未知'
          }
        }
        return result;
      },
      formatType (type) {
        if( type == 1) {
          return '直客'
        }
        else {
          return '代理商'
        }
      },
      format_media_audit_status(status){
        if ( status == '0' ) {
          return '尚未审核'
        }
        else if (status == '1' ){
          return '送审中'
        }
        else if (status == '2' ){
          return '审核通过'
        }
        else if (status == '3' ){
          return '审核失败'
        }
        else if (status == '4' ){
          return '无需审核'
        }
        else {
          return '未知'
        }
      },
      formatIndustry( industryId ) {
        var _this = this, result = '';
        if(this.industryList.length == 0) {
          this.fetch_industry_list()
            .then(()=>{
              return _this.getIndustryName(industryId);
            })
        }
        else {
          return _this.getIndustryName(industryId);
        }
      },
      getIndustryName (industryId) {
        var result = this.industryList.filter( item => {
          return item.id == industryId
        });
        if ( result.length >= 1) {
          return result[0] && result[0].name;
        }
        else {
          return '未知';
        }
      }
    }
  }
</script>
<style scoped>
  .dialog-wrap {
    margin: -50px -10px -30px;
  }
  .pic-list {
    display: inline-block;
    margin:0;
    padding:0;
    list-style: none;
  }
  .pic-list li {
    display: inline-block;
    margin-right: 5px;
    text-align: center;
  }
  .pic-list li img {
    max-width: 100px;
    max-height: 76px;
    display: block;
  }
  .pic-list li p {
    text-align: center;
    margin: 0;
  }
  .status_fail {
    color: red;
    cursor: pointer;
    text-decoration: underline;
  }
  .title{
    font-size: 24px;
    line-height: 40px;
    color: #333;
  }
  .detail{
    font-size: 12px;
    color: #999;
  }
  ul{ margin: 0 auto;
  padding: 0}
  .detail ul li{
    float: left;
    width: 200px;
    margin-right: 20px;
    list-style: none;
    line-height: 24px;
  }
</style>
