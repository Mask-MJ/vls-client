import type { FormSchema } from '@/components/Form'
import type { BasicColumn } from '@/components/Table'

export const schemas: FormSchema[] = [
  { path: 'name', label: '模板名称', component: 'NInput', span: 8 }
]

export const columns: BasicColumn[] = [
  { title: '模板名称', key: 'name', width: 150 },
  { title: '创建时间', key: 'createdAt', width: 200 },
  { title: '更新时间', key: 'updatedAt', width: 200 }
]
