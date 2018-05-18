import LayoutProject from '@/views/layout/LayoutProject'
import CreativeManage from '@/views/cm/creativelib/manage'
import CreativeCreate from '@/views/cm/creativelib/create/index'
import CreativeEdit from '@/views/cm/creativelib/create/edit'
import CreativeDetail from '@/views/cm/creativelib/create/detail'
import CreativeOverview from '@/views/cm/creativelib/overview'

let routes = [{
  path: '/cm',
  component: LayoutProject,
  children: [{
    path: '',
    redirect: 'creativelib/manage'
  }, {
    path: 'creativelib',
    redirect: 'creativelib/manage'
  }, {
    path: 'creativelib/manage',
    name: 'CreativeManage',
    component: CreativeManage
  }, {
    path: 'creativelib/create',
    name: 'CreativeCreate',
    component: CreativeCreate
  }, {
    path: 'creativelib/edit/:id',
    name: 'CreativeEdit',
    component: CreativeEdit
  }, {
    path: 'creativelib/detail/:id',
    name: 'CreativeDetail',
    component: CreativeDetail
  }, {
    path: 'creativelib/overview',//未开发的路由
    name: 'CreativeOverview',
    component: CreativeOverview
  }, {
    path: 'imglib/manage',//未开发的路由
    name: 'imglibManage',
    component: CreativeOverview
  }, {
    path: 'documentlib/manage',//未开发的路由
    name: 'documentlibManage',
    component: CreativeOverview
  }, {
    path: 'linklib/manage',//未开发的路由
    name: 'linklibManage',
    component: CreativeOverview
  },]
}]
let meta = {
  nav: '/cm',
  title: '创意管理'
}
routes = routes.map(item => {
  item.children.map(child => {
    child.meta = meta
  })
  return item;
})
export default routes
