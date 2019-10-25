import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import {
  getToken,
  canTurnTo,
  setTitle,
  initRouterNode,
  getMenuByRouter
} from '@/libs/util'
import lazyLoading from "@/libs/lazyLoading"
import config from '@/config'
import {
  menuRight
} from '@/api/admin-user'
const {
  homeName,
  routerMode
} = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: routerMode
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({
    replace: true,
    name: 'error_401'
  }) // 无权限，重定向到401页面
}

router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next(); // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (!store.state.app.menuList.length) {
      var res = await menuRight();
      if (!res.code) {
        var routers = [];
        initRouterNode(routers, res.data);
        routers.push({
          path: '*',
          name: 'error_404',
          meta: {
            hideInMenu: true
          },
          component: lazyLoading('error-page/404')
        });
        router.addRoutes(routers);
        router.options.routes.push(...routers);
        store.commit('setMenuList', getMenuByRouter(router.options.routes));
      }
      if (!to.matched.length) {
        next({
          path: to.path
        });
        return;
      }
    }
    turnTo(to, [], next);
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
