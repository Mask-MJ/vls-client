import type { Router } from 'vue-router/auto'

import { PageEnum } from '@/settings/enums'

const WHITE_LIST: string[] = [PageEnum.BASE_LOGIN]
function createPageGuard(router: Router) {
  const controller = new AbortController()

  router.beforeEach(async () => {
    window.$loadingBar?.start()
    controller.abort()
    return true
  })
  router.afterEach(() => {
    window.$loadingBar?.finish()
  })
}

function createPermissionGuard(router: Router) {
  const userStore = useUserStore()

  router.beforeEach(async (to) => {
    const token = userStore.getToken
    // 没有token
    if (!token) {
      if (WHITE_LIST.includes(to.path)) return true
      return { path: PageEnum.BASE_LOGIN, query: { ...to.query, redirect: to.path } }
    }

    // 有token
    // 判断是否有用户信息和路由
    // if (Object.keys(userStore.getUserInfo).length === 0) {
    //   await userStore.getUserInfoAction()
    // }
    if (!userStore.isDynamicAddedRoute) {
      await userStore.getRoutesAction()
    }
    if (to.path === PageEnum.BASE_LOGIN) return { path: PageEnum.BASE_HOME }

    if (to.path === '/') return { path: PageEnum.BASE_HOME }

    if (WHITE_LIST.includes(to.path)) return true

    const routes = router.getRoutes()
    if (routes.some((route) => route.name === to.name)) return true
    return { path: '/404' }
  })
}

export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createPermissionGuard(router)
}
