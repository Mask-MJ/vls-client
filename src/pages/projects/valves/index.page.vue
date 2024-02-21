<script setup lang="ts">
const router = useRouter()
// 重定向到 factories 页面
window.$message.warning('请从 factories 页面进入')
router.push('/projects/factories')
</script>

<template>
  <div> </div>
</template>

<style lang="" scoped></style>
