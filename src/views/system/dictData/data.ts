import { getDictDataTreeList, type DictDataInfo } from '@/api/system/dict'
import type { FormSchema } from '@/components/Form'
import type { BasicColumn } from '@/components/Table'

export const searchSchemas: FormSchema[] = [
  { path: 'name', label: '关键字名称', component: 'NInput', span: 8 }
]

export const columns: BasicColumn<DictDataInfo>[] = [
  { title: '关键字名称', key: 'name', width: 150 },
  { title: '关键字', key: 'value', width: 200 },
  { title: '排序', key: 'sort', width: 100 },
  {
    title: '类别',
    key: 'type',
    width: 100,
    render: (rowData) => ['配置', '运行数据', '诊断'][Number(rowData.type)]
  },
  { title: '所属PDF树', key: 'tree.name', width: 200 },
  { title: '创建时间', key: 'createdAt', width: 200 },
  { title: '更新时间', key: 'updatedAt', width: 200 }
]

export const setSchemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  { path: 'dictTypeId', component: 'NInputNumber', show: false },
  { path: 'name', label: '关键字名称', required: true, component: 'NInput', span: 12 },
  { path: 'value', label: '关键字', required: true, component: 'NInput', span: 12 },
  { path: 'cnTitle', label: '中文标题', component: 'NInput', span: 12 },
  { path: 'enTitle', label: '英文标题', component: 'NInput', span: 12 },
  {
    path: 'treeId',
    label: '所属PDF树',
    component: 'ApiTreeSelect',
    required: true,
    span: 12,
    componentProps: {
      immediate: true,
      api: getDictDataTreeList,
      labelField: 'name',
      keyField: 'id',
      cascade: true
    }
  },
  {
    path: 'type',
    label: '类别',
    component: 'NSelect',
    defaultValue: '0',
    span: 12,
    componentProps: {
      options: [
        { label: '配置', value: '0' },
        { label: '运行数据', value: '1' },
        { label: '诊断', value: '2' }
      ]
    }
  },
  { path: 'sort', label: '排序', component: 'NInputNumber', span: 12 },
  {
    path: 'isChart',
    label: '是否图表',
    component: 'NRadioGroup',
    span: 12,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  },
  {
    path: 'upperLimit',
    label: '上限值',
    ifShow: ({ values }) => values.isChart,
    component: 'NInput',
    span: 12
  },
  {
    path: 'lowerLimit',
    label: '下限值',
    ifShow: ({ values }) => values.isChart,
    component: 'NInput',
    span: 12
  },
  {
    path: 'unit',
    label: '单位',
    ifShow: ({ values }) => values.isChart,
    component: 'NInput',
    componentProps: { placeholder: '如：% / mm / °C' },
    span: 12
  },
  {
    path: 'chartType',
    label: '图表数据类型',
    component: 'NRadioGroup',
    defaultValue: '0',
    span: 12,
    ifShow: ({ values }) => values.isChart,
    componentProps: {
      options: [
        { label: '数值', value: '0' },
        { label: '百分比', value: '1' }
      ]
    }
  },
  // {
  //   path: 'status',
  //   label: '状态',
  //   component: 'NRadioGroup',
  //   defaultValue: 1,
  //   componentProps: {
  //     options: [
  //       { label: '正常', value: 1 },
  //       { label: '停用', value: 0 }
  //     ]
  //   }
  // },
  {
    path: 'remark',
    label: '备注',
    component: 'NInput',
    componentProps: { type: 'textarea', placeholder: '请输入内容' }
  }
]
