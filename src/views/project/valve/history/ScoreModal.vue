<script setup lang="ts">
import { useModalInner } from '@/components/Modal'

const scoreDetail = ref<any>({})

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
  scoreDetail.value = data.infor
})
</script>

<template>
  <Modal title="阀门评分" class="!w-180" @register="registerModal" positiveText="">
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item label="总分">
        <n-tag :type="getScoreType(scoreDetail.totalScore)">{{ scoreDetail.totalScore }}</n-tag>
      </n-descriptions-item>
      <n-descriptions-item
        v-for="item in scoreDetail.ruleScore"
        :key="item.name"
        :label="item.name"
      >
        <n-tag :type="getScoreType(item.value)">{{ item.value }}</n-tag>
      </n-descriptions-item>
      <n-descriptions-item
        v-for="item in scoreDetail.trendScore"
        :key="item.name"
        :label="item.name"
      >
        <n-tag :type="getScoreType(item.value)">{{ item.value }}</n-tag>
      </n-descriptions-item>
    </n-descriptions>
  </Modal>
</template>
