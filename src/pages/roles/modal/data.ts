import type { FormSchema } from '@/components/Form'

import { getMenusList } from '@/api/role'

export const schemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  { path: 'name', label: '角色名称', required: true, component: 'NInput' },
  { path: 'sort', label: '排序', required: true, component: 'NInputNumber' },
  { path: 'roleKey', label: '权限字符', required: true, component: 'NInput' },
  {
    path: 'menus',
    label: '菜单权限',
    component: 'ApiSelect',
    componentProps: {
      immediate: true,
      api: getMenusList,
      multiple: true,
      labelField: 'name',
      valueField: 'id'
    }
  },
  {
    path: 'remark',
    label: '备注',
    component: 'NInput',
    componentProps: { type: 'textarea', placeholder: '请输入内容' }
  }
]
