import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router/auto'
import type { LoginParams, UserInfo } from '@/api/user.type'
import type { RemovableRef } from '@vueuse/core'

import { RouterLink } from 'vue-router/auto'
import { getMenusList } from '@/api/role'
import { getUserInfo, login } from '@/api/user'
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
  /** 菜单列表 */
  menus: MenuOption[]
  /** 缓存路由页面 */
  cacheRoutes: RemovableRef<string[]>
}

export const useUserStore = defineStore('user-store', {
  state: (): UserState => ({
    token: useStorage(TOKEN_KEY, null),
    userInfo: useStorage(USER_INFO_KEY, {} as UserInfo),
    isDynamicAddedRoute: false,
    backendRouteList: [],
    menus: [],
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
        // await doLogout()
      }
      this.setToken()
      this.setUserInfo()
      router.push('/login')
    },
    /** 获取路由 */
    async getRoutesAction() {
      const data = await getMenusList()

      const map: any = {}
      const tree = data
        .filter((item) => item.hidden === false)
        .sort((a, b) => a.id - b.id)
        .reduce((acc, node) => {
          map[node.id] = {
            key: node.path,
            label: () =>
              node.parentId === 0
                ? h('span', node.name)
                : h(RouterLink, { to: { path: node.path } }, { default: () => node.name }),
            icon: () => h('i', { class: node.icon }),
            children: node.parentId === 0 ? [] : null,
            sort: node.sort
          }
          if (node.parentId === 0) {
            acc.push(map[node.id])
          } else {
            map[node.parentId]?.children.push(map[node.id])
          }

          return acc
        }, [] as MenuOption[])
        .map((item) => {
          if (!item.children?.length) {
            item.children = undefined
          }
          return item
        })
      this.setMenus(tree)

      const routes = data.map((item) => {
        return {
          path: item.path,
          name: item.name,
          redirect: '',
          meta: {
            title: item.name,
            icon: item.icon,
            sort: item.sort,
            hidden: false,
            id: item.id,
            parentId: item.parentId
          }
        }
      })
      this.setBackendRouteList(routes)
      this.isDynamicAddedRoute = true
      return routes
    },
    /** 设置路由 */
    setBackendRouteList(list: RouteRecordRaw[]) {
      this.backendRouteList = list
    },
    /** 设置缓存路由 */
    setCacheRoutes(list: string[]) {
      this.cacheRoutes = list
    },
    /** 设置菜单 */
    setMenus(list: any[]) {
      this.menus = list
    }
  }
})
