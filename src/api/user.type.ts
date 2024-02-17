export interface RegisterParams {
  account: string
  password: string
  nickname?: string
  roles?: string[]
}

export interface LoginParams {
  account: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

export interface UserInfo {
  id: number
  account: string
  nickname?: string
  avatar?: string
  status?: number
  roles: Role[]
  permissions: string[]
  createTime: string
  updateTime?: string
}

export interface Role {
  id: number
  name: string
  remark: string
  roleKey: string
  sort: number
  status: number
}

export interface SearchParams {
  status: number
  account: string
}
