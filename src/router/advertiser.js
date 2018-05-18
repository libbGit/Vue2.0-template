/*
 * 客户管理
 */
import LayoutAdvertiser from '@/views/layout/LayoutAdvertiser'

import AdvertiserManage from '@/views/advertiser/index'
import AdvertiserCreate from '@/views/advertiser/create'
import AdvertiserEdit from '@/views/advertiser/create/edit'
import AdvertiserAudit from '@/views/advertiser/audit/index'

const routes = [{
  path: '/advertiser',
  component: LayoutAdvertiser,
  children: [{
    path: '',
    meta: {
      title: '客户管理',
      nav: '/advertiser'
    },
    name: 'AdvertiserManage',
    component: AdvertiserManage
  }, {
    path: 'create',
    meta: {
      title: '新建广告主',
      nav: '/advertiser'
    },
    name: 'AdvertiserCreate',
    component: AdvertiserCreate
  }, {
    path: 'edit/:id',
    meta: {
      title: '编辑广告主',
      nav: '/advertiser'
    },
    name: 'AdvertiserEdit',
    component: AdvertiserEdit
  }, {
    path: 'audit/:id',
    meta: {
      title: '媒体审核',
      nav: '/advertiser'
    },
    name: 'AdvertiserAudit',
    component: AdvertiserAudit
  }]
}]
export default routes
