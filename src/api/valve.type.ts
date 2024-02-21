export interface CreatedValve {
  name: string
  factoryId: number
  status?: number
  remark?: string
}

export interface ValveInfo {
  id: number
  name: string
  status: number
  remark: string
  factoryId: number
  createrId: number
  valves: number[]
  createdAt: string
  updatedAt: string
}

export interface SearchParams {
  page: number
  pageSize: number
  name?: string
  status?: number
}
