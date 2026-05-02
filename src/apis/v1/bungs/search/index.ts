import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { ApiResponse } from '@apis/type'

export type BungSearchCategory = 'NAME' | 'MEMBER' | 'HASHTAG' | 'LOCATION'

export type SearchBungsRequestType = {
  keyword: string
  category?: BungSearchCategory
  page?: number
  limit?: number
}

export type BungSearchCategoryResult = {
  category: BungSearchCategory
  label: string
  data: BungInfo[]
  totalPages: number
  totalElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export type SearchBungsResponseType = ApiResponse<{
  keyword: string
  categories: BungSearchCategoryResult[]
}>

export function searchBungs(request: SearchBungsRequestType): Promise<SearchBungsResponseType> {
  return http.get('/v1/bungs/search', { params: request })
}
