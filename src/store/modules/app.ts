import type { RouteRecordRaw } from 'vue-router/auto'

import { defineStore } from 'pinia'

export interface AppState {
  /** 重载页面(控制页面的显示) */
  reloadFlag: boolean
  /** 项目配置的抽屉可见状态 */
  settingDrawerVisible: boolean
  /** 侧边栏折叠状态 */
  siderCollapse: boolean
  /** vertical-mix模式下 侧边栏的固定状态 */
  mixSiderFixed: boolean
  // 后台返回的路由列表
  backendRouteList: RouteRecordRaw[]
  // 缓存路由页面
  cacheRoutes: string[]
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    reloadFlag: true,
    settingDrawerVisible: false,
    siderCollapse: false,
    mixSiderFixed: false,
    backendRouteList: [],
    cacheRoutes: []
  }),
  actions: {
    /**
     * 重载页面
     * @param duration - 重载的延迟时间(ms)
     */
    async reloadPage(duration = 0) {
      this.reloadFlag = false
      await nextTick()
      if (duration) {
        setTimeout(() => {
          this.reloadFlag = true
        }, duration)
      } else {
        this.reloadFlag = true
      }
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 })
      }, 100)
    },
    /** 打开设置抽屉 */
    openSettingDrawer() {
      this.settingDrawerVisible = true
    },
    /** 关闭设置抽屉 */
    closeSettingDrawer() {
      this.settingDrawerVisible = false
    },
    /** 切换抽屉可见状态 */
    toggleSettingDrawerVisible() {
      this.settingDrawerVisible = !this.settingDrawerVisible
    },
    /** 设置侧边栏折叠状态 */
    setSiderCollapse(collapse: boolean) {
      this.siderCollapse = collapse
    },
    /** 折叠/展开 侧边栏折叠状态 */
    toggleSiderCollapse() {
      this.siderCollapse = !this.siderCollapse
    },
    /** 设置 vertical-mix模式下 侧边栏的固定状态 */
    setMixSiderIsFixed(isFixed: boolean) {
      this.mixSiderFixed = isFixed
    },
    /** 设置 vertical-mix模式下 侧边栏的固定状态 */
    toggleMixSiderFixed() {
      this.mixSiderFixed = !this.mixSiderFixed
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
