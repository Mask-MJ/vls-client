export * from './request'
export * from './env'
export * from './tsxHelper'
export * from './props'
export * from './window'
export * from './download'
export * from './permission'

const businessTypeMap: Record<string, string> = {
  '1': '日常',
  '2': 'STO'
}

export const formatBusinessType = (value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return ''
  return businessTypeMap[String(value)] || String(value)
}
