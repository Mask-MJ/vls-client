export interface CreateDict {
  name: string
  templateId: number
  value: string
  remark: string
}

export interface DictInfo {
  id: number
  name: string
  value: string
  remark: string
  templateId: number
  createrId: number
  template: number[]
  createdAt: string
  updatedAt: string
}

export interface SearchParams {
  page: number
  pageSize: number
  name?: string
  templateId: number
}
