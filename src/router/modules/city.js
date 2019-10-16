// 用户管理模块 路由配置
import Layout from '@/layout'

const cityRouter = {
  path: '/city',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/city/index'),
      name: 'city',
      meta: {
        title: '城市列表',
        icon: 'form'
      }
    },
    {
      path: 'confGrade',
      component: () => import('@/views/city/grade'),
      name: 'city.confGrade',
      meta: {
        title: '配置年级'
      },
      hidden: true
    }
  ]
}
export default cityRouter
