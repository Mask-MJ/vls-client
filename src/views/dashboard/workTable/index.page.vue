<script setup lang="ts">
import { use, registerMap } from 'echarts/core'
import VChart, { THEME_KEY } from 'vue-echarts'
import { formatBusinessType } from '@/utils'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, MapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent,
  GeoComponent,
  VisualMapComponent
} from 'echarts/components'
import { BarOption, LineOption } from './data'
import { cloneDeep, flatMap, sortBy, map } from 'lodash-es'
import china from '@/assets/json/china.json'
import { getCharts, type Charts } from '@/api/system/user'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  GeoComponent,
  LegendComponent,
  MarkLineComponent,
  MapChart,
  VisualMapComponent
])
const themeStore = useThemeStore()
if (themeStore.darkMode) {
  provide(THEME_KEY, 'dark')
}

const chartsData = ref<Charts>({
  factoryTotal: 0, // 最终用户数量
  factoryProvinceGroup: [], // 最终用户地区分组
  factoryIndustryGroup: [], // 最终用户行业分组
  valveBrandGroup: [], // 阀门品牌分组
  valveModelGroup: [], // 阀门型号分组
  positionerModelGroup: [], // 定位器型号分组
  taskGroupByYear: [], // 定位器型号分组
  maintenanceWorkOrderGroupByYear: [], // 定位器型号分组
  serviceWorkOrderGroupByYear: [], // 定位器型号分组
  maintenanceWorkOrderList: [], // 维修记录
  serviceWorkOrderList: [], // 现场服务记录
  taskList: [], // 诊断记录
  valveTotal: 0, // 阀门数量
  taskTotal: 0, // 分析任务数量
  taskCount: [], // 本周任务数量
  operationLog: [] // 工作记录
})

const weekTaskOption = computed(() => {
  const option = cloneDeep(BarOption)

  option.xAxis[0].data = map(chartsData.value.taskCount, 'name')
  option.series[0].data = map(chartsData.value.taskCount, 'value')
  return option
})

const factoryMapOption = computed(() => {
  const option = {
    title: { text: '最终用户区域分布' },
    tooltip: {
      trigger: 'item', //设置该属性之后，会与series中data数据对应。注意data中对象的键名为name。如果单纯的展示数据可用此属性，不与formatter同用。
      formatter: (params: any) => {
        return `${params.name}<br/>${params.value || 0} 个`
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['lightskyblue', 'yellow', 'orangered']
      }
    },
    series: [
      {
        type: 'map',
        name: '',
        map: 'china', //这里的名称需要和 echarts.registerMap('china',{})中的名称一致
        roam: true, //缩放
        layoutCenter: ['50%', '80%'], //地图位置
        layoutSize: '150%',
        zoom: true, //默认地图在容器中显示zoom:1,可根据需求放大缩小地图
        label: { show: true, color: '#fff' },
        // 数据
        data: chartsData.value.factoryProvinceGroup
      }
    ]
  }
  return option
})

const factoryBarOption = computed(() => {
  const option: any = cloneDeep(BarOption)
  const data = sortBy(chartsData.value.factoryProvinceGroup, (item) => item.value)
  option.xAxis = { type: 'value', minInterval: 1, boundaryGap: [0, 0.01] }
  option.yAxis = {
    type: 'category',
    data: flatMap(data, (item) => item.name)
  }
  option.series[0].label = { show: true, position: 'inside' }
  option.series[0].data = flatMap(data, (item) => item.value)
  return option
})

const industryOption = computed(() => {
  const option = cloneDeep(BarOption)
  option.xAxis[0].data = map(chartsData.value.factoryIndustryGroup, 'name')
  option.series[0].data = map(chartsData.value.factoryIndustryGroup, 'value')
  return option
})

const valveBrandOption = computed(() => {
  const option = cloneDeep(BarOption)
  option.xAxis[0].data = map(chartsData.value.valveBrandGroup, 'name')
  option.series[0].data = map(chartsData.value.valveBrandGroup, 'value')
  return option
})

const positionerModelOption = computed(() => {
  const option = cloneDeep(BarOption)
  option.xAxis[0].data = map(chartsData.value.positionerModelGroup, 'name')
  option.series[0].data = map(chartsData.value.positionerModelGroup, 'value')
  return option
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

onMounted(async () => {
  registerMap('china', china as any)
  chartsData.value = await getCharts()
})
</script>

<template>
  <n-grid x-gap="12" y-gap="12" :cols="3">
    <n-gi>
      <n-card title="最终用户" hoverable>
        <n-statistic label="数量" tabular-nums>
          <n-number-animation show-separator :from="0" :to="chartsData.factoryTotal" />
        </n-statistic>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="阀门" hoverable>
        <n-statistic label="数量" tabular-nums>
          <n-number-animation show-separator :from="0" :to="chartsData.valveTotal" />
        </n-statistic>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="分析任务" hoverable>
        <n-statistic label="数量" tabular-nums>
          <n-number-animation show-separator :from="0" :to="chartsData.taskTotal" />
        </n-statistic>
      </n-card>
    </n-gi>
    <n-gi :span="2">
      <n-card title="本周任务数量" hoverable>
        <VChart class="chart" :option="weekTaskOption" autoresize />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="工作记录" hoverable>
        <ul class="list">
          <n-scrollbar style="max-height: 280px">
            <li
              class="mb-2 border-b-1 border-slate-300 rounded px-2 py-1 text-slate-500"
              v-for="item in chartsData.operationLog"
              :key="item.id"
            >
              <div class="mb-2 text-base text-slate-800 font-bold">{{ item.module }}</div>
              <div class="">
                <div class="">{{ item.title }}</div>
                <div class="">{{ item.createdAt }}</div>
              </div>
            </li>
          </n-scrollbar>
        </ul>
      </n-card>
    </n-gi>
    <n-gi :span="2">
      <n-card hoverable>
        <VChart class="map" :option="factoryMapOption" autoresize />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card hoverable>
        <VChart class="map" :option="factoryBarOption" autoresize />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="最终用户行业分析" hoverable>
        <VChart class="chart" :option="industryOption" autoresize />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="阀门品牌分析" hoverable>
        <VChart class="chart" :option="valveBrandOption" autoresize />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="定位器型号分析" hoverable>
        <VChart class="chart" :option="positionerModelOption" autoresize />
      </n-card>
    </n-gi>
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
</template>

<style scoped>
.chart,
.list {
  height: 300px;
}
.map {
  height: 500px;
}
</style>
