import { createRouter, createWebHashHistory } from "vue-router";
import homeRouters from './home';
import {message} from 'ant-design-vue';

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("../views/Login"),
  },
  ...homeRouters
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// 路由拦截
router.beforeEach((to, from, next) => {
  //判断是否需要登录权限
  if (to.meta?.isAuth) {
    if (localStorage.getItem("token")) {
      next();
    } else {
      message.error("未登录，请先登录");
      router.push("/login");
    }
  } else {
    if(to.path == '/login' && localStorage.getItem("token")) {
      router.push("/home");
    }
    next();
  }
});

export default router;
