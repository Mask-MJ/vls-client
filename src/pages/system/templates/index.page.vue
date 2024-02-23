<!-- 模板管理 -->
<script setup lang="ts">
import type { TemplatesInfo } from '@/api/template.type'

import SetModal from './modal/SetModal.vue'
import { deleteTemplate, getTemplateDetail, getTemplateList } from '@/api/template'
import { useModal } from '@/components/Modal'
import { Action, useTable } from '@/components/Table'

import { columns, schemas } from './data'

const router = useRouter()
const [registerSetModal, { openModal: openSetModel }] = useModal()

const [registerTable, { reload }] = useTable({
  api: getTemplateList, // 请求接口
  columns, // 展示的列
  useSearchForm: true, // 启用搜索表单
  formConfig: { labelWidth: 100, schemas }, // 搜索表单配置
  bordered: true, // 是否显示边框
  rowKey: (rowData) => rowData.id, // 表格行 key 的取值
  // 表格操作列
  actionColumn: {
    width: 150,
    key: 'ACTION',
    render: (row: TemplatesInfo) =>
      h(Action, {
        actions: [
          {
            type: 'edit',
            onClick: async () => {
              const result = await getTemplateDetail(row.id)
              return openSetModel(true, result)
            }
          },
          {
            icon: 'i-line-md:list-3',
            tooltipProps: { content: '模板管理' },
            buttonProps: {
              type: 'success',
              onClick: () => router.push(`/system/keywords/${row.id}`)
            }
          },
          {
            type: 'del',
            onClick: async () => {
              await deleteTemplate(row.id)
              await reload()
            }
          }
        ]
      })
  }
})

const handleAdd = () => {
  openSetModel(true)
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
