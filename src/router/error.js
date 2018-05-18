/*
 * 错误页面（包括 404, 503）
 */

// import Test from '@/views/test/test01'
import Foo from '@/views/test/foo'
import Err404 from '@/views/error/err404'


const routes = [{
  path: '/foo',
  name: 'Foo',
  component: Foo
}, {
  path: '/404',
  name: 'Err404',
  component: Err404
}]

export default routes
