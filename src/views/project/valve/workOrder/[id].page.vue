<script setup lang="ts">
import { useTable } from '@/components/Table'
import { getValveWorkOrder, getValveDetail } from '@/api/project/valve'

const router = useRouter()
const valveId = computed(() => (router.currentRoute.value.params as { id: string }).id)
const valveDetail = ref()

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

const [registerTable, { reload }] = useTable({
  api: getValveWorkOrder, // 请求接口
  columns: [
    { title: '业务类型', key: 'businessType' },
    { title: '任务类型', key: 'typeName' },
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
              { href: data.attachment, target: '_blank', class: 'text-blue-500' },
              data.attachment?.split('/').pop()
            )
          : ''
      }
    },
    { title: '工单编号/任务编号', key: 'serviceAppId' }
  ], // 展示的列
  useSearchForm: true, // 启用搜索表单
  formConfig: {
    labelWidth: 100,
    schemas: [
      {
        path: 'typeName',
        component: 'NInput',
        label: '任务类型',
        span: 8,
        componentProps: { placeholder: '请输入任务类型' }
      },
      {
        path: 'type',
        component: 'NSelect',
        label: '任务类型',
        span: 8,
        componentProps: {
          placeholder: '请选择任务类型',
          options: [
            { label: '现场服务', value: 0 },
            { label: '返场维修', value: 1 }
          ]
        }
      }
    ]
  }, // 搜索表单配置
  searchInfo: { valveId }, // 额外参数
  bordered: true,
  rowKey: (rowData) => rowData.id,
  showIndexColumn: false
})

watch(
  () => valveId.value,
  async (valveId) => {
    if (!valveId || !Number(valveId)) return
    valveDetail.value = await getValveDetail(Number(valveId))
    reload()
  },
  { immediate: true }
)
</script>

<template>
  <PageWrapper>
    <div class="h-full flex">
      <n-card class="mr-2 w-1/4" hoverable>
        <ul>
          <li>所属最终用户：{{ valveDetail?.factory?.name || '' }}</li>
          <li>所属装置：{{ valveDetail?.device?.name || '' }}</li>
          <li>阀门位号：{{ valveDetail?.tag || '' }}</li>
          <li>阀体序列号：{{ valveDetail?.serialNumber || '' }}</li>
          <li>阀门套装：{{ getDescription(valveDetail) }}</li>
        </ul>
      </n-card>
      <Table class="w-3/4" @register="registerTable"> </Table>
    </div>
  </PageWrapper>
</template>

<style lang="" scoped></style>
