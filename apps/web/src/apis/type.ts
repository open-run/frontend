export type ApiResponse<DataType> = {
  message: string
  data: DataType
}

export type Pagination = {
  totalPages: number
  totalElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export type PaginationResponse<DataType> = Pagination & ApiResponse<DataType>
