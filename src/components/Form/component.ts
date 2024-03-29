import type { UploadFileParams } from './types'
import type {
  AutoCompleteProps,
  CascaderProps,
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  DividerProps,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  RateProps,
  SelectProps,
  SliderProps,
  SwitchProps,
  TagProps,
  TimePickerProps,
  TreeProps,
  TreeSelectProps,
  UploadProps
} from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { FormActionType, FormSchema } from '@/components/Form/types'

interface NInput {
  component: 'NInput'
  componentProps?:
    | InputProps
    | ((arg: { schema: FormSchema; formModel: any; formActionType: FormActionType }) => InputProps)
}

interface NIconPicker {
  component: 'NIconPicker'
  componentProps?: InputProps
}

interface NInputNumber {
  component: 'NInputNumber'
  componentProps?: InputNumberProps
}

interface NSelect {
  component: 'NSelect'
  componentProps?: SelectProps
}

interface NTreeSelect {
  component: 'NTreeSelect'
  componentProps?: TreeSelectProps
}

type ApiSelectComponentProps = SelectProps & {
  api: any
  params?: any
  immediate?: boolean
  resultField?: string
  queryField?: string
}

interface ApiSelect {
  component: 'ApiSelect'
  componentProps?:
    | ApiSelectComponentProps
    | ((arg: {
        schema: FormSchema
        formModel: any
        formActionType: FormActionType
      }) => ApiSelectComponentProps)
}

interface NTree {
  component: 'NTree'
  componentProps?: TreeProps
}

interface ApiTree {
  component: 'ApiTree'
  componentProps?: TreeProps & {
    api: any
    style?: CSSProperties
    params?: any
    immediate?: boolean
    resultField?: string
    afterFetch?: any
    defaultCheckedKeys?: (string | number)[]
  }
}

interface ApiTreeSelect {
  component: 'ApiTreeSelect'
  componentProps?: TreeSelectProps & {
    api: any
    params?: any
    immediate?: boolean
    resultField?: string
  }
}

interface Upload {
  component: 'Upload'
  componentProps?: UploadProps & {
    type?: string[]
    api?: (options: UploadFileParams) => void
  }
}

interface NRadioGroup {
  component: 'NRadioGroup'
  componentProps?: RadioGroupProps & {
    type?: String
    options: OptionsItem[]
  }
}

interface NCheckbox {
  component: 'NCheckbox'
  componentProps?: CheckboxProps
}

interface NCheckboxGroup {
  component: 'NCheckboxGroup'
  componentProps?: CheckboxGroupProps
}

interface AutoComplete {
  component: 'AutoComplete'
  componentProps?: AutoCompleteProps & {
    api?: any
    params?: any
    immediate?: boolean
    labelField?: string
    valueField?: string
    resultField?: string
    allOptions?: boolean
  }
}

interface NCascader {
  component: 'NCascader'
  componentProps?: CascaderProps
}

interface NDatePicker {
  component: 'NDatePicker'
  componentProps?: DatePickerProps
}

interface NTimePicker {
  component: 'NTimePicker'
  componentProps?: TimePickerProps
}

interface NSwitch {
  component: 'NSwitch'
  componentProps?: SwitchProps
}

interface NSlider {
  component: 'NSlider'
  componentProps?: SliderProps
}

interface NDivider {
  component: 'NDivider'
  componentProps?: DividerProps
}

interface NRate {
  component: 'NRate'
  componentProps?: RateProps
}

interface SelectPicker {
  component: 'SelectPicker'
  componentProps: {
    options: SelectPickerOption[]
  }
}

export type ComponentMap =
  | NInput
  | NInputNumber
  | NSelect
  | ApiSelect
  | NIconPicker
  | NTreeSelect
  | NTree
  | ApiTree
  | ApiTreeSelect
  | NRadioGroup
  | NCheckbox
  | NCheckboxGroup
  | NCascader
  | NDatePicker
  | NTimePicker
  | NSwitch
  | NSlider
  | NDivider
  | NRate
  | Upload
  | AutoComplete
  | SelectPicker

export type ComponentType = Pick<ComponentMap, 'component'>['component']

export type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean }

export type SelectPickerOption = {
  label: string
  color?: string
  path: string
} & TagProps
