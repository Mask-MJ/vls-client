<script setup lang="ts">
import { getValveScore } from '@/api/project/valve'
import { useModalInner } from '@/components/Modal'
import { isObject } from 'lodash-es'

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

const [registerModal] = useModalInner(async (data) => {
  tableData.value = []
  const result = await getValveScore(data.id)
  result.forEach((item: any) => {
    digui(item.infor)
  })
  // tableData.value = result
  // console.log(tableData)
})
</script>

<template>
  <Modal title="阀门评分" class="!w-180" @register="registerModal" positiveText="">
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item v-for="item in tableData" :key="item.key" :label="item.key">
        <n-tag :type="getScoreType(item.value)">{{ item.value }}</n-tag>
      </n-descriptions-item>
    </n-descriptions>
    <!-- <ul v-for="item in tableData" :key="item.key">
      <li>{{ item.key }} : {{ item.value }}</li>
    </ul> -->
  </Modal>
</template>

<style lang="" scoped></style>
