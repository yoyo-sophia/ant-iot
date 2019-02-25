const mock_menu = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    locale: 'menu.dashboard',
    authority: ['admin', 'user'],
    children: [{
      // authority: undefined,
      exact: true,
      // locale: "menu.dashboard.analysis",
      name: "分析页",
      path: "/dashboard/analysis",
    }, {
      // authority: undefined,
      exact: true,
      // locale: "menu.dashboard.monitor",
      name: "监控页",
      path: "/dashboard/monitor",
    }, {
      // authority: undefined,
      exact: true,
      // locale: "menu.dashboard.workplace",
      name: "工作台",
      path: "/dashboard/workplace",
    }],
  },
  {
    path: '/form',
    icon: 'form',
    name: 'form',
    routes: [
      {
        path: '/form/basic-form',
        name: 'basicform',
      },
      {
        path: '/form/step-form',
        name: 'stepform',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/form/step-form',
            redirect: '/form/step-form/info',
          },
          {
            path: '/form/step-form/info',
            name: 'info',
            component: './Forms/StepForm/Step1',
          },
          {
            path: '/form/step-form/confirm',
            name: 'confirm',
            component: './Forms/StepForm/Step2',
          },
          {
            path: '/form/step-form/result',
            name: 'result',
            component: './Forms/StepForm/Step3',
          },
        ],
      },
      {
        path: '/form/advanced-form',
        name: 'advancedform',
        authority: ['admin'],
      },
    ],
  },
];

export default {
  'GET /api/menu': mock_menu,
};
