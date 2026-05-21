import type { UserInfo } from '@/api/system/user'
import type { FormSchema } from '@/components/Form'
import type { BasicColumn } from '@/components/Table'

import { NSwitch } from 'naive-ui'
import { h } from 'vue'

import { getMenuListWithPermission } from '@/api/system/menu'
import { getFactoryList } from '@/api/project/factory'

export const searchSchemas: FormSchema[] = [
  { path: 'name', label: '角色名称', component: 'NInput', span: 8 },
  { path: 'value', label: '权限字符', component: 'NInput', span: 8 }
]

export const columns: BasicColumn<UserInfo & { pendingStatus: boolean }>[] = [
  { title: '角色名称', key: 'name', width: 150 },
  { title: '权限字符', key: 'value', width: 150 },
  { title: '排序', key: 'sort', width: 80 },
  { title: '创建时间', key: 'createdAt', width: 200 },
  { title: '更新时间', key: 'updatedAt', width: 200 }
]

export const setSchemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  { path: 'name', label: '角色名称', required: true, component: 'NInput' },
  { path: 'sort', label: '排序', required: true, component: 'NInputNumber' },
  { path: 'value', label: '权限字符', required: true, component: 'NInput' },
  {
    path: 'menuIds',
    label: '菜单权限',
    component: 'ApiTreeSelect',
    componentProps: {
      immediate: true,
      maxTagCount: 5,
      api: getMenuListWithPermission,
      multiple: true,
      labelField: 'name',
      keyField: 'id',
      checkable: true
    }
  },
  {
    path: 'grantAllFactories',
    label: '全部工厂授权',
    component: 'NSwitch',
    render: ({ model, path }) =>
      h('div', { class: 'flex items-center gap-3' }, [
        h(NSwitch, {
          value: model[path] === true,
          'onUpdate:value': (val: boolean) => {
            model[path] = val
          }
        }),
        h(
          'span',
          { class: 'text-xs text-gray-400' },
          '勾选后该角色自动拥有所有当前及后续新增工厂的查看权限'
        )
      ])
  },
  {
    path: 'factoryIds',
    label: '数据权限',
    component: 'ApiTreeSelect',
    componentProps: ({ formModel }) => ({
      immediate: true,
      api: getFactoryList,
      multiple: true,
      labelField: 'name',
      keyField: 'id',
      checkable: true,
      cascade: true,
      resultField: 'rows',
      disabled: formModel.grantAllFactories === true
    })
  },
  {
    path: 'remark',
    label: '备注',
    component: 'NInput',
    componentProps: { type: 'textarea', placeholder: '请输入内容' }
  }
]
