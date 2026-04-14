<script setup lang="ts" name="factoryDetail">
import { getFactoryChart, getFactoryChart2, getFactoryDetail } from '@/api/project/factory'
import { BarOption, LineOption, PieOption } from '@/views/dashboard/workTable/data'
import { formatBusinessType } from '@/utils'
import { cloneDeep, map } from 'lodash-es'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { LineChart, BarChart, MapChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent,
  GeoComponent,
  VisualMapComponent
} from 'echarts/components'
import { getDeviceList } from '@/api/project/device'
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  GeoComponent,
  LegendComponent,
  MarkLineComponent,
  MapChart,
  VisualMapComponent
])

const router = useRouter()
const factoryDetail = ref<any>({})
const chartsData = ref<any>({})
const chartsData2 = ref<any>({})
const chartsData3 = ref<any>({})
const deviceOptions = ref<any[]>([])
const formValue = ref({
  deviceId: null,
  valveBrand: '',
  positionerModel: ''
})
const factoryId = computed(() => {
  return Number((router.currentRoute.value.params as { id: string }).id)
})

const valveBrandOption = computed(() => {
  const option = cloneDeep(BarOption)
  option.xAxis[0].data = map(chartsData.value.valveBrandGroup, 'name')
  option.series[0].data = map(chartsData.value.valveBrandGroup, 'value')
  return option
})

const valvePieOption = computed(() => {
  const option = cloneDeep(PieOption)
  option.color = ['#ff0000', '#ffff00', '#00b050']
  option.series[0].data = chartsData3.value.healthIndicator || []
  return option
})

const valvePieOption2 = computed(() => {
  const option = cloneDeep(PieOption)
  option.color = ['#00b050', '#ff0000']
  option.series[0].data = chartsData3.value.alertIndicator || []
  return option
})

const valveBarOption3 = computed(() => {
  const option = cloneDeep(BarOption)
  option.xAxis[0].data = map(chartsData2.value.healthIndicator, 'name')
  option.series[0].data = map(chartsData2.value.healthIndicator, 'value')
  return option
})

const valvePieOption4 = computed(() => {
  const option = cloneDeep(PieOption)
  option.series[0].data = chartsData2.value.alertIndicator || []
  return option
})

const positionerModelOption = computed(() => {
  const option = cloneDeep(BarOption)
  option.xAxis[0].data = map(chartsData.value.positionerModelGroup, 'name')
  option.series[0].data = map(chartsData.value.positionerModelGroup, 'value')
  return option
})

const getAddress = computed(() => {
  const { province, city, county, address } = factoryDetail.value
  if (province === city) {
    return province + county + address
  } else {
    return province + city + county + address
  }
})

const taskOption = computed(() => {
  const option = cloneDeep(LineOption)
  option.xAxis.data = map(chartsData.value.taskGroupByYear, 'name')
  option.series[0].data = map(chartsData.value.taskGroupByYear, 'value')
  return option
})

const maintenanceRecordOption = computed(() => {
  const option = cloneDeep(LineOption)
  option.xAxis.data = map(chartsData.value.maintenanceWorkOrderGroupByYear, 'name')
  option.series[0].data = map(chartsData.value.maintenanceWorkOrderGroupByYear, 'value')
  return option
})

const fieldServiceOption = computed(() => {
  const option = cloneDeep(LineOption)
  option.xAxis.data = map(chartsData.value.serviceWorkOrderGroupByYear, 'name')
  option.series[0].data = map(chartsData.value.serviceWorkOrderGroupByYear, 'value')
  return option
})

const tabsOptions = computed(() => [
  {
    name: '1',
    label: '诊断记录',
    columns: [
      { title: '任务名称', key: 'name' },
      { title: '所属最终用户', key: 'factory.name' },
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
    data: chartsData.value.taskList
  },
  {
    name: '2',
    label: '维修记录',
    columns: [
      { title: '所属最终用户', key: 'factory.name' },
      {
        title: '业务类型',
        key: 'businessType',
        render: (row: any) => formatBusinessType(row.businessType)
      },
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
    data: chartsData.value.maintenanceWorkOrderList
  },
  {
    name: '3',
    label: '现场服务记录',
    columns: [
      { title: '所属最终用户', key: 'factory.name' },
      {
        title: '业务类型',
        key: 'businessType',
        render: (row: any) => formatBusinessType(row.businessType)
      },
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
    data: chartsData.value.serviceWorkOrderList
  }
])

const submit = async () => {
  chartsData2.value = await getFactoryChart2({
    factoryId: factoryId.value,
    ...formValue.value
  })
}

const reset = () => {
  formValue.value.deviceId = null
  formValue.value.valveBrand = ''
  formValue.value.positionerModel = ''
}

watch(
  () => factoryId.value,
  async (factoryId) => {
    if (!factoryId) return
    chartsData.value = await getFactoryChart(factoryId)
    chartsData2.value = await getFactoryChart2({ factoryId: factoryId })
    // chartsData2.value = {
    //   healthIndicator: [
    //     { name: '0-73', value: 50 },
    //     { name: '73-80', value: 20 },
    //     { name: '80-100', value: 30 }
    //   ],
    //   alertIndicator: [
    //     {
    //       name: '正常',
    //       value: 2
    //     },
    //     {
    //       name: '报警',
    //       value: 5
    //     }
    //   ]
    // }
    chartsData3.value = cloneDeep(chartsData2.value)
    deviceOptions.value = (await getDeviceList({ factoryId: factoryId, pageSize: 10000 })).rows.map(
      (item: any) => {
        return {
          label: item.name,
          value: item.id
        }
      }
    )
    factoryDetail.value = await getFactoryDetail(factoryId)
  },
  { immediate: true }
)

// onMounted(async () => {
//   chartsData.value = await getFactoryChart(factoryId.value)
//   chartsData2.value = await getFactoryChart2({ factoryId: factoryId.value })
//   chartsData3.value = cloneDeep(chartsData2.value)
//   deviceOptions.value = (
//     await getDeviceList({ factoryId: factoryId.value, pageSize: 10000 })
//   ).rows.map((item: any) => {
//     return {
//       label: item.name,
//       value: item.id
//     }
//   })
//   factoryDetail.value = await getFactoryDetail(factoryId.value)
// })
</script>

<template>
  <PageWrapper>
    <n-grid x-gap="12" y-gap="12" :cols="4" class="mb-3">
      <n-gi :span="3">
        <n-card title="最终用户详情">
          <ul>
            <li>名称：{{ factoryDetail.name || '' }}</li>
            <li>所属区域：{{ getAddress || '' }}</li>
            <li>所属行业：{{ factoryDetail.industry || '' }}</li>
          </ul>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="阀门" hoverable>
          <n-statistic label="数量" tabular-nums>
            <n-number-animation show-separator :from="0" :to="chartsData.valveTotal" />
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi :span="2">
        <n-card title="阀门健康指示总览" hoverable>
          <VChart class="chart" :option="valvePieOption" autoresize />
        </n-card>
      </n-gi>
      <n-gi :span="2">
        <n-card title="阀门报警总览" hoverable>
          <VChart class="chart" :option="valvePieOption2" autoresize />
        </n-card>
      </n-gi>
      <n-gi :span="2">
        <n-card title="阀门品牌分析" hoverable>
          <VChart class="chart" :option="valveBrandOption" autoresize />
        </n-card>
      </n-gi>
      <n-gi :span="2">
        <n-card title="定位器型号分析" hoverable>
          <VChart class="chart" :option="positionerModelOption" autoresize />
        </n-card>
      </n-gi>
      <n-gi :span="4">
        <n-card title="健康分类统计" hoverable>
          <n-form ref="formRef" inline :label-width="100" label-placement="left" :model="formValue">
            <n-form-item label="装置">
              <n-select class="w-40" v-model:value="formValue.deviceId" :options="deviceOptions" />
            </n-form-item>
            <n-form-item label="阀门品牌">
              <n-input v-model:value="formValue.valveBrand" />
            </n-form-item>
            <n-form-item label="定位器型号">
              <n-input v-model:value="formValue.positionerModel" />
            </n-form-item>
            <n-form-item>
              <n-button attr-type="reset" class="mr-4" @click="reset"> 重置 </n-button>
              <n-button attr-type="submit" @click="submit"> 提交 </n-button>
            </n-form-item>
          </n-form>
          <div class="flex">
            <VChart class="chart mr-4" :option="valveBarOption3" autoresize />
            <VChart class="chart" :option="valvePieOption4" autoresize />
          </div>
        </n-card>
      </n-gi>
    </n-grid>
    <n-grid x-gap="12" y-gap="12" :cols="3">
      <n-gi>
        <n-card title="诊断分析任务历史量趋势" hoverable>
          <VChart class="chart" :option="taskOption" autoresize />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="维修量历史趋势" hoverable>
          <VChart class="chart" :option="maintenanceRecordOption" autoresize />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="现场服务量历史趋势" hoverable>
          <VChart class="chart" :option="fieldServiceOption" autoresize />
        </n-card>
      </n-gi>
      <n-gi :span="3">
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
      </n-gi>
    </n-grid>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.chart {
  height: 300px;
}
</style>
