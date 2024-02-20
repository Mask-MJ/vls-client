import type { FormSchema } from '@/components/Form'

export const schemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  { path: 'name', label: '工厂名称', required: true, component: 'NInput' },
  {
    path: 'address',
    label: '工厂地址',
    component: 'NInput',
    slot: 'customSlot'
  },
  {
    path: 'position',
    label: '工厂坐标',
    component: 'NInput',
    // show: false,
    componentProps: {
      disabled: true
    }
  },
  { path: 'sort', label: '排序', required: true, component: 'NInputNumber' },

  {
    path: 'remark',
    label: '备注',
    component: 'NInput',
    componentProps: { type: 'textarea', placeholder: '请输入内容' }
  }
]
