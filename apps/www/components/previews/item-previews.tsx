"use client"

import * as React from "react"

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
} from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function ItemPreview() {
  return (
    <div className="w-full max-w-md">
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <svg className="size-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>design-system.fig</ItemTitle>
            <ItemDescription>Updated 2 hours ago &middot; 4.2 MB</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="outline" size="sm">Figma</Badge>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <svg className="size-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>project-brief.docx</ItemTitle>
            <ItemDescription>Updated yesterday &middot; 128 KB</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="outline" size="sm">Document</Badge>
          </ItemActions>
        </Item>

        <Item variant="outline">
          <ItemMedia variant="icon">
            <svg className="size-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>hero-banner.png</ItemTitle>
            <ItemDescription>Updated 3 days ago &middot; 2.1 MB</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="outline" size="sm">Image</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}

function ItemBasicPreview() {
  return (
    <div className="w-full max-w-sm">
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemTitle>Simple Item</ItemTitle>
            <ItemDescription>A basic item with title and description.</ItemDescription>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>Another Item</ItemTitle>
            <ItemDescription>Items stack in a group automatically.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  )
}

function ItemWithMediaPreview() {
  const people = [
    { name: "Alice Chen", role: "Engineering Lead", initials: "AC", status: "bg-green-500" },
    { name: "Marcus Rivera", role: "Product Designer", initials: "MR", status: "bg-yellow-500" },
    { name: "Sarah Kim", role: "Frontend Developer", initials: "SK", status: "bg-green-500" },
    { name: "David Park", role: "DevOps Engineer", initials: "DP", status: "bg-muted-foreground" },
  ]

  return (
    <div className="w-full max-w-sm">
      <ItemGroup>
        {people.map((person) => (
          <Item key={person.name} variant="outline">
            <ItemMedia>
              <Avatar size="sm">
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{person.name}</ItemTitle>
              <ItemDescription>{person.role}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <div className={`size-2 rounded-full ${person.status}`} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

function ItemWithImagePreview() {
  const products = [
    { name: "Wireless Headphones", price: "$79.99", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop" },
    { name: "Smart Watch", price: "$199.99", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop" },
    { name: "Camera Lens", price: "$349.00", img: "https://images.unsplash.com/photo-1606986628253-e64cadc1ee4b?w=80&h=80&fit=crop" },
  ]

  return (
    <div className="w-full max-w-sm">
      <ItemGroup>
        {products.map((product) => (
          <Item key={product.name} variant="outline">
            <ItemMedia variant="image" className="rounded-md">
              <img src={product.img} alt={product.name} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{product.name}</ItemTitle>
              <ItemDescription>{product.price}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">Add</Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

function ItemVariantsPreview() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Default</p>
        <Item>
          <ItemContent>
            <ItemTitle>Default variant</ItemTitle>
            <ItemDescription>No border, transparent background.</ItemDescription>
          </ItemContent>
        </Item>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Outline</p>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Outline variant</ItemTitle>
            <ItemDescription>With a visible border.</ItemDescription>
          </ItemContent>
        </Item>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Muted</p>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Muted variant</ItemTitle>
            <ItemDescription>Subtle muted background.</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </div>
  )
}

function ItemWithHeaderFooterPreview() {
  return (
    <div className="w-full max-w-md">
      <Item variant="outline">
        <ItemHeader>
          <div className="flex items-center gap-2">
            <Avatar size="sm"><AvatarFallback>AC</AvatarFallback></Avatar>
            <span className="text-sm font-medium">Alice Chen</span>
          </div>
          <span className="text-xs text-muted-foreground">2 hours ago</span>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>
            Just shipped the new navigation menu component! It supports nested dropdowns, keyboard navigation, and responsive collapsing out of the box.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors flex items-center gap-1">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              24
            </button>
            <button className="hover:text-foreground transition-colors flex items-center gap-1">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              8
            </button>
          </div>
          <Button variant="ghost" size="sm">Reply</Button>
        </ItemFooter>
      </Item>
    </div>
  )
}

function ItemSizesPreview() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      {(["default", "sm", "xs"] as const).map((size) => (
        <div key={size}>
          <p className="text-xs text-muted-foreground mb-2">{size}</p>
          <Item variant="outline" size={size}>
            <ItemMedia variant="icon">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Size: {size}</ItemTitle>
              <ItemDescription>This shows the {size} item size.</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ))}
    </div>
  )
}

export const itemPreviewMap: Record<string, React.ComponentType> = {
  item: ItemPreview,
  "item-demo": ItemPreview,
  "item-basic": ItemBasicPreview,
  "item-with-media": ItemWithMediaPreview,
  "item-with-image": ItemWithImagePreview,
  "item-variants": ItemVariantsPreview,
  "item-with-header-footer": ItemWithHeaderFooterPreview,
  "item-sizes": ItemSizesPreview,
}
