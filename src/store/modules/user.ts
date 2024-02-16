import type { RouteRecordRaw } from 'vue-router/auto'
import type { LoginParams, UserInfo } from '@/api/user.type'
import type { RemovableRef } from '@vueuse/core'

import { doLogout, getUserInfo, login } from '@/api/user'
import { router } from '@/router'
import { CACHE_ROUTES, PageEnum, TOKEN_KEY, USER_INFO_KEY } from '@/settings/enums'
import { defineStore } from 'pinia'

interface UserState {
  /** Token */
  token: RemovableRef<string | null>
  /** 用户信息 */
  userInfo: RemovableRef<UserInfo>
  /** 路由是否动态添加 */
  isDynamicAddedRoute: boolean
  /** 后台返回的路由列表 */
  backendRouteList: RouteRecordRaw[]
  /** 缓存路由页面 */
  cacheRoutes: RemovableRef<string[]>
}

export const useUserStore = defineStore('user-store', {
  state: (): UserState => ({
    token: useStorage(TOKEN_KEY, null),
    userInfo: useStorage(USER_INFO_KEY, {} as UserInfo),
    isDynamicAddedRoute: false,
    backendRouteList: [],
    cacheRoutes: useStorage(CACHE_ROUTES, [])
  }),
  getters: {
    getToken(): string {
      return this.token || ''
    },
    getUserInfo(): UserInfo {
      return this.userInfo || ({} as UserInfo)
    }
  },
  actions: {
    setToken(info: string | null = null) {
      this.token = info
    },
    setUserInfo(info?: UserInfo) {
      this.userInfo = info || ({} as UserInfo)
    },
    async login(params: LoginParams) {
      try {
        const { accessToken } = await login(params)
        this.setToken(accessToken)
        await this.getUserInfoAction()
        const redirect = router.currentRoute.value.query.redirect
        router.push(redirect ? (redirect as string) : PageEnum.BASE_HOME)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null
      const result = await getUserInfo()
      this.setUserInfo(result)
      return result
    },
    async logout() {
      if (this.getToken) {
        await doLogout()
      }
      this.setToken()
      this.setUserInfo()
      router.push('/login')
    },
    /** 获取路由 */
    async getRoutesAction() {
      // const routes = await getRoutes()
      const data = [
        {
          id: 1,
          name: 'Dashboard',
          title: '首页',
          path: '/dashboard',
          icon: 'i-line-md:home',
          sort: 1,
          hidden: false
        },
        {
          id: 2,
          name: 'Factorys',
          title: '工厂管理',
          path: '/factorys',
          icon: 'i-line-md:briefcase',
          sort: 2,
          hidden: false
        },
        {
          id: 3,
          name: 'Valves',
          title: '阀门管理',
          path: '/valves',
          icon: 'i-line-md:compass-loop',
          sort: 3,
          hidden: false
        },
        {
          id: 4,
          name: 'Keywords',
          title: '关键字管理',
          path: '/keywords',
          icon: 'i-line-md:list-3 ',
          sort: 4,
          hidden: false
        },
        {
          id: 5,
          name: 'Tasks',
          title: '分析任务管理',
          path: '/tasks',
          icon: 'i-line-md:check-list-3 ',
          sort: 5,
          hidden: false
        },
        {
          id: 6,
          name: 'Users',
          title: '用户管理',
          path: '/users',
          icon: 'i-line-md:account ',
          sort: 6,
          hidden: false
        },
        {
          id: 7,
          name: 'Roles',
          title: '权限管理',
          path: '/roles',
          icon: 'i-line-md:text-box-multiple',
          sort: 7,
          hidden: false
        }
      ]
      const routes = data.map((item) => {
        return {
          path: item.path,
          name: item.name,
          redirect: '',
          meta: { title: item.title, icon: item.icon, sort: item.sort, hidden: false }
        }
      })
      this.setBackendRouteList(routes)
      return routes
    },
    /** 设置路由 */
    setBackendRouteList(list: RouteRecordRaw[]) {
      this.backendRouteList = list
    },
    /** 设置缓存路由 */
    setCacheRoutes(list: string[]) {
      this.cacheRoutes = list
    }
  }
})
