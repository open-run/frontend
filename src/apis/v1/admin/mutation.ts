import { useMutation } from '@tanstack/react-query'
import { grantAdminNftAvatarItem } from './index'

export function useGrantAdminNftAvatarItemMutation() {
  return useMutation({
    mutationFn: grantAdminNftAvatarItem,
  })
}
