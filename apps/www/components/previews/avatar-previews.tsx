"use client"

import * as React from "react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

const statusBadges = [
  { variant: "online", label: "Online (top right)", position: "top-right" },
  { variant: "busy", label: "Busy (top left)", position: "top-left" },
  { variant: "away", label: "Away (bottom right)", position: "bottom-right" },
  { variant: "offline", label: "Offline (bottom left)", position: "bottom-left" },
] as const

const avatarSizes = ["xs", "sm", "md", "lg"] as const

function AvatarPreview() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex items-end gap-4">
        {avatarSizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Avatar size={size}>
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {statusBadges.map(({ variant, label, position }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <Avatar showBadge badgeVariant={variant} badgePosition={position}>
              <AvatarFallback>MO</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <AvatarGroup>
        {["AC", "MO", "PN", "JD"].map((initials) => (
          <Avatar key={initials} className="hover:z-10">
            <AvatarFallback className="border border-transparent">{initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount size="md">+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}

function AvatarBasicPreview() {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MO</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  )
}

function AvatarWithBadgePreview() {
  return (
    <div className="flex gap-4">
      {statusBadges.map(({ variant, label, position }) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <Avatar showBadge badgeVariant={variant} badgePosition={position}>
            <AvatarFallback>MO</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}

function AvatarGroupPreview() {
  return (
    <AvatarGroup>
      {["AC", "MO", "PN", "JD"].map((i) => (
        <Avatar key={i} className="hover:z-10">
          <AvatarFallback className="border border-transparent">{i}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount size="md">+4</AvatarGroupCount>
    </AvatarGroup>
  )
}

function AvatarSizesPreview() {
  return (
    <div className="flex items-end gap-4">
      {avatarSizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <Avatar size={size}>
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  )
}

const sampleImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
  "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80",
]

function AvatarWithImagePreview() {
  return (
    <div className="flex gap-3">
      {sampleImages.map((src, i) => (
        <Avatar key={i}>
          <AvatarImage src={src} alt={`User ${i + 1}`} />
          <AvatarFallback>{["AC", "MO", "JD", "KL"][i]}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}

function AvatarImageSizesPreview() {
  return (
    <div className="flex items-end gap-4">
      {avatarSizes.map((size, i) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <Avatar size={size}>
            <AvatarImage src={sampleImages[i]} alt={`User ${size}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  )
}

function AvatarImageGroupPreview() {
  return (
    <AvatarGroup>
      {sampleImages.map((src, i) => (
        <Avatar key={i} className="hover:z-10 border-1 border-transparent">
          <AvatarImage src={src} alt={`User ${i + 1}`} />
          <AvatarFallback>{["AC", "MO", "JD", "KL"][i]}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount size="md">+3</AvatarGroupCount>
    </AvatarGroup>
  )
}

export const avatarPreviewMap: Record<string, React.ComponentType> = {
  avatar: AvatarPreview,
  "avatar-demo": AvatarPreview,
  "avatar-basic": AvatarBasicPreview,
  "avatar-with-badge": AvatarWithBadgePreview,
  "avatar-group": AvatarGroupPreview,
  "avatar-sizes": AvatarSizesPreview,
  "avatar-with-image": AvatarWithImagePreview,
  "avatar-image-sizes": AvatarImageSizesPreview,
  "avatar-image-group": AvatarImageGroupPreview,
}
