"use client"

import * as React from "react"
import { MenuIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { DocsNavigation } from "./docs-sidebar"

export function DocsMobileNav() {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="left">
      <DrawerTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xl"
            className="md:hidden"
            aria-label="Browse documentation"
          />
        }
      >
        <MenuIcon aria-hidden="true" size={20} />
      </DrawerTrigger>
      <DrawerContent side="left" className="docs-mobile-drawer">
        <DrawerHeader className="relative pr-[68px]">
          <DrawerTitle>Browse documentation</DrawerTitle>
          <DrawerDescription>Guides, components and blocks.</DrawerDescription>
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-xl"
                className="absolute right-[12px] top-[12px]"
                aria-label="Close documentation navigation"
              />
            }
          >
            <XIcon aria-hidden="true" size={20} />
          </DrawerClose>
        </DrawerHeader>
        <DocsNavigation onNavigate={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  )
}
