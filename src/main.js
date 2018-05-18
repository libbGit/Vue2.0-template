// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'

// import ElementUI from 'element-ui/src/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Animate from 'animate.css'
import '@/assets/css/index.css'

Vue.use(ElementUI)
Vue.use(Animate)
// import '@/mock'

import App from './App'

import router from './router'
import store from './store'
import Util from '@/services/util'
Vue.use(Util)

sync(store, router)

// 为了能正常显示图片
if (process.env.NODE_ENV == 'production') {
  Vue.host = Vue.prototype.$host = '/';
}
else {
  Vue.host = Vue.prototype.$host = 'http://192.168.80.11:8004/';
}
// 深拷贝

new Vue({
  el: '#app',
  router,
  store,
  watch: {
    // 监测路径改变相应的 title
    $route: {
      handler: function (route) {
        let title = route.meta && route.meta.title || ''
        document.title = "华扬数字化智慧营销平台 - " + title
      },
      immediate: true
    }
  },
  render(h) {
    return (
      <App />
    )
  }
})
