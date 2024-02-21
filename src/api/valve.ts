import type { CreatedValve, SearchParams, ValveInfo } from './valve.type'

import { defHttp } from '@/utils'

enum Api {
  Valves = 'valves'
}

// 获取工厂列表
export const getValveList = (params?: Partial<SearchParams>) =>
  defHttp.get<ValveInfo[]>({ url: Api.Valves, params })
// 创建工厂
export const createValve = (params: CreatedValve) => defHttp.post({ url: Api.Valves, params })
// 获取单个工厂信息
export const getValveDetail = (id: number) => defHttp.get<ValveInfo>({ url: `${Api.Valves}/${id}` })
// 更新工厂
export const updateValve = (params: Partial<ValveInfo>) =>
  defHttp.patch({ url: `${Api.Valves}/${params.id}`, params })
// 删除工厂
export const deleteValve = (ids: number | string) => defHttp.delete({ url: `${Api.Valves}/${ids}` })
