export interface CreatedTemplates {
  name: string
}

export interface TemplatesInfo {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface SearchParams {
  page: number
  pageSize: number
  name: string
}
