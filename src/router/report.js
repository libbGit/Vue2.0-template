/*
 * 数据报告
 */
import LayoutAdvertiser from '@/views/layout/LayoutAdvertiser'
import LayoutProject from '@/views/layout/LayoutProject'

const ClientReportrManage = () => import(/* webpackChunkName: "report" */ '@/views/report/index/client-index')
const ProjectReportrManage = () => import(/* webpackChunkName: "report" */ '@/views/report/index/project-index')

const ReportCreate = () => import(/* webpackChunkName: "report" */ '@/views/report/create/index')
const ReportEdit = () => import(/* webpackChunkName: "report" */ '@/views/report/create/edit')

const AdvertiserReport = () => import(/* webpackChunkName: "report" */ '@/views/report/index/advertiser-report/index')
const BrandReport = () => import(/* webpackChunkName: "report" */ '@/views/report/index/brand-report/index')
const ProductLineReport = () => import(/* webpackChunkName: "report" */ '@/views/report/index/product-line-report/index')
const ProjectReport = () => import(/* webpackChunkName: "report" */ '@/views/report/index/project-report/index')
const ActivityReport = () => import(/* webpackChunkName: "report" */ '@/views/report/index/activity-report/index')
const CampaignReport = () => import(/* webpackChunkName: "report" */ '@/views/report/index/campaign-report/index')

const CustomReport = () => import(/* webpackChunkName: "report" */ '@/views/report/index/custom-report/index')

import store from '@/store'


let routes = [
  //客户层级下广告主数据报告
  {
    path: '/report',
    component: LayoutAdvertiser,
    children: [{
      path: '',
      meta: {
        title: '数据报告',
        nav: '/report'
      },
      name: 'ClientReportrManage',
      component: ClientReportrManage,
      children: [{
        path: '',
        redirect: 'advertiser'
      },
      {
        path: 'advertiser',
        meta: {
          title: '广告主报告',
          nav: '/report'
        },
        name: 'AdvertiserReport',
        component: AdvertiserReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'brand',
        meta: {
          title: '品牌报告',
          nav: '/report'
        },
        name: 'BrandReport',
        component: BrandReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'productline',
        meta: {
          title: '产品线报告',
          nav: '/report'
        },
        name: 'ProductLineReport',
        component: ProductLineReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'project',
        meta: {
          title: '项目报告',
          nav: '/report'
        },
        name: 'ProjectReport',
        component: ProjectReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'activity',
        meta: {
          title: '活动报告',
          nav: '/report'
        },
        name: 'ActivityReport',
        component: ActivityReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'campaign',
        meta: {
          title: '推广计划报告',
          nav: '/report'
        },
        name: 'CampaignReport',
        component: CampaignReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'custom',
        meta: {
          title: '定制报告',
          nav: '/report'
        },
        name: 'CustomReport',
        component: CustomReport,
      }]
    },
    {
      path: 'create',
      meta: {
        title: '新建数据报告',
        nav: '/report'
      },
      name: 'ReportCreate',
      component: ReportCreate,
    }, {
      path: 'edit/:id',
      meta: {
        title: '复制数据报告',
        nav: '/report'
      },
      name: 'ReportEdit',
      component: ReportEdit
    }]
  },
  //项目层级下广告主数据报告
  {
    path: '/ad/report',
    component: LayoutProject,
    children: [{
      path: '',
      meta: {
        title: '数据报告',
        nav: '/ad/report'
      },
      name: 'ProjectReportrManage',
      component: ProjectReportrManage,
      children: [{
        path: '',
        redirect: 'brand'
      },
      // {
      //   path: 'advertiser',
      //   meta: {
      //     title: '广告主报告',
      //     nav: '/ad/report'
      //   },
      //   name: 'AdvertiserReport',
      //   component: AdvertiserReport,
      // },
      {
        path: 'brand',
        meta: {
          title: '品牌报告',
          nav: '/ad/report'
        },
        name: 'BrandReport',
        component: BrandReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'productline',
        meta: {
          title: '产品线报告',
          nav: '/ad/report'
        },
        name: 'ProductLineReport',
        component: ProductLineReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'project',
        meta: {
          title: '项目报告',
          nav: '/ad/report'
        },
        name: 'ProjectReport',
        component: ProjectReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'activity',
        meta: {
          title: '活动报告',
          nav: '/ad/report'
        },
        name: 'ActivityReport',
        component: ActivityReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'campaign',
        meta: {
          title: '推广计划报告',
          nav: '/ad/report'
        },
        name: 'CampaignReport',
        component: CampaignReport,
        beforeEnter: (to, from, next) => {
          store.commit('report/UPDATE_CURRENT_ROUTE', to.path);
          next();
        }
      },
      {
        path: 'custom',
        meta: {
          title: '定制报告',
          nav: '/ad/report'
        },
        name: 'CustomReport',
        component: CustomReport,
      }]
    }, {
      path: 'create',
      meta: {
        title: '新建数据报告',
        nav: '/ad/report'
      },
      name: 'AdReportCreate',
      component: ReportCreate,
    }, {
      path: 'edit/:id',
      meta: {
        title: '复制数据报告',
        nav: '/ad/report'
      },
      name: 'AdReportEdit',
      component: ReportEdit
    }]
  }]

export default routes
