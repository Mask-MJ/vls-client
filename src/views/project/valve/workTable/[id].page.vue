<script setup lang="ts">
import VChart from 'vue-echarts'
import Page from '../[id].page.vue'
import { getDictDataCharts, type DictDataInfo } from '@/api/system/dict'
import {
  getValveDetail,
  getValveHealthScoreTrendPlot,
  getValveHistoryChart,
  getValveHistoryScore
} from '@/api/project/valve'
import { use } from 'echarts/core'
import dayjs from 'dayjs'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
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

const router = useRouter()
const valveId = computed(() => {
  return Number((router.currentRoute.value.params as { id: string }).id)
})
const dictDatas = ref<DictDataInfo[]>([])
const valveDetail = ref()
const healthScore = ref()
const result = ref<any[]>([])
const historyScores = ref<any[]>([])
const getOption = (data: DictDataInfo) => {
  return result.value.filter((item) => item._id === data.id)[0]
}
const getValveHealthScoreTrendPlotChart = () => {
  return {
    title: { text: '阀门健康评分趋势图' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: healthScore.value?.dataLine || [] },
    yAxis: { type: 'value', max: 100, min: 0 },
    series: [
      {
        name: '健康评分',
        type: 'line',
        data: healthScore.value?.scoreLine || []
      }
    ]
  }
}

watch(
  () => valveId.value,
  async (valveId) => {
    if (!valveId || !Number(valveId)) return
    valveDetail.value = await getValveDetail(valveId)
    dictDatas.value = await getDictDataCharts({ dictTypeValue: 'hart' })
    healthScore.value = await getValveHealthScoreTrendPlot(valveId)
    try {
      const scoreResult = await getValveHistoryScore({ valveId })
      historyScores.value = scoreResult?.scores || []
    } catch {
      historyScores.value = []
    }
    const beginTime = dayjs().subtract(1, 'year').valueOf()
    const endTime = dayjs().valueOf()
    result.value = await Promise.all(
      dictDatas.value.map(async (item) => {
        try {
          const result = await getValveHistoryChart({
            valveId: valveId,
            keywordId: item.id,
            beginTime,
            endTime
          })
          const max = Math.max(...result.dataLine, item.upperLimit)
          const min = Math.min(...result.dataLine, item.lowerLimit)
          const lowerLimit = Number(item.lowerLimit)
          const upperLimit = Number(item.upperLimit)
          return {
            _id: item.id,
            legend: { data: ['数据线', '预测线', '辅助线', '标准线'] },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: result.times },
            yAxis: { type: 'value', max, min },
            series: [
              { type: 'line', name: '数据线', data: result.dataLine },
              { type: 'line', name: '预测线', data: result.predictionLine.linearRegression },
              { type: 'line', name: '辅助线', data: result.auxiliaryLine.averageValue },
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
        } catch (error) {
          window.$message.error(item.name + '获取数据失败')
          return {}
        }
      })
    )
  },
  { immediate: true }
)

const tabsOptions = computed(() => [
  {
    name: '1',
    label: '诊断记录',
    columns: [
      { title: '任务名称', key: 'name' },
      {
        title: '状态',
        key: 'status',
        render: (row: any) => {
          const statusMap = new Map([
            [0, '未开始'],
            [1, '进行中'],
            [2, '已完成'],
            [3, '失败']
          ])
          return statusMap.get(row.status)
        }
      },
      { title: '创建时间', key: 'createdAt' },
      { title: '更新时间', key: 'updatedAt' },
      { title: '创建人员', key: 'createBy' },
      { title: '备注', key: 'remark' }
    ],
    data: valveDetail.value?.analysisTask || []
  },
  {
    name: '2',
    label: '维修记录',
    columns: [
      { title: '所属最终用户', key: 'factory.name' },
      { title: '业务类型', key: 'businessType' },
      { title: '任务类型', key: 'typeName' },
      {
        title: '位号',
        key: 'valve',
        render: (data: any) => {
          return data.valve?.map((item: any) => item.tag).join(', ')
        }
      },
      {
        title: '序列号',
        key: 'valve',
        render: (data: any) => {
          return data.valve?.map((item: any) => item.serialNumber).join(', ')
        }
      },
      { title: '故障类别', key: 'faultCategory' },
      { title: '故障描述', key: 'faultDetail' },
      { title: '处理措施', key: 'remedialActions' },
      { title: '完成时间', key: 'createdAt' },
      {
        title: '服务报告',
        key: 'attachment',
        render: (data: any) => {
          return data.attachment
            ? h(
                'a',
                {
                  href: data.attachment,
                  target: '_blank',
                  class: 'text-blue-500'
                },
                data.attachment?.split('/').pop()
              )
            : ''
        }
      }
    ],
    data: valveDetail.value?.workOrder?.filter((item: any) => item.type === 1) || []
  },
  {
    name: '3',
    label: '现场服务记录',
    columns: [
      { title: '所属最终用户', key: 'factory.name' },
      { title: '业务类型', key: 'businessType' },
      { title: '任务类型', key: 'typeName' },
      {
        title: '位号',
        key: 'valve',
        render: (data: any) => {
          return data.valve?.map((item: any) => item.tag).join(', ')
        }
      },
      {
        title: '序列号',
        key: 'valve',
        render: (data: any) => {
          return data.valve?.map((item: any) => item.serialNumber).join(', ')
        }
      },
      { title: '故障类别', key: 'faultCategory' },
      { title: '故障描述', key: 'faultDetail' },
      { title: '处理措施', key: 'remedialActions' },
      { title: '完成时间', key: 'createdAt' },
      {
        title: '服务报告',
        key: 'attachment',
        render: (data: any) => {
          return data.attachment
            ? h(
                'a',
                {
                  href: data.attachment,
                  target: '_blank',
                  class: 'text-blue-500'
                },
                data.attachment?.split('/').pop()
              )
            : ''
        }
      }
    ],
    data: valveDetail.value?.workOrder?.filter((item: any) => item.type === 0) || []
  },
  {
    name: '4',
    label: '历史评分',
    columns: [
      { title: '检查时间', key: 'checkTime', width: 300 },
      { title: '评分时间', key: 'scoreTime', width: 150 },
      { title: '分数', key: 'infor.totalScore', width: 150 }
    ],
    data: historyScores.value
  }
])

const getDescription = (data: any) => {
  if (!data) return ''
  // 返回一个字符串，包含所有描述信息
  return [
    data.valveDescription,
    data.actuatorDescription,
    data.positionerDescription,
    data.lsDescription,
    data.pilotDescription,
    data.qeDescription,
    data.regulatorDescription,
    data.signalComparatorDescription,
    data.sovDescription,
    data.tripValveDescription,
    data.vbDescription
  ]
    .map((item: string) => item || '')
    .filter(Boolean)
    .join('；')
}

// onMounted(async () => {
//   if (!valveId.value) return
//   valveDetail.value = await getValveDetail(valveId.value)
//   dictDatas.value = await getDictDataCharts({ dictTypeValue: valveDetail.value.source || 'hart' })
//   const beginTime = dayjs().subtract(1, 'year').valueOf()
//   const endTime = dayjs().valueOf()
//   result.value = await Promise.all(
//     dictDatas.value.map(async (item) => {
//       try {
//         const result = await getValveHistoryChart({
//           valveId: valveId.value,
//           keywordId: item.id,
//           beginTime,
//           endTime
//         })
//         // const result = {
//         //   keywordName: '行程',
//         //   keywordId: 1,
//         //   valveId: valveId,
//         //   dataLine: [46.83, 17.66, 41.32, 98.17, 24.37, 13.45, 8.59, 18.61, 11.29, 30.1],
//         //   auxiliaryLine: {
//         //     averageValue: [36.83, 27.66, 31.32, 78.17, 34.37, 13.45, 8.59, 18.61, 11.29, 30.1]
//         //   },
//         //   predictionLine: {
//         //     linearRegression: [22.83, 44.66, 55.32, 66.17, 77.37, 13.45, 8.59, 18.61, 11.29, 30.1]
//         //   },
//         //   times: [
//         //     '2024-01-01',
//         //     '2024-01-02',
//         //     '2024-01-03',
//         //     '2024-01-04',
//         //     '2024-01-05',
//         //     '2024-01-06',
//         //     '2024-01-07',
//         //     '2024-01-08',
//         //     '2024-01-09',
//         //     '2024-01-10'
//         //   ]
//         // }
//         const max = Math.max(...result.dataLine, item.upperLimit)
//         const min = Math.min(...result.dataLine, item.lowerLimit)
//         const lowerLimit = Number(item.lowerLimit)
//         const upperLimit = Number(item.upperLimit)
//         return {
//           _id: item.id,
//           legend: { data: ['数据线', '预测线', '辅助线', '标准线'] },
//           tooltip: { trigger: 'axis' },
//           xAxis: { type: 'category', data: result.times },
//           yAxis: { type: 'value', max, min },
//           series: [
//             { type: 'line', name: '数据线', data: result.dataLine },
//             { type: 'line', name: '预测线', data: result.predictionLine.linearRegression },
//             { type: 'line', name: '辅助线', data: result.auxiliaryLine.averageValue },
//             {
//               type: 'line',
//               name: '标准线',
//               markLine: {
//                 lineStyle: { color: 'red' },
//                 data: [
//                   { name: '下限值', yAxis: lowerLimit },
//                   { name: '上限值', yAxis: upperLimit }
//                 ]
//               }
//             }
//           ]
//         }
//       } catch (error) {
//         window.$message.error(item.name + '获取数据失败')
//         return {}
//       }
//     })
//   )
// })
</script>

<template>
  <div class="h-full">
    <div v-if="valveId">
      <n-card title="阀门详情">
        <ul>
          <li>所属最终用户：{{ valveDetail?.factory?.name || '' }}</li>
          <li>所属装置：{{ valveDetail?.device?.name || '' }}</li>
          <li>阀门位号：{{ valveDetail?.tag || '' }}</li>
          <li>阀体序列号：{{ valveDetail?.serialNumber || '' }}</li>
          <li>阀门套装：{{ getDescription(valveDetail) }}</li>
          <li>最后评分时间：{{ historyScores?.[0]?.scoreTime || '' }}</li>
        </ul>
      </n-card>
      <n-grid x-gap="12" :cols="3" class="my-4">
        <n-gi v-for="item in dictDatas" :key="item.id">
          <n-card :title="item.name">
            <VChart class="chart" :option="getOption(item)" autoresize />
          </n-card>
        </n-gi>
        <n-gi>
          <n-card title="获取阀门健康评分趋势图">
            <VChart class="chart" :option="getValveHealthScoreTrendPlotChart()" autoresize />
          </n-card>
        </n-gi>
      </n-grid>
      <n-card hoverable>
        <n-tabs type="line" animated>
          <n-tab-pane
            :name="item.name"
            :tab="item.label"
            v-for="item in tabsOptions"
            :key="item.name"
          >
            <n-data-table
              :columns="item.columns"
              :data="item.data"
              bordered
              :max-height="250"
              :min-height="250"
            />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
    <Page v-else />
  </div>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>
