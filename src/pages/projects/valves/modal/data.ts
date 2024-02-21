import type { FormSchema } from '@/components/Form'

export const schemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  { path: 'name', label: '工厂名称', required: true, component: 'NInput' },
  {
    path: 'address',
    label: '工厂地址',
    component: 'NInput'
  },
  {
    path: 'location',
    label: '工厂坐标',
    component: 'NInput',
    // show: false,
    slot: 'customSlot'
  },
  // { path: 'sort', label: '排序', required: true, component: 'NInputNumber', span: 12 },
  {
    path: 'users',
    label: '查看权限',
    component: 'NSelect',
    slot: 'transferSlot'
  }
  // {
  //   path: 'remark',
  //   label: '备注',
  //   component: 'NInput',
  //   componentProps: { type: 'textarea', placeholder: '请输入内容' }
  // }
]
