// 用户管理模块 路由配置
import Layout from '@/layout'

const activityRouter = {
  path: '/activity',
  redirect: '/activity/table',
  component: Layout,
  name: 'Activity',
  meta: { title: 'banner活动', icon: 'example' },
  children: [
    {
      path: 'table',
      name: 'Table',
      component: () => import('@/views/activity/activityList'),
      meta: { title: '活动列表', icon: 'table' }
    },
    {
      path: 'tree',
      name: 'Tree',
      component: () => import('@/views/activity/courseList'),
      meta: { title: '课程列表', icon: 'tree' }
    },
    {
      path: 'confCourse',
      component: () => import('@/views/activity/course'),
      name: 'activity.confCourse',
      meta: {
        title: '配置课程'
      },
      hidden: true
    }
  ]
}
export default activityRouter
