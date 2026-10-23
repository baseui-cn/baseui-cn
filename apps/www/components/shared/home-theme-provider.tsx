"use client"

import * as React from "react"
import { Drawer } from "@/components/ui/drawer"
import {
  defaultColor,
  defaultRadius,
  type ColorPreset,
  type RadiusPreset,
} from "@/lib/theme-presets"

const HomeThemeContext = React.createContext<{
  color: ColorPreset
  radius: RadiusPreset
  setColor: (color: ColorPreset) => void
  setRadius: (radius: RadiusPreset) => void
} | null>(null)
export function useHomeTheme() {
  const value = React.useContext(HomeThemeContext)
  if (!value) throw new Error("Setup theme preview requires HomeThemeProvider")
  return value
}
export function HomeThemeProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = React.useState(defaultColor)
  const [radius, setRadius] = React.useState(defaultRadius)
  return (
    <HomeThemeContext.Provider value={{ color, radius, setColor, setRadius }}>
      <Drawer swipeDirection="right">
        <div className="flex min-h-screen flex-col">{children}</div>
      </Drawer>
    </HomeThemeContext.Provider>
  )
}
