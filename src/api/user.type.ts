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
  roles: string[]
  permissions: string[]
  createTime: string
  updateTime?: string
}

export interface ChangeStatusParams {
  id: number
  status: number
}

export interface ResetPasswordParams {
  id: number
  password: string
}
