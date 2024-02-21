<script setup lang="ts">
import type { RoleInfo } from '@/api/role.type'

import SetModal from './modal/SetModal.vue'
import { deleteRole, getRoleDetail, getRolesList } from '@/api/role'
import { useModal } from '@/components/Modal'
import { Action, useTable } from '@/components/Table'

import { columns, schemas } from './data'

const [registerSetModal, { openModal: openSetModel }] = useModal()
const [registerTable, { reload }] = useTable({
  api: getRolesList, // 请求接口
  columns, // 展示的列
  useSearchForm: true, // 启用搜索表单
  formConfig: { labelWidth: 100, schemas }, // 搜索表单配置
  bordered: true,
  rowKey: (rowData) => rowData.id,
  actionColumn: {
    width: 100,
    key: 'ACTION',
    render: (row: RoleInfo) =>
      row.roleKey === 'admin'
        ? null
        : h(Action, {
            actions: [
              {
                type: 'edit',
                onClick: async () => {
                  const result = await getRoleDetail(row.id)
                  return openSetModel(true, result)
                }
              },
              {
                type: 'del',
                onClick: async () => {
                  await deleteRole(row.id)
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

<style scoped></style>
