import type { CreatedFactorys, FactorysInfo, SearchParams } from './factory.type'

import { defHttp } from '@/utils'

enum Api {
  Factorys = 'factories'
}

// 获取工厂列表
export const getFactoryList = (params?: Partial<SearchParams>) =>
  defHttp.get<FactorysInfo[]>({ url: Api.Factorys, params })
// 创建工厂
export const createFactory = (params: CreatedFactorys) =>
  defHttp.post({ url: Api.Factorys, params })
// 获取单个工厂信息
export const getFactoryDetail = (id: number) =>
  defHttp.get<FactorysInfo>({ url: `${Api.Factorys}/${id}` })
// 更新工厂
export const updateFactory = (params: Partial<FactorysInfo>) =>
  defHttp.patch({ url: `${Api.Factorys}/${params.id}`, params })
// 删除工厂
export const deleteFactory = (ids: number | string) =>
  defHttp.delete({ url: `${Api.Factorys}/${ids}` })
