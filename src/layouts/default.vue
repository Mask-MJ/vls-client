<script setup lang="ts">
import Sider from './components/Sider/index.vue'

const app = useAppStore()
const theme = useThemeStore()
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
    <router-view />
  </n-layout>
</template>
