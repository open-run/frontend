import http from '@apis/axios'
import { ApiResponse } from '@apis/type'

export type NftMintJobStatus = 'PENDING' | 'MINTING' | 'SUCCESS' | 'FAILED'
export type ApiDateTime = string | number[] | null

export type NftMintJob = {
  mintJobId: number
  userChallengeId: number
  challengeName: string
  status: NftMintJobStatus
  tokenId: string | null
  transactionHash: string | null
  errorMessage: string | null
  nftName: string | null
  nftDescription: string | null
  nftImage: string | null
  nftCategory: string | null
  nftRarity: string | null
  createdAt: ApiDateTime
  updatedAt: ApiDateTime
}

export type MintJobResponseType = ApiResponse<NftMintJob>
export type MintJobsResponseType = ApiResponse<NftMintJob[]>

export type StartMintJobRequestType = {
  userChallengeId: number
}

export function startMintJob({ userChallengeId }: StartMintJobRequestType): Promise<MintJobResponseType> {
  return http.post('/v1/nft/mint-jobs', null, { params: { userChallengeId } })
}

export function getMyMintJobs(): Promise<MintJobsResponseType> {
  return http.get('/v1/nft/mint-jobs/me')
}
