import { RatingStars } from '@/app/components/ui/rating-stars'
import { useAppPages } from '@/store/app.store'
import { usePlayerActions, usePlayerStore } from '@/store/player.store'

interface PlayerRatingStarsProps {
  disabled: boolean
}

export function PlayerRatingStars({ disabled }: PlayerRatingStarsProps) {
  // Rating of the track currently playing
  const userRating = usePlayerStore(
    (state) => state.songlist.currentSong.userRating ?? 0,
  )
  const { rateCurrentSong } = usePlayerActions()
  const { hideRating } = useAppPages()

  if (hideRating) return null

  return (
    <RatingStars
      value={userRating}
      onChange={rateCurrentSong}
      disabled={disabled}
      // Match the padding of the player like button
      className="p-3"
    />
  )
}
