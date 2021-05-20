/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-05-27 17:53:58
 * @LastEditTime: 2020-10-19 10:21:11
 * @LastEditors: ssssslf
 */
export default [
  {
    path: '/',
    component: () => import('./index'),
    routes: [
      {
        // 预警配置
        path: '/quality/warning_config',
        exact: true,
        component: () => import('./warningConfig'),
      },
      {
        // 质检方案
        path: '/quality/plan_config',
        exact: true,
        component: () => import('./planConfig'),
      },
      {
        // 电话 type: wait 待质检列表 rate 已领取
        path: '/quality/waiting/phone/wait',
        exact: true,
        component: () => import('./phone'),
      },
      {
        // 电话 type: wait 待质检列表 rate 已领取
        path: '/quality/waiting/phone/rate',
        exact: true,
        component: () => import('./phone'),
      },
      {
        // type: wait 待质检列表 rate 已领取
        path: '/quality/waiting/wait',
        exact: true,
        component: () => import('./QCList'),
      },
      {
        // type: wait 待质检列表 rate 已领取
        path: '/quality/waiting/rate',
        exact: true,
        component: () => import('./QCList'),
      },
      {
        // 结果查询-客服登录
        path: '/quality/result/cs',
        exact: true,
        component: () => import('./Result/customerService'),
      },
      {
        // 结果查询-质检员登录
        path: '/quality/result/qc',
        exact: true,
        component: () => import('./Result/QC'),
      },
      {
        // 申诉审核
        path: '/quality/complaint',
        exact: true,
        component: () => import('./complaintLog'),
      },
      {
        // 统计报表
        path: '/quality/report',
        exact: true,
        component: () => import('./report'),
      },
    ],
  },
];
