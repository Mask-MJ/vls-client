import type { CreateDict, DictInfo, SearchParams } from './dict.type'

import { defHttp } from '@/utils'

enum Api {
  Dicts = 'dicts'
}

// 获取字典列表
export const getDictList = (params?: Partial<SearchParams>) =>
  defHttp.get<DictInfo[]>({ url: Api.Dicts, params })
// 创建字典
export const createDict = (params: CreateDict) => defHttp.post<DictInfo>({ url: Api.Dicts, params })
// 获取单个字典信息
export const getDictDetail = (id: number) => defHttp.get<DictInfo>({ url: `${Api.Dicts}/${id}` })
// 更新字典
export const updateDict = (params: Partial<DictInfo>) =>
  defHttp.patch({ url: `${Api.Dicts}/${params.id}`, params })
// 删除字典
export const deleteDict = (ids: number | string) => defHttp.delete({ url: `${Api.Dicts}/${ids}` })
