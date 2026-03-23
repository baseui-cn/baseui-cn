"use client"

import * as React from "react"

import {
  Avatar,
  AvatarImage,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"

function AvatarPreview() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex items-end gap-4">
        {(["sm", "default", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <Avatar size={size}>
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {[
          { bg: "bg-green-500", label: "Online" },
          { bg: "bg-destructive", label: "Busy" },
          { bg: "bg-yellow-500", label: "Away" },
          { bg: "bg-muted-foreground", label: "Offline" },
        ].map(({ bg, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <Avatar>
              <AvatarFallback>MO</AvatarFallback>
              <AvatarBadge className={bg} />
            </Avatar>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <AvatarGroup>
        {["AC", "MO", "PN", "JD"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}

function AvatarBasicPreview() {
  return (
    <div className="flex gap-3">
      <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>MO</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
    </div>
  )
}

function AvatarWithBadgePreview() {
  return (
    <div className="flex gap-4">
      {[
        { bg: "bg-green-500", label: "Online" },
        { bg: "bg-destructive", label: "Busy" },
        { bg: "bg-yellow-500", label: "Away" },
        { bg: "bg-muted-foreground", label: "Offline" },
      ].map(({ bg, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <Avatar><AvatarFallback>MO</AvatarFallback><AvatarBadge className={bg} /></Avatar>
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}

function AvatarGroupPreview() {
  return (
    <AvatarGroup>
      {["AC", "MO", "PN", "JD"].map((i) => <Avatar key={i}><AvatarFallback>{i}</AvatarFallback></Avatar>)}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  )
}

function AvatarSizesPreview() {
  return (
    <div className="flex items-end gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <Avatar size={size}><AvatarFallback>AC</AvatarFallback></Avatar>
          <span className="text-[10px] text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  )
}

const sampleImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=80&h=80&fit=crop&crop=face",
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
      {(["sm", "default", "lg"] as const).map((size, i) => (
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
        <Avatar key={i}>
          <AvatarImage src={src} alt={`User ${i + 1}`} />
          <AvatarFallback>{["AC", "MO", "JD", "KL"][i]}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
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
