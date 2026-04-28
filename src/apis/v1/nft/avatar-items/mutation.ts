import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveWearingNftAvatar } from './index'
import { WEARING_NFT_AVATAR_QUERY_KEY } from './query'

export function useSaveWearingNftAvatarMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveWearingNftAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEARING_NFT_AVATAR_QUERY_KEY })
    },
  })
}
