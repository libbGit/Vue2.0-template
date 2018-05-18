/*
 * 项目管理
 */

import LayoutProject from '@/views/layout/LayoutProject'

// 项目
import ProjectManage from '@/views/ad/project/manage'

import ProjectCreate from '@/views/ad/project/create'
import ProjectEdit from '@/views/ad/project/create/edit'

import ProjectOverview from '@/views/ad/project/overview'

// 活动
import ActivityManage from '@/views/ad/activity/manage'
import ActivityOverview from '@/views/ad/activity/overview'
import ActivityCreate from '@/views/ad/activity/create'
import ActivityEdit from '@/views/ad/activity/create/edit'
// import ProjectCreate from '@/views/project/create'

// 计划
import CampaignManage from '@/views/ad/campaign/manage'

import CampaignStep1 from '@/views/ad/campaign/create/step1'
import CampaignStep2 from '@/views/ad/campaign/create/step2'
import CampaignStep3 from '@/views/ad/campaign/create/step3'
import CampaignStep4 from '@/views/ad/campaign/create/step4'

import CampaignOverview from '@/views/ad/campaign/overview'

//创意
import CreativeList from '@/views/ad/creative'
import CreativeDetail from '@/views/ad/creative/detail'


//创意组
import CreativeGroupList from '@/views/ad/creative-group'
import CreativeGroupDetail from '@/views/ad/creative-group/detail'

//列表包
import plan from "@/views/ad/listPack/plan.vue"
import Crowd from '@/views/ad/listPack/crowd.vue'
import Media from "@/views/ad/listPack/media.vue"
import Point from "@/views/ad/listPack/point.vue"

let routes = [{
  path: '/ad',
  component: LayoutProject,
  children: [
    // ------------- project start-----------------
    {
      path: 'project',
      redirect: 'project/manage',
    }, {
      path: 'project/manage',
      name: 'ProjectManage',
      component: ProjectManage,
      meta: {
        hasTree: true,
      },
    }, {
      path: 'project/overview',
      name: 'ProjectOverview',
      component: ProjectOverview,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'project/schedule', //暂未开发的路由
      name: 'ProjectSchedule',
      component: ProjectOverview,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'project/create',
      name: 'ProjectCreate',
      component: ProjectCreate
    }, {
      path: 'project/edit/:id',
      name: 'ProjectEdit',
      component: ProjectEdit
    }, {
      path: 'project/plan',
      name: 'plan',
      component: plan,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'project/creative-group/list',
      name: 'ProjectCreativeGrouplist', //项目级别的创意组列表
      component: CreativeGroupList,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'project/creative-group/detail',
      name: 'ProjectCreativeGroupDetail', //项目级别的创意组详情
      component: CreativeGroupDetail
    }, {
      path: 'project/creative/list',
      name: 'ProjectCreativelist', //项目级别的创意列表
      component: CreativeList,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'project/creative/detail',
      name: 'ProjectCreativeDetail', //项目级别的创意组详情
      component: CreativeDetail
    },
    // ------------- project end-----------------

    // ------------- activity start-----------------
    {
      path: 'activity/manage',
      name: 'ActivityManage',
      component: ActivityManage,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/overview',
      name: 'ActivityOverview',
      component: ActivityOverview,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/plan', //暂未开发的路由
      name: 'ActivityPlan',
      component: ActivityOverview,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/budget-manage', //暂未开发的路由
      name: 'ActivityBudgetManage',
      component: ActivityOverview,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/create',
      name: 'ActivityCreate',
      component: ActivityCreate
    }, {
      path: 'activity/edit/:id',
      name: 'ActivityEdit',
      component: ActivityEdit
    }, {
      path: 'activity/crowd',
      name: 'ActivityCrowd',
      component: Crowd,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/media',
      name: 'ActivityMedia',
      component: Media,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/point',
      name: 'ActivitypPoint',
      component: Point,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/creative-group/list',
      name: 'ActivityCreativeGrouplist', //活动级别的创意组列表
      component: CreativeGroupList,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/creative-group/detail',
      name: 'ActivityCreativeGroupDetail', //活动级别的创意组详情
      component: CreativeGroupDetail
    }, {
      path: 'activity/creative/list',
      name: 'ActivityCreativelist', //活动级别的创意列表
      component: CreativeList,
      meta: {
        hasTree: true,
      }
    }, {
      path: 'activity/creative/detail',
      name: 'ActivityCreativeDetail', //活动级别的创意组详情
      component: CreativeDetail
    },
    // ------------- activity end-----------------
    // ------------- campaign start-----------------
    {
      path: 'campaign/manage',
      name: 'CampaignManage',
      component: CampaignManage,
      meta: {
        hasTree: true,
      }
    },{
      path: 'campaign/create',
      redirect: 'campaign/step1'
    },{
      path: 'campaign/step1',
      name: 'CampaignStep1',
      meta: {
        sub_nav: '/ad/campaign/manage',
        hasTree: true,
      },
      component: CampaignStep1
    },{
      path: 'campaign/step2',
      name: 'CampaignStep2',
      meta: {
        sub_nav: '/ad/campaign/manage',
        hasTree: true,
      },
      component: CampaignStep2
    },{
      path: 'campaign/step3',
      name: 'CampaignStep3',
      meta: {
        sub_nav: '/ad/campaign/manage',
        hasTree: true,
      },
      component: CampaignStep3
    },{
      path: 'campaign/step4',
      name: 'CampaignStep4',
      meta: {
        sub_nav: '/ad/campaign/manage',
        hasTree: true,
      },
      component: CampaignStep4
    },{
      path: 'campaign/overview',
      name: 'CampaignOverview',
      component: CampaignOverview,
      meta: {
        hasTree: true,
      }
    },{
      path: 'campaign/media', //暂未开发的路由
      name: 'CampaignMedia',
      component: Media,
      meta: {
        hasTree: true,
      }
    },{
      path: 'campaign/point', //暂未开发的路由
      name: 'CampaignPoint',
      component: Point,
      meta: {
        hasTree: true,
      }
    },{
      path: 'campaign/crowd',
      name: 'CampaignCrowd',
      component: Crowd,
      meta: {
        hasTree: true,
      }
    },{
      path: 'campaign/creative-group/list',
      name: 'CampaignCreativeGrouplist', //计划级别的创意组列表
      component: CreativeGroupList,
      meta: {
        hasTree: true,
      }
    },{
      path: 'campaign/creative-group/detail',
      name: 'CampaignCreativeGroupDetail', //计划级别的创意组详情
      component: CreativeGroupDetail
    },{
      path: 'campaign/creative/list',
      name: 'CampaignCreativelist', //计划级别的创意列表
      component: CreativeList,
      meta: {
        hasTree: true,
      }
    },{
      path: 'campaign/creative/detail',
      name: 'CampaignCreativeDetail', //计划级别的创意组详情
      component: CreativeDetail
    },
    // ------------- campaign start-----------------
  ]
}]
routes = routes.map(item => {
  item.children.map(child => {
    if (!child.meta) {
      child.meta = {}
    }
    child.meta.nav = '/ad/project';
    child.meta.title = '项目管理';
  })
  return item;
})
export default routes
