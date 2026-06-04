import { RatingStars } from '@/app/components/ui/rating-stars'
import { usePlayerActions, usePlayerStore } from '@/store/player.store'

const HIDE_RATING = window.HIDE_RATING ?? true

interface PlayerRatingStarsProps {
  disabled: boolean
}

export function PlayerRatingStars({ disabled }: PlayerRatingStarsProps) {
  // Rating of the track currently playing
  const userRating = usePlayerStore(
    (state) => state.songlist.currentSong.userRating ?? 0,
  )
  const { rateCurrentSong } = usePlayerActions()

  if (HIDE_RATING) return null

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
