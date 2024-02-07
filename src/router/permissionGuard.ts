import type { Router } from 'vue-router/auto'

const WHITE_LIST = ['/login', '/404']
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
      return { path: '/login', query: { ...to.query, redirect: to.path } }
    }

    // 有token
    if (to.path === '/login') return { path: '/' }

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
