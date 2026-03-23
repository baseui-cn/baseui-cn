"use client"

import * as React from "react"

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function CardPreview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 max-w-2xl w-full">
      <Card>
        <CardHeader>
          <CardTitle>Project Alpha</CardTitle>
          <CardDescription>Next-generation design system built on Base UI primitives.</CardDescription>
          <CardAction>
            <Badge variant="success">Active</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>12 components</span>
            <span>&middot;</span>
            <span>Updated 2 days ago</span>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="flex -space-x-2">
            {["AC", "MO", "JD"].map((initials) => (
              <Avatar key={initials} size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button variant="outline" size="sm">View project</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Jan 2024 &ndash; Mar 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold tracking-tight">$24,580</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-600 font-medium">+12.5%</span> from last month
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Based on 1,420 transactions</p>
        </CardFooter>
      </Card>
    </div>
  )
}

function CardBasicPreview() {
  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A brief description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is a basic card component. Use it to group related content and actions together.
        </p>
      </CardContent>
    </Card>
  )
}

function CardWithFooterPreview() {
  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Name</label>
            <input
              className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
              placeholder="My Awesome Project"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Framework</label>
            <select className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50">
              <option>Next.js</option>
              <option>Vite</option>
              <option>Remix</option>
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}

function CardWithActionPreview() {
  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">Mark all read</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {[
            { from: "Alice", msg: "Can you review the PR?", time: "2m ago" },
            { from: "Bob", msg: "Build succeeded.", time: "15m ago" },
            { from: "Charlie", msg: "Meeting at 3pm.", time: "1h ago" },
          ].map((n) => (
            <div key={n.from} className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{n.from[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{n.from}</p>
                  <p className="text-xs text-muted-foreground">{n.msg}</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CardSmallPreview() {
  return (
    <div className="flex gap-3 max-w-lg w-full">
      {[
        { title: "Total Users", value: "2,420", change: "+180" },
        { title: "Revenue", value: "$12.5k", change: "+22%" },
        { title: "Active Now", value: "573", change: "+201" },
      ].map((stat) => (
        <Card key={stat.title} size="sm" className="flex-1">
          <CardHeader>
            <CardTitle>{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-green-600 font-medium">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CardWithImagePreview() {
  return (
    <Card className="max-w-sm w-full">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop"
        alt="Mountain landscape"
        className="h-48 w-full object-cover"
      />
      <CardHeader>
        <CardTitle>Mountain Retreat</CardTitle>
        <CardDescription>Escape to the peaks for a weekend of adventure.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Swiss Alps</span>
          <span>&middot;</span>
          <span>3 nights</span>
          <span>&middot;</span>
          <span className="font-medium text-foreground">$1,200</span>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Book now</Button>
      </CardFooter>
    </Card>
  )
}

export const cardPreviewMap: Record<string, React.ComponentType> = {
  card: CardPreview,
  "card-demo": CardPreview,
  "card-basic": CardBasicPreview,
  "card-with-footer": CardWithFooterPreview,
  "card-with-action": CardWithActionPreview,
  "card-small": CardSmallPreview,
  "card-with-image": CardWithImagePreview,
}
