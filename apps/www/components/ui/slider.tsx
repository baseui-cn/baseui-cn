"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import "@/styles/slider.styles.css"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = React.useMemo(() => {
    const currentValue = value ?? defaultValue ?? min
    return Array.isArray(currentValue) ? currentValue : [currentValue]
  }, [value, defaultValue, min])

  return (
    <SliderPrimitive.Root
      className={cn("cn-slider", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control data-slot="slider-control" className="cn-slider-control">
        <SliderPrimitive.Track data-slot="slider-track" className="cn-slider-track">
          <SliderPrimitive.Indicator data-slot="slider-range" className="cn-slider-range" />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            getAriaLabel={
              props["aria-label"]
                ? () => `${props["aria-label"]}${_values.length > 1 ? ` ${index + 1}` : ""}`
                : undefined
            }
            className="cn-slider-thumb"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
