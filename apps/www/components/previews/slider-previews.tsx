"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"

function SliderPreview() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xs">
      <Slider defaultValue={[40]} />
      <Slider defaultValue={[20, 80]} />
    </div>
  )
}

function SliderBasicPreview() {
  return <Slider defaultValue={[50]} className="max-w-xs" />
}

function SliderRangePreview() {
  const [value, setValue] = React.useState([20, 80])
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <Slider value={value} onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])} />
      <p className="text-xs text-muted-foreground">Range: {value[0]} – {value[1]}</p>
    </div>
  )
}

function SliderVerticalPreview() {
  return (
    <div className="flex gap-6 h-32 items-center">
      <Slider defaultValue={[30]} orientation="vertical" />
      <Slider defaultValue={[60]} orientation="vertical" />
      <Slider defaultValue={[80]} orientation="vertical" />
    </div>
  )
}

function SliderWithStepsPreview() {
  const [value, setValue] = React.useState([25])
  return (
    <div className="flex flex-col gap-2 max-w-xs w-full">
      <Slider
        value={value}
        onValueChange={(v) => setValue(Array.isArray(v) ? [...v] : [v])}
        step={25}
        min={0}
        max={100}
      />
      <p className="text-xs text-muted-foreground">Step: 25 · Value: {value[0]}</p>
    </div>
  )
}

function SliderDisabledPreview() {
  return <Slider defaultValue={[50]} disabled className="max-w-xs" />
}

export const sliderPreviewMap: Record<string, React.ComponentType> = {
  slider: SliderPreview,
  "slider-demo": SliderPreview,
  "slider-basic": SliderBasicPreview,
  "slider-range": SliderRangePreview,
  "slider-vertical": SliderVerticalPreview,
  "slider-with-steps": SliderWithStepsPreview,
  "slider-disabled": SliderDisabledPreview,
}
