import type { UserInfo } from '@/api/user.type'
import type { FormSchema } from '@/components/Form'
import type { BasicColumn } from '@/components/Table'

import { changeStatus } from '@/api/user'
import { NPopconfirm, NSwitch } from 'naive-ui'

export const schemas: FormSchema[] = [
  { path: 'account', label: '用户名称', component: 'NInput', span: 8 },
  {
    path: 'status',
    label: '状态',
    component: 'NSelect',
    componentProps: {
      options: [
        { label: '正常', value: '0', key: '0' },
        { label: '停用', value: '1', key: '1' }
      ]
    },
    span: 8
  }
]

export const columns: BasicColumn<UserInfo & { pendingStatus: boolean }>[] = [
  { title: '用户名称', key: 'account', width: 100 },
  { title: '用户昵称', key: 'nickname', width: 100 },
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
            const status = rowData.status ? 1 : 0
            changeStatus({ id: rowData.id, status })
              .then(() => {
                rowData.status = status
                window.$message.success(`已成功修改用户状态`)
              })
              .catch(() => {
                window.$message.error('修改用户状态失败')
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
          default: () => (rowData.status ? '是否停用用户' : '是否启用用户'),
          trigger: () =>
            h(
              NSwitch,
              {
                checkedValue: '0',
                uncheckedValue: '1',
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
  { title: '创建时间', key: 'createdAt', width: 200 }
]
