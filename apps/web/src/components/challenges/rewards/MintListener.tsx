'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useModal } from '@contexts/ModalProvider'
import { Rarity } from '@type/avatar'
import { MODAL_KEY } from '@constants/modal'
import ToastModal from '@shared/ToastModal'
import { NftMintJob, NftMintJobStatus } from '@apis/v1/nft/mint-jobs'
import { useMyMintJobsQuery } from '@apis/v1/nft/mint-jobs/query'
import RewardsModal from './RewardsModal'

export default function MintListener() {
  const router = useRouter()
  const pathname = usePathname()
  const { showModal } = useModal()
  const previousStatusesRef = useRef<Record<number, NftMintJobStatus>>({})
  const hasInitializedRef = useRef(false)
  const isPublicPage = pathname === '/signin' || pathname === '/register'
  const { data: mintJobs } = useMyMintJobsQuery({
    enabled: !isPublicPage,
    retry: false,
    refetchInterval: (query) => {
      const response = query.state.data

      return response?.data.some(isActiveMintJob) ? 3000 : false
    },
  })

  const showRewardsModal = useCallback((mintJob: NftMintJob) => {
    if (!mintJob.nftName || !mintJob.nftImage || !mintJob.nftRarity || !mintJob.nftCategory) return

    showModal({
      key: MODAL_KEY.REWARD,
      component: (
        <RewardsModal
          serialNumber={String(mintJob.tokenId ?? '').padStart(5, '0')}
          imageSrc={mintJob.nftImage}
          rarity={mintJob.nftRarity as Rarity}
          name={mintJob.nftName}
          category={mintJob.nftCategory}
        />
      ),
    })
  }, [showModal])

  useEffect(() => {
    const jobs = mintJobs?.data ?? []
    const nextStatuses = Object.fromEntries(jobs.map((job) => [job.mintJobId, job.status]))

    if (!hasInitializedRef.current) {
      previousStatusesRef.current = nextStatuses
      hasInitializedRef.current = true
      return
    }

    const completedJob = jobs.find((job) => {
      const previousStatus = previousStatusesRef.current[job.mintJobId]

      return previousStatus != null && previousStatus !== 'SUCCESS' && job.status === 'SUCCESS'
    })

    previousStatusesRef.current = nextStatuses

    if (completedJob) {
      router.refresh()
      showModal({
        key: MODAL_KEY.TOAST,
        component: (
          <ToastModal
            mode='success'
            message='NFT 발급 완료!'
            actionLabel='확인'
            onAction={() => showRewardsModal(completedJob)}
          />
        ),
      })
    }
  }, [mintJobs, router, showModal, showRewardsModal])

  return null
}

function isActiveMintJob(mintJob: NftMintJob) {
  return mintJob.status === 'PENDING' || mintJob.status === 'MINTING'
}
