/*
 * 用户管理
 */
import LayoutAdvertiser from '@/views/layout/LayoutAdvertiser'

import SystemUserManage from '@/views/system/user/index'
import SystemUserCreate from '@/views/system/user/create'
import SystemUserEdit from '@/views/system/user/create/edit'


const routes = [{
  path: '/system',
  component: LayoutAdvertiser,
  children: [{
    path: 'user',
    meta: {
      title: '用户管理',
      nav: '/system/user'
    },
    name: 'user/SystemUserManage',
    component: SystemUserManage
  }, {
    path: 'user/create',
    meta: {
      title: '新建用户',
      nav: '/system/user'
    },
    name: 'SystemUserCreate',
    component: SystemUserCreate
  }, {
    path: 'user/edit/:name',
    meta: {
      title: '编辑用户',
      nav: '/system/user'
    },
    name: 'SystemUserEdit',
    component: SystemUserEdit
  }]
}]

export default routes
