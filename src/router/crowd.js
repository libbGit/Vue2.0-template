import LayoutProject from "@/views/layout/LayoutProject"

//懒加载
const CrowdIndex = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/index')

//华扬 DMP
const CrowdHyDmpIndex = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/hy-dmp/index')
const CrowdHyDmpList = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/hy-dmp/crowdList.vue')
const CrowdHyDmpAdd = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/hy-dmp/crowdAdd.vue')
const CrowdHyEdit = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/hy-dmp/crowdEdit.vue')
const CrowdHyDetail = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/hy-dmp/crowdDetail.vue')

//腾讯 DMP
const CrowdTecentDmpIndex = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/tecent-dmp/index')
const CrowdTecentDmpList = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/tecent-dmp/crowdList.vue')
const CrowdTecentDmpAdd = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/tecent-dmp/crowdAdd.vue')
const CrowdTecentEdit = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/tecent-dmp/crowdEdit.vue')
const CrowdTecentDetail = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/tecent-dmp/crowdDetail.vue')

//秒针 DMP
const CrowdSecondDmpIndex = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/second-dmp/index')
const CrowdSecondDmpList = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/second-dmp/crowdList.vue')
const CrowdSecondDmpAdd = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/second-dmp/crowdAdd.vue')
const CrowdSecondEdit = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/second-dmp/crowdEdit.vue')
const CrowdSecondDetail = () => import(/* webpackChunkName: "crowd" */ '@/views/crowd/second-dmp/crowdDetail.vue')

let routes = [
  {
    path: "/crowd",
    component: LayoutProject,
    children: [
      {
        path: '',
        component: CrowdIndex,
        children: [
          {
            path: '',
            redirect: "hyDmp"
          },
          //华扬 DMP
          {
            path: 'hyDmp',
            name: 'HyDmp',
            component: CrowdHyDmpIndex,
            children: [
              {
                path: '',
                redirect: "list"
              },
              {
                path: 'list',
                name: 'CrowdHyDmpList',
                meta: {
                  title: '华扬DMP人群包列表',
                  nav: '/crowd/hyDmp'
                },
                component: CrowdHyDmpList
              },
              {
                path: 'add',
                name: 'CrowdHyDmpAdd',
                meta: {
                  title: '华扬DMP新建人群包',
                  nav: '/crowd/hyDmp'
                },
                component: CrowdHyDmpAdd
              },
              {
                path: "edit/:id",
                name: "CrowdHyEdit",
                meta: {
                  title: '华扬DMP编辑人群包',
                  nav: '/crowd/hyDmp'
                },
                component: CrowdHyEdit
              },
              {
                path: "detail/:id",
                name: "CrowdHyDetail",
                meta: {
                  title: '华扬DMP查看人群包详情',
                  nav: '/crowd/hyDmp'
                },
                component: CrowdHyDetail
              },
            ]
          },
          //腾讯 DMP
          {
            path: 'tecentDmp',
            name: 'TecentDmp',
            component: CrowdTecentDmpIndex,
            children: [
              {
                path: '',
                redirect: "list"
              },
              {
                path: 'list',
                name: 'CrowdTecentDmpList',
                meta: {
                  title: '腾讯DMP人群包列表',
                  nav: '/crowd/tecentDmp'
                },
                component: CrowdTecentDmpList
              },
              {
                path: 'add',
                name: 'CrowdTecentDmpAdd',
                meta: {
                  title: '腾讯DMP新建人群包',
                  nav: '/crowd/tecentDmp'
                },
                component: CrowdTecentDmpAdd
              },
              {
                path: "edit/:id",
                name: "CrowdTecentEdit",
                meta: {
                  title: '腾讯DMP编辑人群包',
                  nav: '/crowd/tecentDmp'
                },
                component: CrowdTecentEdit
              },
              {
                path: "detail/:id",
                name: "CrowdTecentDetail",
                meta: {
                  title: '腾讯DMP查看人群包详情',
                  nav: '/crowd/tecentDmp'
                },
                component: CrowdTecentDetail
              },
            ]
          },

          //秒针 DMP
          {
            path: 'secondDmp',
            name: 'SecondDmp',
            component: CrowdSecondDmpIndex,
            children: [
              {
                path: '',
                redirect: "list"
              },
              {
                path: 'list',
                name: 'CrowdSecondDmpList',
                meta: {
                  title: '秒针DMP人群包列表',
                  nav: '/crowd/secondDmp'
                },
                component: CrowdSecondDmpList
              },
              {
                path: 'add',
                name: 'CrowdSecondDmpAdd',
                meta: {
                  title: '秒针DMP新建人群包',
                  nav: '/crowd/secondDmp'
                },
                component: CrowdSecondDmpAdd
              },
              {
                path: "edit/:id",
                name: "CrowdSecondEdit",
                meta: {
                  title: '秒针DMP编辑人群包',
                  nav: '/crowd/secondDmp'
                },
                component: CrowdSecondEdit
              },
              {
                path: "detail/:id",
                name: "CrowdSecondDetail",
                meta: {
                  title: '秒针DMP查看人群包详情',
                  nav: '/crowd/secondDmp'
                },
                component: CrowdSecondDetail
              },
            ]
          }
        ]
      },
    ]
  },

];

export default routes
