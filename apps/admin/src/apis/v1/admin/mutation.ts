import { useMutation } from '@tanstack/react-query'
import { createAdminChallenge, deleteAdminChallenge, grantAdminNftAvatarItem, updateAdminChallenge } from './index'

export function useGrantAdminNftAvatarItemMutation() {
  return useMutation({
    mutationFn: grantAdminNftAvatarItem,
  })
}

export function useCreateAdminChallengeMutation() {
  return useMutation({
    mutationFn: createAdminChallenge,
  })
}

export function useUpdateAdminChallengeMutation() {
  return useMutation({
    mutationFn: updateAdminChallenge,
  })
}

export function useDeleteAdminChallengeMutation() {
  return useMutation({
    mutationFn: deleteAdminChallenge,
  })
}
