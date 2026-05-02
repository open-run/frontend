import { useMutation } from '@tanstack/react-query'
import { fetchPlacesAutocomplete } from '.'

export function usePlacesAutocomplete() {
  return useMutation({
    mutationFn: fetchPlacesAutocomplete,
  })
}
