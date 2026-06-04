import { httpClient } from '@/api/httpClient'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'

interface SetRating {
  id: string
  // Rating from 1 to 5 stars; 0 removes the existing rating
  rating: number
}

// Sets the user rating of a track through the Subsonic /setRating endpoint
async function setRating({ id, rating }: SetRating) {
  await httpClient<SubsonicResponse>('/setRating', {
    method: 'GET',
    query: {
      id,
      rating,
    },
  })
}

export const rating = {
  setRating,
}
