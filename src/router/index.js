import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
// pd路由
import userRoute from './user'
import advertiserRoute from './advertiser'
import adRoute from './ad'
import reportRoute from './report'
import mediaRoute from './media'
import systemRoute from './system'
import cmRoute from './cm'
import errorRoute from './error'
import elm from 'element-ui'
import crowdRoute from "./crowd"

/*import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)*/

Vue.use(Router)

let isLogin = () => {
  return store.getters['user/isLogin']
}

let routes = [].concat(
  userRoute,
  advertiserRoute,
  adRoute,
  reportRoute,
  mediaRoute,
  systemRoute,
  cmRoute,
  errorRoute,
  crowdRoute,
)

const router = new Router({
  routes: routes
})
// 不需要登录的路径
const whiteList = ['/login', '/404', '/test'];
//未启用的路由
const notEnabledList = [
// '/ad/project/overview',
// '/ad/project/schedule',
// '/ad/activity/overview',
// '/ad/activity/plan',
// '/ad/activity/budget-manage',
// '/ad/campaign/overview',
// '/ad/campaign/group',
// '/ad/campaign/media',
// '/ad/campaign/position',
// '/cm/creativelib/overview',
// "/cm/imglib/manage",
// "/cm/documentlib/manage",
// "/cm/linklib/manage"
 ];

router.beforeEach((to, from, next) => {
  if (notEnabledList.indexOf(to.path) >= 0) {
    next(false)
    elm.Message.info('敬请期待');
    return
  }
  if (whiteList.indexOf(to.path) >= 0) {
    next()
  } else if (isLogin()) {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})

export default router
