import type { UserInfo } from '@/api/user.type'
import type { FormSchema } from '@/components/Form'
import type { BasicColumn } from '@/components/Table'

export const schemas: FormSchema[] = [
  { path: 'name', label: '角色名称', component: 'NInput', span: 8 },
  { path: 'roleKey', label: '权限字符', component: 'NInput', span: 8 }
]

export const columns: BasicColumn<UserInfo & { pendingStatus: boolean }>[] = [
  { title: '角色名称', key: 'name', width: 150 },
  { title: '权限字符', key: 'roleKey', width: 150 },
  { title: '排序', key: 'sort', width: 80 },
  { title: '创建时间', key: 'createdAt', width: 200 },
  { title: '更新时间', key: 'updatedAt', width: 200 }
]
