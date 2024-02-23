import type { CreatedTemplates, SearchParams, TemplatesInfo } from './template.type'

import { defHttp } from '@/utils'

enum Api {
  Template = 'templates'
}

// 获取模板列表
export const getTemplateList = (params?: Partial<SearchParams>) =>
  defHttp.get<TemplatesInfo[]>({ url: Api.Template, params })
// 创建模板
export const CreatedTemplate = (params: CreatedTemplates) =>
  defHttp.post({ url: Api.Template, params })
// 获取单个模板信息
export const getTemplateDetail = (id: number) =>
  defHttp.get<TemplatesInfo>({ url: `${Api.Template}/${id}` })
// 更新模板
export const updatedTemplate = (params: Partial<TemplatesInfo>) =>
  defHttp.patch({ url: `${Api.Template}/${params.id}`, params })
// 删除模板
export const deleteTemplate = (ids: number | string) =>
  defHttp.delete({ url: `${Api.Template}/${ids}` })
