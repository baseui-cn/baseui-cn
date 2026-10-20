"use client"

import { useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { StarIcon } from "lucide-react"

import "@/styles/data.styles.css"

const ratingVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "gap-2",
      default: "gap-2.5",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const starVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const valueVariants = cva("text-muted-foreground w-5", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Rating({
  rating,
  maxRating = 5,
  size,
  className,
  starClassName,
  showValue = false,
  editable = false,
  onRatingChange,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof ratingVariants> & {
    /**
     * Current rating value (supports decimal values for partial stars)
     */
    rating: number
    /**
     * Maximum rating value (number of stars to show)
     */
    maxRating?: number
    /**
     * Whether to show the numeric rating value
     */
    showValue?: boolean
    /**
     * Class name for the value span
     */
    starClassName?: string
    /**
     * Whether the rating is editable (clickable)
     */
    editable?: boolean
    /**
     * Callback function called when rating changes
     */
    onRatingChange?: (rating: number) => void
  }) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const displayRating = editable && hoveredRating !== null ? hoveredRating : rating

  const handleStarClick = (starRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  const handleStarMouseEnter = (starRating: number) => {
    if (editable) {
      setHoveredRating(starRating)
    }
  }

  const handleStarMouseLeave = () => {
    if (editable) {
      setHoveredRating(null)
    }
  }

  const handleStarKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    let next = index
    if (event.key === "Home") next = 1
    else if (event.key === "End") next = maxRating
    else if (event.key === "ArrowRight") next += rtl ? -1 : 1
    else if (event.key === "ArrowLeft") next += rtl ? 1 : -1
    else return
    event.preventDefault()
    next = Math.max(1, Math.min(maxRating, next))
    const group = event.currentTarget.parentElement
    group?.querySelectorAll<HTMLButtonElement>("button")[next - 1]?.focus()
    handleStarClick(next)
  }

  const renderStars = () => {
    const stars = []

    for (let i = 1; i <= maxRating; i++) {
      const filled = displayRating >= i
      const partiallyFilled = displayRating > i - 1 && displayRating < i
      const fillPercentage = partiallyFilled ? (displayRating - (i - 1)) * 100 : 0

      const Star = editable ? "button" : "span"
      stars.push(
        <Star
          key={i}
          type={editable ? "button" : undefined}
          aria-label={editable ? `Rate ${i} of ${maxRating}` : undefined}
          aria-pressed={editable ? Math.round(rating) === i : undefined}
          tabIndex={
            editable
              ? i === Math.max(1, Math.min(maxRating, Math.round(rating)))
                ? 0
                : -1
              : undefined
          }
          onKeyDown={editable ? (event) => handleStarKeyDown(event, i) : undefined}
          className={cn("rating-star-layout relative", editable && "cursor-pointer")}
          onClick={editable ? () => handleStarClick(i) : undefined}
          onMouseEnter={editable ? () => handleStarMouseEnter(i) : undefined}
          onMouseLeave={editable ? handleStarMouseLeave : undefined}
        >
          <span className="relative block" aria-hidden="true">
            {/* Background star (empty) */}
            <StarIcon className={cn(starVariants({ size }), "text-muted-foreground")} />

            {/* Filled star */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                width: filled ? "100%" : `${fillPercentage}%`,
              }}
            >
              <StarIcon
                data-slot="rating-star-filled"
                className={cn(starVariants({ size }), "fill-warning text-warning")}
              />
            </div>
          </span>
        </Star>
      )
    }

    return stars
  }

  return (
    <div data-slot="rating" className={cn(ratingVariants({ size }), className)} {...props}>
      <div
        className="flex items-center"
        role={editable ? "group" : "img"}
        aria-label={editable ? "Rating" : `${rating} out of ${maxRating}`}
      >
        {renderStars()}
      </div>
      {showValue && (
        <span data-slot="rating-value" className={cn(valueVariants({ size }), starClassName)}>
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export { Rating }
