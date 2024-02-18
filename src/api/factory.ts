import type { CreatedFactorys, FactorysInfo, SearchParams } from './factory.type'

import { defHttp } from '@/utils'

enum Api {
  Factorys = 'factorys'
}

// 获取工厂列表
export const getFactorysList = (params?: Partial<SearchParams>) =>
  defHttp.get<FactorysInfo[]>({ url: Api.Factorys, params })
// 创建工厂
export const createFactorys = (params: CreatedFactorys) =>
  defHttp.post({ url: Api.Factorys, params })
// 获取单个工厂信息
export const getFactorysDetail = (id: number) =>
  defHttp.get<FactorysInfo>({ url: `${Api.Factorys}/${id}` })
// 更新工厂
export const updateFactorys = (params: Partial<FactorysInfo>) =>
  defHttp.patch({ url: `${Api.Factorys}/${params.id}`, params })
// 删除工厂
export const deleteFactorys = (ids: number | string) =>
  defHttp.delete({ url: `${Api.Factorys}/${ids}` })
