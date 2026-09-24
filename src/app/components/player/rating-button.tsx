import * as PopoverPrimitive from '@radix-ui/react-popover'
import clsx from 'clsx'
import { Star } from 'lucide-react'
import { CSSProperties, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { RatingStars } from '@/app/components/ui/rating-stars'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { useRefreshUserRatings } from '@/app/hooks/use-refresh-user-ratings'
import { cn } from '@/lib/utils'
import { usePlayerActions, usePlayerStore } from '@/store/player.store'

interface PlayerRatingButtonProps {
  disabled?: boolean
  className?: string
  style?: CSSProperties
  iconClassName?: string
  showTooltip?: boolean
}

export function PlayerRatingButton({
  disabled = false,
  className,
  style,
  iconClassName = 'w-5 h-5',
  showTooltip = true,
}: PlayerRatingButtonProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const {
    title: song,
    artist,
    userRating,
  } = usePlayerStore((state) => state.songlist.currentSong)
  const { rateCurrentSong } = usePlayerActions()
  const { refreshUserRatings } = useRefreshUserRatings()

  const isSongRated = (userRating ?? 0) > 0
  const ratingTooltip = t('player.tooltips.rate', { song, artist })

  // The button can live in the mini player window (Picture-in-Picture),
  // so the stars must be rendered in the document owning the button
  const portalContainer = triggerRef.current?.ownerDocument.body

  async function handleRate(rating: number) {
    await rateCurrentSong(rating)
    setIsOpen(false)
    // Keep the song tables in sync with the new rating
    refreshUserRatings()
  }

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <SimpleTooltip text={ratingTooltip} disabled={!showTooltip}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            ref={triggerRef}
            variant="ghost"
            className={cn(
              'rounded-full w-10 h-10 p-3 text-secondary-foreground data-[state=open]:bg-accent',
              className,
            )}
            style={style}
            disabled={disabled}
            data-testid="player-rating-button"
          >
            <Star
              className={clsx(
                iconClassName,
                isSongRated && 'text-gray-100 fill-gray-100',
              )}
              data-testid="player-rating-icon"
            />
          </Button>
        </PopoverPrimitive.Trigger>
      </SimpleTooltip>
      <PopoverPrimitive.Portal container={portalContainer}>
        <PopoverPrimitive.Content
          className={clsx(
            'z-50 w-fit h-10 px-3 py-0 flex items-center rounded-full border bg-popover text-popover-foreground shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=top]:slide-in-from-bottom-2',
          )}
          side="top"
          align="center"
          sideOffset={4}
        >
          <RatingStars value={userRating ?? 0} onChange={handleRate} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
