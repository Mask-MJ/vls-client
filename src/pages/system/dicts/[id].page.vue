<script setup lang="ts">
import type { DictInfo } from '@/api/dict.type'

import SetModal from './modal/SetModal.vue'
import { deleteDict, getDictDetail, getDictList } from '@/api/dict'
import { useModal } from '@/components/Modal'
import { Action, useTable } from '@/components/Table'

import { columns, schemas } from './data'

const route = useRoute() as any 
const templateId = computed(() => Number(route.params.id))

const [registerSetModal, { openModal }] = useModal()

const [registerTable, { reload }] = useTable({
  api: getDictList, // 请求接口
  columns, // 展示的列
  useSearchForm: true, // 启用搜索表单
  searchInfo: { templateId: templateId.value }, // 额外的请求参数
  formConfig: { labelWidth: 100, schemas }, // 搜索表单配置
  bordered: true, // 是否显示边框
  rowKey: (rowData) => rowData.id, // 表格行 key 的取值
  actionColumn: {
    width: 150,
    key: 'ACTION',
    render: (row: DictInfo) =>
      h(Action, {
        actions: [
          {
            type: 'edit',
            onClick: async () => {
              const result = await getDictDetail(row.id)
              return openModal(true, result)
            }
          },
          {
            type: 'del',
            onClick: async () => {
              await deleteDict(row.id)
              await reload()
            }
          }
        ]
      })
  }
})
const handleAdd = () => {
  openModal(true, { templateId: templateId.value })
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

<style lang="" scoped></style>
