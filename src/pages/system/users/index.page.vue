<script setup lang="ts">
import type { UserInfo } from '@/api/user.type'

import ResetModal from './modal/ResetModal.vue'
import SetModal from './modal/SetModal.vue'
import { deleteUser, getUserDetail, getUsersList } from '@/api/user'
import { useModal } from '@/components/Modal'
import { Action, useTable } from '@/components/Table'

import { columns, schemas } from './data'

const [registerSetModal, { openModal: openSetModel }] = useModal()
const [registerResetModal, { openModal: openResetModel }] = useModal()

const [registerTable, { reload }] = useTable({
  api: getUsersList, // 请求接口
  columns, // 展示的列
  useSearchForm: true, // 启用搜索表单
  formConfig: { labelWidth: 100, schemas }, // 搜索表单配置
  bordered: true,
  rowKey: (rowData) => rowData.id,
  actionColumn: {
    width: 200,
    key: 'ACTION',
    render: (row: UserInfo) =>
      h(Action, {
        actions: [
          {
            type: 'edit',
            onClick: async () => {
              const result = await getUserDetail(row.id)
              return openSetModel(true, result)
            }
          },
          {
            icon: 'i-ant-design:key-outlined',
            tooltipProps: { content: '重置密码' },
            buttonProps: {
              type: 'success',
              onClick: () => openResetModel(true, { id: row.id })
            }
          },
          {
            type: 'del',
            onClick: async () => {
              await deleteUser(row.id)
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
    <ResetModal @register="registerResetModal" />
  </div>
</template>

<style scoped></style>
