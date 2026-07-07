<script setup lang="ts">
import { getValveDetail, getValveScore } from '@/api/project/valve'
import { isObject } from 'lodash-es'

const router = useRouter()
const valveDetail = ref<any>({})

const tableData = ref<{ key: string; value: number }[]>([])

function digui(data: any) {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key]
      if (isObject(element)) {
        digui(element)
      } else {
        tableData.value.push({ key, value: element })
      }
    }
  }
}

function getScoreType(score: number) {
  if (score >= 85) {
    return 'success'
  } else if (score >= 60) {
    return 'warning'
  } else {
    return 'error'
  }
}

watch(
  () => (router.currentRoute.value.params as { id: string }).id,
  async (val) => {
    if (!val || !Number(val)) return
    valveDetail.value = await getValveDetail(Number(val))
    tableData.value = []
    const result = await getValveScore(Number(val))
    result.forEach((item: any) => {
      digui(item.infor)
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex">
    <n-card class="mr-2 w-1/4" title="编辑阀门">
      <div>最终用户：{{ valveDetail.factory?.name }}</div>
      <div>装置：{{ valveDetail.unit }}</div>
      <div>位号：{{ valveDetail.tag }}</div>
    </n-card>
    <n-card>
      <n-scrollbar style="max-height: 700px">
        <n-descriptions label-placement="left" bordered :column="1">
          <n-descriptions-item v-for="item in tableData" :key="item.key" :label="item.key">
            <n-tag :type="getScoreType(item.value)">{{ item.value }}</n-tag>
          </n-descriptions-item>
        </n-descriptions>
      </n-scrollbar>
    </n-card>
  </div>
</template>

<style scoped></style>
