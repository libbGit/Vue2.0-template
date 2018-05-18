<template>
    <div class="g__wrap">
        <layout-header></layout-header>
        <div class="g__main">
            <div class="choose__wrap">
                <div class="content">
                    <div class="key-pd-recommend">
                        <div class="pd-header">
                            <h2 class="title">请选择投放类型</h2>
                            <p class="subtitle">
                                <span class="hr-lf"></span>一站式投放，轻松管理
                                <span class="hr-rg"></span>
                            </p>
                        </div>
                        <div class="key-products">
                            <ul class="key-pd-items fn-clear">
                                <li class="key-pd-item transition" :class="{'disabled': isDisabledPD}" @click="leftClick">

                                    <i class=" all_center blue">
                                        <em class="product1 "></em>
                                    </i>
                                    <h3>华扬PD</h3>
                                    <p>高性价比的品牌曝光转化利器</p>
                                    <p>贯穿时/地/速/端/位/兴趣，组合式强化投放</p>
                                    <div class="all_center price">
                                        <div>
                                            <span>开始使用</span>
                                        </div>
                                    </div>

                                </li>
                                <li class="key-pd-item transition" :class="{'disabled': isDisabledPDB}" @click="rightClick">

                                    <i class="all_center yellow">
                                        <em class="product2 "></em>
                                    </i>
                                    <h3>华扬PDB</h3>
                                    <p>优质靠谱的广告位投放资源</p>
                                    <p>全面解锁网民需求，精准推广企业信息
                                    </p>
                                    <div class="all_center price">
                                        <div>
                                            <span>开始使用</span>
                                        </div>
                                    </div>

                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <layout-footer class="footer-fix" />
    </div>
</template>
<script>
import LayoutHeader from "../layout/LayoutHeader";
import LayoutFooter from "../layout/LayoutFooter";
import { mapState, mapActions } from "vuex";

export default {
  name: "LayoutPd",
  components: {
    LayoutHeader,
    LayoutFooter
  },
  computed: {
    ...mapState({
      advertiser: state => state.user.advertiser,
      advertiser_name: state => state.user.advertiser_name,
      site_type: state => state.user.site_type,
      role: state => state.user.role
    }),
    isDisabledPD() {
      return this.site_type.indexOf("pd") == -1;
    },
    isDisabledPDB() {
      return this.site_type.indexOf("pdb") == -1;
    }
  },
  methods: {
    ...mapActions("ad", ["update_ader_id", "update_ader_name"]),
    leftClick() {
      if (!this.isDisabledPD) {
        // 用户是“项目管理”角色
        if (this.role == "project") {
          this.update_ader_name(this.advertiser_name);
          this.update_ader_id(this.advertiser);
          //prod
          // window.location.href = "/pd.html/#/ad/project/manage";

          //dev
          this.$router.push({
            path: "/ad/project/manage"
          });
        } else {
          // 用户是“客户管理”角色
          //prod
          // window.location.href = "/pd.html/#/advertiser";

          //dev
          this.$router.push({
            path: "/advertiser"
          });
        }
      }
    },
    rightClick() {
      if (!this.isDisabledPDB) {
        if (this.role == "project") {
          this.update_ader_name(this.advertiser_name);
          this.update_ader_id(this.advertiser);
          //prod
          // window.location.href = "/pdb.html/#/ad/project/manage";

          //dev
          this.$router.push({
            path: "ad/project/manage"
          });
        } else {
          // 用户是“客户管理”角色
          //prod
          // window.location.href = "/pdb.html/#/advertiser";

          //dev
          this.$router.push({
            path: "advertiser"
          });
        }
      }
    }
  }
};
</script>
<style>
.choose__wrap {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 50px;
}

.choose__wrap .content {
  width: 800px;
  margin: auto;
}

.footer-fix {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

/****/
.all_center {
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.key-pd-recommend {
  width: 100%;
  padding: 0 0 80px 0;
}

.key-pd-recommend .pd-header {
  text-align: center;
  height: 120px;
}

.key-pd-recommend .pd-header h2 {
  height: 60px;
  line-height: 60px;
  font-size: 23px;
  margin-top: 33px;
  font-weight: 800;
}

.key-pd-recommend .pd-header .subtitle {
  color: #666;
  font-size: 14px;
}

.key-pd-recommend .key-products {
  width: 800px;
  margin: 0 auto;
}

.key-pd-recommend .key-products .key-pd-items {
  margin-left: -55px;
}

.key-pd-recommend .key-products .key-pd-items .key-pd-item {
  background: #fff;
  width: 350px;
  float: left;
  margin-left: 55px;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  padding-bottom: 40px;
}

.key-pd-recommend .key-products .key-pd-items .disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.key-pd-recommend .key-products .key-pd-items .disabled :hover {
  box-shadow: none;
}

.key-pd-recommend .key-products .key-pd-items .key-pd-item:hover {
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
}

.key-pd-item i {
  width: 250px;
  height: 170px;
  margin: 0 auto;
  border-top: 4px solid #f60;
  line-height: 120px;
  text-align: center;
  font-size: 60px;
}

.key-pd-item i.yellow {
  border-top-color: #f60;
  color: #f60;
}

.key-pd-item i.blue {
  border-top-color: #409eff;
  color: #37a8ff;
}

.key-pd-item i em {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  display: block;
}

.key-pd-item h3 {
  line-height: 24px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.key-pd-item p {
  line-height: 24px;
  color: #999;
  text-align: center;
  width: 250px;
  margin: 0 auto;
}

.key-pd-item .price {
  width: 200px;
  border-radius: 20px;
  background: #f5f5f5;
  height: 40px;
  color: #999;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
}

.key-pd-item div span {
  line-height: 16px;
  color: #999;
  text-align: center;
  display: block;
}

.key-pd-item div b {
  line-height: 16px;
  color: #f60;
  text-align: center;
}

.product1 {
  background: url("~@/assets/image/pd.png") no-repeat center;
}

.product2 {
  background: url("~@/assets/image/pdb.png") no-repeat center;
}

ol,
ul {
  list-style: none;
}
</style>
