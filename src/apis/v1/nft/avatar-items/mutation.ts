import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveWearingNftAvatarWithProfileImage } from './index'
import { WEARING_NFT_AVATAR_QUERY_KEY } from './query'

export function useSaveWearingNftAvatarWithProfileImageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveWearingNftAvatarWithProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEARING_NFT_AVATAR_QUERY_KEY })
    },
  })
}
