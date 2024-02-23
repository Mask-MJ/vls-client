import type { FormSchema } from '@/components/Form'

export const schemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  { path: 'name', label: '关键字', required: true, component: 'NInput' }
  // {
  //   path: 'remark',
  //   label: '备注',
  //   component: 'NInput',
  //   componentProps: { type: 'textarea', placeholder: '请输入内容' }
  // }
]
