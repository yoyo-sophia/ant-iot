const mock_menu = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "dashboard",
    authority: ["admin", "user"],
    children: [{
      // authority: undefined,
      exact: true,
      name: "分析页",
      path: "/dashboard/analysis"
    }, {
      // authority: undefined,
      exact: true,
      name: "监控页",
      path: "/dashboard/monitor"
    }, {
      // authority: undefined,
      exact: true,
      name: "工作台",
      path: "/dashboard/workplace"
    }]
  }, {
    path: "/authority",
    name: "系统设置",
    icon: "form",
    routes: [
      {
        path: "/authority/node_setting",
        name: "节点设置",
        component: "./Authority/node_setting"
      }, {
        path: "/authority/role_setting",
        name: "角色设置",
        component: "./Authority/role_setting"
      }, {
        path: "/authority/account_setting",
        name: "账号设置",
        component: "./Authority/account_setting"
      }
    ]

  }, {
    path: "/form",
    icon: "form",
    name: "表单",
    routes: [
      {
        path: "/form/basic-form",
        name: "基础表单"
      },
      {
        path: "/form/step-form",
        name: "分步表单",
        // hideChildrenInMenu: true,
        children: [
          {
            path: "/form/step-form",
            redirect: "/form/step-form/info"
          },
          {
            path: "/form/step-form/info",
            name: "info",
            component: "./Forms/StepForm/Step1"
          },
          {
            path: "/form/step-form/confirm",
            name: "confirm",
            component: "./Forms/StepForm/Step2"
          },
          {
            path: "/form/step-form/result",
            name: "result",
            component: "./Forms/StepForm/Step3"
          }
        ]
      },
      {
        path: "/form/advanced-form",
        name: "高级表单",
        authority: ["admin"]
      }
    ]
  },
  {
    path: "/list",
    icon: "table",
    name: "list",
    routes: [
      {
        path: "/list/table-list",
        name: "searchtable",
        component: "./List/TableList"
      },
      {
        path: "/list/basic-list",
        name: "basiclist",
        component: "./List/BasicList"
      },
      {
        path: "/list/card-list",
        name: "cardlist",
        component: "./List/CardList"
      },
      {
        path: "/list/search",
        name: "searchlist",
        component: "./List/List",
        routes: [
          {
            path: "/list/search",
            redirect: "/list/search/articles"
          },
          {
            path: "/list/search/articles",
            name: "articles",
            component: "./List/Articles"
          },
          {
            path: "/list/search/projects",
            name: "projects",
            component: "./List/Projects"
          },
          {
            path: "/list/search/applications",
            name: "applications",
            component: "./List/Applications"
          }
        ]
      }
    ]
  },
  {
    path: "/profile",
    name: "profile",
    icon: "profile",
    routes: [
      // profile
      {
        path: "/profile/basic",
        name: "basic",
        component: "./Profile/BasicProfile"
      },
      {
        path: "/profile/basic/:id",
        name: "basic",
        hideInMenu: true,
        component: "./Profile/BasicProfile"
      },
      {
        path: "/profile/advanced",
        name: "advanced",
        authority: ["admin"],
        component: "./Profile/AdvancedProfile"
      }
    ]
  },
  {
    name: "result",
    icon: "check-circle-o",
    path: "/result",
    routes: [
      // result
      {
        path: "/result/success",
        name: "success"
        // component: './Result/Success',
      }
      // { path: '/result/fail', name: 'fail', component: './Result/Error' },
    ]
  },
  {
    name: "exception",
    icon: "warning",
    path: "/exception",
    routes: [
      // exception
      {
        path: "/exception/403",
        name: "not-permission",
        component: "./Exception/403"
      },
      {
        path: "/exception/404",
        name: "not-find",
        component: "./Exception/404"
      },
      {
        path: "/exception/500",
        name: "server-error",
        component: "./Exception/500"
      },
      {
        path: "/exception/trigger",
        name: "trigger",
        hideInMenu: true,
        component: "./Exception/TriggerException"
      }
    ]
  },
  {
    name: "account",
    icon: "user",
    path: "/account",
    routes: [
      {
        path: "/account/center",
        name: "center",
        component: "./Account/Center/Center",
        routes: [
          {
            path: "/account/center",
            redirect: "/account/center/articles"
          },
          {
            path: "/account/center/articles",
            component: "./Account/Center/Articles"
          },
          {
            path: "/account/center/applications",
            component: "./Account/Center/Applications"
          },
          {
            path: "/account/center/projects",
            component: "./Account/Center/Projects"
          }
        ]
      },
      {
        path: "/account/settings",
        name: "settings",
        component: "./Account/Settings/Info",
        routes: [
          {
            path: "/account/settings",
            redirect: "/account/settings/base"
          },
          {
            path: "/account/settings/base",
            component: "./Account/Settings/BaseView"
          },
          {
            path: "/account/settings/security",
            component: "./Account/Settings/SecurityView"
          },
          {
            path: "/account/settings/binding",
            component: "./Account/Settings/BindingView"
          },
          {
            path: "/account/settings/notification",
            component: "./Account/Settings/NotificationView"
          }
        ]
      }
    ]
  },
  {
    component: "404"
  }
];

export default {
  "GET /api/menu": mock_menu
};
