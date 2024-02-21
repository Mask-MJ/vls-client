import type { UserInfo } from '@/api/user.type'
import type { FormSchema } from '@/components/Form'
import type { BasicColumn } from '@/components/Table'

import { updateUser } from '@/api/user'
import { NPopconfirm, NSwitch } from 'naive-ui'

export const schemas: FormSchema[] = [
  { path: 'name', label: '工厂名称', component: 'NInput', span: 8 },
  { path: 'status', label: '状态', component: 'NInput', span: 8 }
]

export const columns: BasicColumn<UserInfo & { pendingStatus: boolean }>[] = [
  { title: '工厂名称', key: 'name', width: 150 },
  { title: '工厂地址', key: 'address', width: 150 },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (rowData) =>
      h(
        NPopconfirm,
        {
          onPositiveClick() {
            if (!Reflect.has(rowData, 'pendingStatus')) {
              rowData.pendingStatus = false
            }
            const status = rowData.status ? 0 : 1
            updateUser({ id: rowData.id, status })
              .then(() => {
                rowData.status = status
                window.$message.success(`已成功修改工厂状态`)
              })
              .catch(() => {
                window.$message.error('修改工厂状态失败')
              })
              .finally(() => {
                rowData.pendingStatus = false
              })
          },
          onNegativeClick() {
            rowData.pendingStatus = false
          }
        },
        {
          default: () => (rowData.status ? '是否停用工厂' : '是否启用工厂'),
          trigger: () =>
            h(
              NSwitch,
              {
                checkedValue: 1,
                uncheckedValue: 0,
                loading: rowData.pendingStatus,
                value: rowData.status,
                onUpdateValue() {
                  rowData.pendingStatus = true
                }
              },
              { checked: () => '启用', unchecked: () => '停用' }
            )
        }
      )
  },
  // { title: '创建者', key: 'creater.nickname', width: 100 },
  { title: '创建时间', key: 'createdAt', width: 200 },
  { title: '更新时间', key: 'updatedAt', width: 200 }
]
