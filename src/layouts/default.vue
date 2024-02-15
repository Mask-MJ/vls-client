<script setup lang="ts">
import Header from './components/Header/index.vue'
import Sider from './components/Sider/index.vue'

import { useBasicLayout } from './components/hooks'

const app = useAppStore()
const theme = useThemeStore()
const { headerProps } = useBasicLayout()
console.log('headerProps', headerProps)
const width = computed(() => theme.sider.width)
const collapsedWidth = computed(() => theme.sider.collapsedWidth)
const siderCollapse = computed(() => app.siderCollapse)
</script>

<template>
  <n-layout has-sider class="wh-full">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :width="width"
      :collapsed-width="collapsedWidth"
      :native-scrollbar="false"
      :collapsed="siderCollapse"
      content-style="height: 100%"
    >
      <Sider />
    </n-layout-sider>
    <n-layout content-style="display:flex; flex-flow: column; height: 100%">
      <n-layout-header>
        <Header v-bind="headerProps" />
        <!-- <LayoutTabs /> -->
      </n-layout-header>
      <n-layout-content
        class="bg-[#f6f9f8] dark:bg-[#101014] transition duration-300 ease-in-out p-4"
        content-style="height: 100%"
        :native-scrollbar="false"
      >
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
