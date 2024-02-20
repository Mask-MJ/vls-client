export interface CreatedRole {
  name: string
  roleKey: string
  sort: number
  remark: string
}

export interface RoleInfo {
  id: number
  name: string
  roleKey: string
  sort: number
  remark: string
  createdAt: string
  updatedAt: string
}

export interface SearchParams {
  pageSize: number
  pageNum: number
  name: string
  roleKey: string
  status: string
}

export interface MenuInfo {
  id: number
  name: string
  path: string
  icon: string
  sort: number
  parentId: number
  hidden: boolean
  createdAt: string
  updatedAt: string
}
