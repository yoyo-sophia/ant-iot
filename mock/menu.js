const mock_menu = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "dashboard",
    authority: ["admin", "user"],
    children: [{
      exact: true,
      name: "分析页",
      path: "/dashboard/analysis"
    }, {
      exact: true,
      name: "监控页",
      path: "/dashboard/monitor"
    }, {
      exact: true,
      name: "工作台",
      path: "/dashboard/workplace"
    }]
  }, {
    path: "/authority",
    name: "系统设置",
    icon: "form",
    children: [
      {
        path: "/authority/node_setting",
        name: "节点设置",
      }, {
        path: "/authority/role_setting",
        name: "角色设置",
      }, {
        path: "/authority/account_setting",
        name: "账号设置",
      }
    ]

  }, {
    path: "/form",
    icon: "form",
    name: "表单",
    children: [
      {
        path: "/form/basic-form",
        name: "基础表单"
      },
      {
        path: "/form/step-form",
        name: "分步表单",
        children: [
          {
            path: "/form/step-form",
            redirect: "/form/step-form/info"
          },
          {
            path: "/form/step-form/info",
            name: "info",
          },
          {
            path: "/form/step-form/confirm",
            name: "confirm",
          },
          {
            path: "/form/step-form/result",
            name: "result",
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
    children: [
      {
        path: "/list/table-list",
        name: "searchtable",
      },
      {
        path: "/list/basic-list",
        name: "basiclist",
      },
      {
        path: "/list/card-list",
        name: "cardlist",
      },
      {
        path: "/list/search",
        name: "searchlist",
        children: [
          {
            path: "/list/search",
            redirect: "/list/search/articles"
          },
          {
            path: "/list/search/articles",
            name: "articles",
          },
          {
            path: "/list/search/projects",
            name: "projects",
          },
          {
            path: "/list/search/applications",
            name: "applications",
          }
        ]
      }
    ]
  },
  {
    path: "/profile",
    name: "profile",
    icon: "profile",
    children: [
      // profile
      {
        path: "/profile/basic",
        name: "basic",
      },
      {
        path: "/profile/basic/:id",
        name: "basic",
        hideInMenu: true,
      },
      {
        path: "/profile/advanced",
        name: "advanced",
      }
    ]
  },
  {
    name: "result",
    icon: "check-circle-o",
    path: "/result",
    children: [
      {
        path: "/result/success",
        name: "success"
      }
    ]
  },
  {
    name: "exception",
    icon: "warning",
    path: "/exception",
    children: [
      {
        path: "/exception/403",
        name: "not-permission",
      },
      {
        path: "/exception/404",
        name: "not-find",
      },
      {
        path: "/exception/500",
        name: "server-error",
      },
      {
        path: "/exception/trigger",
        name: "trigger",
      }
    ]
  },
  {
    name: "account",
    icon: "user",
    path: "/account",
    children: [
      {
        path: "/account/center",
        name: "center",
        children: [
          {
            path: "/account/center",
            redirect: "/account/center/articles"
          },
          {
            path: "/account/center/articles",
          },
          {
            path: "/account/center/applications",
          },
          {
            path: "/account/center/projects",
          }
        ]
      },
      {
        path: "/account/settings",
        name: "settings",
        children: [
          {
            path: "/account/settings",
            redirect: "/account/settings/base"
          },
          {
            path: "/account/settings/base",
          },
          {
            path: "/account/settings/security",
          },
          {
            path: "/account/settings/binding",
          },
          {
            path: "/account/settings/notification",
          }
        ]
      }
    ]
  },
];

export default {
  "GET /api/menu": mock_menu
};
