import type { UserInfo } from '@/api/user.type'
import type { FormSchema } from '@/components/Form'
import type { BasicColumn } from '@/components/Table'

export const schemas: FormSchema[] = [
  // {
  //   path: 'factoryId',
  //   label: '工厂id',
  //   component: 'NInput',
  //   span: 8,
  //   componentProps: { disabled: true }
  // },
  { path: 'name', label: '阀门名称', component: 'NInput', span: 8 }
]

export const columns: BasicColumn<UserInfo & { pendingStatus: boolean }>[] = [
  { title: '阀门名称', key: 'factoryId', width: 150 },
  { title: '创建时间', key: 'createdAt', width: 200 },
  { title: '更新时间', key: 'updatedAt', width: 200 }
]
