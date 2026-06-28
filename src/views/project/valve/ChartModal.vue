<script setup lang="ts">
import { useModalInner } from '@/components/Modal'
import { getValveHistoryChart } from '@/api/project/valve'
import { getDictDataCharts } from '@/api/system/dict'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent
} from 'echarts/components'
use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent
])

const option = ref<any>({
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ data: [], type: 'line', markLine: { data: [] } }]
})
const valveId = ref()
const value = ref('')
const range = ref<[number, number]>()
const options = ref<any[]>([])
const [registerModal, { setModalProps }] = useModalInner(async (data) => {
  setModalProps({ title: `阀门运行数据可视化 位号：${data.tag}` })
  const source = data.source || 'hart'
  options.value = await getDictDataCharts({ dictTypeValue: 'hart' })
  valveId.value = data.id
  value.value = options.value[0]?.name
})
const change = async () => {
  const dictData = options.value.find((item) => item.name === value.value)
  let result = await getValveHistoryChart({
    valveId: valveId.value,
    keywordId: dictData.id,
    beginTime: range.value?.[0],
    endTime: range.value?.[1]
  })
  // let result = {
  //   keywordName: '行程',
  //   keywordId: 1,
  //   valveId: valveId,
  //   dataLine: [46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29, 30.1],
  //   auxiliaryLine: {
  //     averageValue: [36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29, 30.1]
  //   },
  //   predictionLine: {
  //     linearRegression: [22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29, 30.1]
  //   },
  //   times: [
  //     '2024-01-01',
  //     '2024-01-02',
  //     '2024-01-03',
  //     '2024-01-04',
  //     '2024-01-05',
  //     '2024-01-06',
  //     '2024-01-07',
  //     '2024-01-08',
  //     '2024-01-09',
  //     '2024-01-10'
  //   ]
  // }
  const max = Math.max(...result.dataLine, dictData.upperLimit)
  const min = Math.min(...result.dataLine, dictData.lowerLimit)
  const lowerLimit = Number(dictData.lowerLimit)
  const upperLimit = Number(dictData.upperLimit)
  const unit = dictData.unit || ''
  option.value = {
    legend: { data: ['数据线', '预测线', '辅助线', '标准线'] },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: result.times },
    yAxis: { type: 'value', max, min, name: unit, nameLocation: 'end' },
    series: [
      {
        type: 'line',
        name: '数据线',
        data: result.dataLine
        // markLine: {
        //   lineStyle: { color: 'red' },
        //   data: [
        //     { name: '下限值', yAxis: lowerLimit },
        //     { name: '上限值', yAxis: upperLimit }
        //   ]
        // }
      },
      {
        type: 'line',
        name: '预测线',
        data: result.predictionLine.linearRegression
      },
      {
        type: 'line',
        name: '辅助线',
        data: result.auxiliaryLine.averageValue
      },
      {
        type: 'line',
        name: '标准线',
        markLine: {
          lineStyle: { color: 'red' },
          data: [
            { name: '下限值', yAxis: lowerLimit },
            { name: '上限值', yAxis: upperLimit }
          ]
        }
      }
    ]
  }
}
watch(
  [range, value, options],
  () => {
    change()
  },
  { deep: true }
)
</script>

<template>
  <Modal title="阀门运行数据可视化" class="!w-250" @register="registerModal">
    <n-grid x-gap="12" :cols="4" class="mt-4">
      <n-gi>
        <n-select v-model:value="value" label-field="name" value-field="name" :options="options" />
      </n-gi>
      <n-gi :span="3">
        <n-date-picker v-model:value="range" type="daterange" clearable />
      </n-gi>
    </n-grid>
    <VChart class="chart" :option="option" autoresize />
  </Modal>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>
