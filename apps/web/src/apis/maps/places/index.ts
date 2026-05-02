export type RequestType = {
  input: string
}

export type ResponseType = {
  suggestions: Array<{
    placePrediction: {
      placeId: string
      structuredFormat: {
        mainText: {
          matches: unknown[]
          text: string
        }
        secondaryText: {
          text: string
        }
      }
    }
  }>
}

export async function fetchPlacesAutocomplete(request: RequestType): Promise<ResponseType> {
  const response = await fetch('/api/places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch places')
  }

  return response.json()
}
