import type { FormSchema } from '@/components/Form'

export const schemas: FormSchema[] = [
  { path: 'name', label: '字典名称', component: 'NInput', span: 8 }
]

export const columns = [
  { title: '字典名称', key: 'name', width: 150 },
  { title: '关键字', key: 'value', width: 200 },
  { title: '创建时间', key: 'createdAt', width: 200 },
  { title: '更新时间', key: 'updatedAt', width: 200 }
]
