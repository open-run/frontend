import { useMutation } from '@tanstack/react-query'
import { deleteUser, register } from './index'

export function useRegister() {
  return useMutation({
    mutationFn: register,
  })
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: deleteUser,
  })
}
