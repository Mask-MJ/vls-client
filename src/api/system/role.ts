import type { Result } from '@/utils/request/types'

import { defHttp } from '@/utils'

export interface CreatedRole {
  name: string
  roleKey: string
  sort: number
  remark: string
}

export interface RoleInfo {
  id: number
  name: string
  value: string
  sort: number
  menu?: number[]
  factory?: number[]
  grantAllFactories?: boolean
  remark: string
  createdAt: string
  updatedAt: string
}

export interface SearchParams {
  name: string | null
  beginTime: number | null
  endTime: number | null
  page: number
  pageSize: number
}

enum Api {
  Role = 'system/role',
  Menu = 'system/menu'
}

// 获取角色列表
export const getRoleList = (params?: Partial<SearchParams>) =>
  defHttp.get<Result<RoleInfo[]>>({ url: Api.Role, params })
// 创建角色
export const createRole = (params: CreatedRole) => defHttp.post({ url: Api.Role, params })
// 获取单个角色信息
export const getRoleDetail = (id: number) => defHttp.get<RoleInfo>({ url: `${Api.Role}/${id}` })
// 更新角色
export const updateRole = (params: Partial<RoleInfo>) =>
  defHttp.patch({ url: `${Api.Role}/${params.id}`, params })
// 删除角色
export const deleteRole = (ids: number | string) => defHttp.delete({ url: `${Api.Role}/${ids}` })
