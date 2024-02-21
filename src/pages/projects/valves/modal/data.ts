import type { FormSchema } from '@/components/Form'

export const schemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  { path: 'factoryId', label: '所属工厂', show: false, component: 'NInput' },
  { path: 'name', label: '阀门名称', required: true, component: 'NInput' }

  // { path: 'sort', label: '排序', required: true, component: 'NInputNumber', span: 12 },

  // {
  //   path: 'remark',
  //   label: '备注',
  //   component: 'NInput',
  //   componentProps: { type: 'textarea', placeholder: '请输入内容' }
  // }
]
