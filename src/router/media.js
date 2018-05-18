/*
 * 数据报告
 */
import LayoutAdvertiser from '@/views/layout/LayoutAdvertiser'
import LayoutProject from '@/views/layout/LayoutProject'

import MediaManage from '@/views/media/index'
import MediaCreate  from '@/views/media/create/index'
import MediaEdit from '@/views/media/create/edit'

let routes = [{
  path: '/media',
  component: LayoutAdvertiser,
  children: [{
    path: '',
    meta: {
      title: '媒体点位列表',
      nav: '/media'
    },
    name: 'MediaManage',
    component: MediaManage
  },{
    path: 'create',
    meta: {
      title: '新建媒体点位',
      nav: '/media'
    },
    name: 'MediaCreate',
    component: MediaCreate,
  },{
    path: 'edit/:id',
    meta: {
      title: '编辑媒体点位',
      nav: '/media'
    },
    name: 'MediaEdit',
    component: MediaEdit
  }]
},{
  path: '/ad/media',
  component: LayoutProject,
  children: [{
    path: '',
    meta: {
      title: '媒体点位列表',
      nav: '/ad/media'
    },
    name: 'AdMediaManage',
    component: MediaManage
  },{
    path: 'create',
    meta: {
      title: '新建媒体点位',
      nav: '/ad/media'
    },
    name: 'AdMediaCreate',
    component: MediaCreate,
  },{
    path: 'edit/:id',
    meta: {
      title: '编辑媒体点位',
      nav: '/ad/media'
    },
    name: 'AdMediaEdit',
    component: MediaEdit
  }]
}]

export default routes
