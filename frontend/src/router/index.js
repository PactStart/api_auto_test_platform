import { createRouter, createWebHashHistory } from 'vue-router';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/home',
      component: () => import('../views/Home'),
      meta: {
        isAuth: true,
      },
    },
    {
      path: '/login',
      component: () => import('../views/Login'),
    },
  ],
});
// 路由拦截
router.beforeEach((to, from, next) => {
  //判断是否需要登录权限
  if (to.meta.isAuth) {
    if (localStorage.getItem('token')) {
      next();
    } else {
        message.error('未登录，请先登录');
      router.push('./login');
    }
  } else {
    next();
  }
});
export default router;