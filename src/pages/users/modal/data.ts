import type { FormSchema } from '@/components/Form'

export const schemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  {
    path: 'account',
    label: '账号',
    required: true,
    component: 'NInput',
    componentProps: ({ formModel }) => {
      return { disabled: Boolean(formModel.id) }
    }
  },
  {
    path: 'nickname',
    label: '用户昵称',
    required: true,
    component: 'NInput'
  },
  {
    path: 'password',
    label: '用户密码',
    required: true,
    component: 'NInput',
    ifShow: ({ model }) => !model.id
  },
  {
    path: 'status',
    label: '状态',
    component: 'NRadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 }
      ]
    }
  },
  {
    path: 'roles',
    label: '角色',
    component: 'NSelect',
    componentProps: {
      multiple: true,
      options: [
        { label: '管理员', value: 1 },
        { label: '普通用户', value: 2 }
      ]
    }
  },
  {
    path: 'remark',
    label: '备注',
    component: 'NInput',
    componentProps: { type: 'textarea', placeholder: '请输入内容' }
  }
]

export const resetSchemas: FormSchema[] = [
  { path: 'id', component: 'NInputNumber', show: false },
  {
    path: 'password',
    label: '新密码',
    component: 'NInput',
    rule: [
      {
        required: true,
        trigger: 'change',
        validator: (_rule, value) =>
          new RegExp(/^.{4,20}$/).test(value)
            ? Promise.resolve()
            : Promise.reject('用户密码长度必须介于 4 和 20 之间')
      }
    ]
  }
]
