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
    path: "/cards",
    name: "卡管理",
    icon: "form",
    routes: [
      {
        path: "/cards/index",
        name: "卡详情",
        component: "./cards/list"
      }
    ]
  }, {
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
  }, {
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
  }, {
    component: "404"
  }
];

export default {
  "GET /api/menu": mock_menu
};
