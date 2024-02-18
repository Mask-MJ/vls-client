import type { CreatedRole, RoleInfo, SearchParams } from './role.type'

import { defHttp } from '@/utils'

enum Api {
  Roles = 'roles',
  Menus = 'menus'
}

// 获取角色列表
export const getRolesList = (params?: Partial<SearchParams>) =>
  defHttp.get<RoleInfo[]>({ url: Api.Roles, params })
// 创建角色
export const createRole = (params: CreatedRole) => defHttp.post({ url: Api.Roles, params })
// 获取单个角色信息
export const getRoleDetail = (id: number) => defHttp.get<RoleInfo>({ url: `${Api.Roles}/${id}` })
// 更新角色
export const updateRole = (params: Partial<RoleInfo>) =>
  defHttp.patch({ url: `${Api.Roles}/${params.id}`, params })
// 删除角色
export const deleteRole = (ids: number | string) => defHttp.delete({ url: `${Api.Roles}/${ids}` })

// 获取菜单权限
export const getMenusList = () => defHttp.get({ url: Api.Menus })
