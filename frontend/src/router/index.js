import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("../views/Login"),
  },
  {
    path: "/home",
    name: 'home',
    component: () => import("../views/Home"),
    meta: {
      isAuth: true,
      title: '首页',
    },
    children: [
      {
        path: "/app",
        name: 'app',
        meta: {
          isAuth: true,
          title: "应用管理",
          open: true,
        },
        children: [
          {
            path: "/app/app",
            name: 'app',
            component: () => import("../views/app/app/App.vue"),
            meta: {
              isAuth: true,
              title: "应用列表",
            },
          },
          {
            path: "/app/appConfig",
            name: 'appConfig',
            component: () => import("../views/app/appConfig/AppConfig.vue"),
            meta: {
              isAuth: true,
              title: "应用配置",
            },
          },
          {
            path: "/app/api",
            name: 'api',
            component: () => import("../views/app/api/Api.vue"),
            meta: {
              isAuth: true,
              title: "API 管理",
            },
          }
        ],
      },
      {
        path: "/test",
        name: 'test',
        meta: {
          isAuth: true,
          title: "测试管理",
          open: true,
        },
        children: [
          {
            path: "/test/testCase",
            name: 'testCase',
            component: () => import("../views/test/testCase/TestCase.vue"),
            meta: {
              isAuth: true,
              title: "测试用例",
            },
          },
          {
            path: "/app/testPlan",
            name:'testPlan',
            component: () => import("../views/test/testPlan/TestPlan.vue"),
            meta: {
              isAuth: true,
              title: "测试计划",
            },
          },
        ]
      },
      {
        path: "/sys",
        name: 'sys',
        meta: {
          isAuth: true,
          title: "系统管理",
          open: true,
        },
        children: [
          {
            path: "/sys/user",
            name: 'user',
            component: () => import("../views/sys/user/User.vue"),
            meta: {
              isAuth: true,
              title: "用户管理",
            },
          },
          {
            path: "/sys/role",
            name: 'role',
            component: () => import("../views/sys/role/Role.vue"),
            meta: {
              isAuth: true,
              title: "角色管理",
            },
          },
          {
            path: "/sys/permission",
            name: 'permission',
            component: () => import("../views/sys/permission/Permission.vue"),
            meta: {
              isAuth: true,
              title: "权限管理",
            },
          },
          {
            path: "/sys/authorize",
            name: 'authorize',
            component: () => import("../views/sys/authorize/Authorize.vue"),
            meta: {
              isAuth: true,
              title: "授权管理",
            },
          },
        ],
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// 路由拦截
router.beforeEach((to, from, next) => {
  //判断是否需要登录权限
  if (to.meta.isAuth) {
    if (localStorage.getItem("token")) {
      next();
    } else {
      message.error("未登录，请先登录");
      router.push("./login");
    }
  } else {
    next();
  }
});
const menuRoutes = routes.find((r) => r.name === "home");

export {
  router,
  menuRoutes
};
