import { Star } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'

const STAR_INDEXES = [1, 2, 3, 4, 5]

interface RatingStarsProps {
  // Rating on a 0-5 scale (0 means no rating)
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
  className?: string
}

export function RatingStars({
  value,
  onChange,
  disabled = false,
  className,
}: RatingStarsProps) {
  // Star currently hovered, used to preview the rating before clicking
  const [hovered, setHovered] = useState<number | null>(null)

  // Preview the hovered rating, otherwise show the persisted value
  const displayed = hovered ?? value

  function handleSelect(rating: number) {
    // Selecting the active rating clears it (sends 0)
    onChange(rating === value ? 0 : rating)
  }

  return (
    <div
      className={cn('flex items-center', className)}
      onMouseLeave={() => setHovered(null)}
    >
      {STAR_INDEXES.map((rating) => (
        <Button
          key={rating}
          variant="ghost"
          disabled={disabled}
          className="w-6 h-6 p-0.5 rounded-full hover:bg-background/80"
          onMouseEnter={() => setHovered(rating)}
          onClick={(e) => {
            e.stopPropagation()
            handleSelect(rating)
          }}
        >
          <Star
            className={cn(
              'w-4 h-4',
              rating <= displayed && 'text-gray-100 fill-gray-100',
            )}
            strokeWidth={2}
          />
        </Button>
      ))}
    </div>
  )
}
