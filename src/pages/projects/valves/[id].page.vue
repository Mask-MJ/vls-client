<script setup lang="ts">
import type { FactorysInfo } from '@/api/factory.type'

import SetModal from './modal/SetModal.vue'
import { deleteValve, getValveDetail, getValveList } from '@/api/valve'
import { useModal } from '@/components/Modal'
import { Action, useTable } from '@/components/Table'

import { columns, schemas } from './data'

// const router = useRouter()
const route = useRoute() as any
const factoryId = computed(() => Number(route.params.id))

const [registerSetModal, { openModal }] = useModal()
const [registerTable, { reload }] = useTable({
  api: getValveList, // 请求接口
  columns, // 展示的列
  useSearchForm: true, // 启用搜索表单
  searchInfo: { factoryId: factoryId.value },
  formConfig: { labelWidth: 100, schemas }, // 搜索表单配置
  bordered: true,
  rowKey: (rowData) => rowData.id,
  actionColumn: {
    width: 150,
    key: 'ACTION',
    render: (row: FactorysInfo) =>
      h(Action, {
        actions: [
          {
            type: 'edit',
            onClick: async () => {
              const result = await getValveDetail(row.id)
              return openModal(true, result)
            }
          },
          {
            icon: 'i-ant-design:key-outlined',
            tooltipProps: { content: '查看阀门运行数据' },
            buttonProps: {
              type: 'success'
              // onClick: () => router.push(`/projects/valves/${row.id}`)
            }
          },
          {
            type: 'del',
            onClick: async () => {
              await deleteValve(row.id)
              await reload()
            }
          }
        ]
      })
  }
})

const handleAdd = () => {
  openModal(true, { factoryId: factoryId.value })
}
</script>

<template>
  <div class="flex h-full">
    <Table @register="registerTable">
      <template #toolbar>
        <n-button class="mr-2" type="primary" @click="handleAdd"> 新增 </n-button>
      </template>
    </Table>
    <SetModal @register="registerSetModal" @success="reload()" />
  </div>
</template>

<style scoped></style>
