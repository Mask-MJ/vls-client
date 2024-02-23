<script setup lang="ts">
const router = useRouter()
// 重定向到 templates 页面
window.$message.warning('请从 templates 页面进入')
router.push('/system/templates')
</script>

<template>
  <div> </div>
</template>

<style lang="" scoped></style>
