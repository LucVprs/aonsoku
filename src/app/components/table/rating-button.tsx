import { useEffect, useState } from 'react'
import { RatingStars } from '@/app/components/ui/rating-stars'
import { useRefreshUserRatings } from '@/app/hooks/use-refresh-user-ratings'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions, usePlayerSonglist } from '@/store/player.store'

interface TableRatingButtonProps {
  entityId: string
  userRating: number
}

export function TableRatingButton({
  entityId,
  userRating,
}: TableRatingButtonProps) {
  const [rating, setRating] = useState(userRating)
  const { currentSong } = usePlayerSonglist()
  const { rateCurrentSong, rateSongInQueue } = usePlayerActions()
  const { refreshUserRatings } = useRefreshUserRatings()

  // Keep the row in sync when the rating of the playing track changes
  useEffect(() => {
    const isSongPlaying = currentSong.id === entityId

    if (isSongPlaying) setRating(currentSong.userRating ?? 0)
  }, [currentSong, entityId])

  async function handleRate(value: number) {
    const isSongPlaying = currentSong.id === entityId

    if (isSongPlaying) {
      // Persists on the server and syncs the queue in one call
      await rateCurrentSong(value)
    } else {
      await subsonic.rating.setRating({ id: entityId, rating: value })
      rateSongInQueue(entityId, value)
    }

    setRating(value)
    refreshUserRatings()
  }

  return <RatingStars value={rating} onChange={handleRate} />
}
