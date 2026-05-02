import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MintJobResponseType, StartMintJobRequestType, startMintJob } from './index'
import { MINT_JOBS_QUERY_KEY } from './query'

export function useStartMintJobMutation() {
  const queryClient = useQueryClient()

  return useMutation<MintJobResponseType, Error, StartMintJobRequestType>({
    mutationFn: startMintJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MINT_JOBS_QUERY_KEY })
    },
  })
}
