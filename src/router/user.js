/*
 * 用户登录
 */
import store from '@/store'

import Login from '@/views/login'
import Choose from '@/views/choose'

let isLogin = () => {
  return store.getters['user/isLogin']
}

const routes = [{
  path: '/',
  redirect: '/choose'
}, {
  path: '/choose',
  name: 'Choose',
  component: Choose
}, {
  path: '/login',
  name: 'Login',
  component: Login,
  beforeEnter: (to, from, next) => {
    let redirect = to.query.redirect
    if (isLogin() && redirect) {
      next(redirect)
    } else if ( isLogin() ) {
      next("/choose")
    } else {
      next()
    }
  }
}, {
  path: '/logout',
  beforeEnter(to, from, next) {
    store.dispatch('user/logout')
      .then(res => {
        next('/login')
      })
      .catch(err => {
        console.log(err)
      })
  }
}]

export default routes
