import { useMutation } from '@tanstack/react-query'
import { fetchReverseGeocoding } from './index'

export function useReverseGeocodingMutation() {
  return useMutation({
    mutationFn: fetchReverseGeocoding,
  })
}
