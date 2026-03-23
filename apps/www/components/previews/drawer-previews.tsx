"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldContent, FieldLabel } from "../ui/field"

function DrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open Drawer</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Manage your preferences below.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 px-6 space-y-4">
          <Field>
            <FieldLabel>Display name</FieldLabel>
            <FieldContent>
              <Input defaultValue="Aria Chen" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Email notifications</FieldLabel>
            <FieldContent>
              <Switch defaultChecked />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Theme</FieldLabel>
            <FieldContent>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Dark">Dark</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground pt-1">
                Select works inside this Drawer — same Base UI portal system.
              </p>
            </FieldContent>
          </Field>
        </div>
        <DrawerFooter>
          <DrawerClose
            render={
              <Button variant="outline" className="w-full">
                Close
              </Button>
            }
          />
          <Button className="w-full">Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DrawerRightPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open right</Button>} />
      <DrawerContent side="right">
        <DrawerHeader><DrawerTitle>Right drawer</DrawerTitle></DrawerHeader>
        <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">Content goes here.</div>
        <DrawerFooter><DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} /></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DrawerLeftPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open left</Button>} />
      <DrawerContent side="left">
        <DrawerHeader><DrawerTitle>Left drawer</DrawerTitle></DrawerHeader>
        <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">Navigation or sidebar content.</div>
        <DrawerFooter><DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} /></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DrawerBottomSheetPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open bottom sheet</Button>} />
      <DrawerContent side="bottom">
        <DrawerHeader><DrawerTitle>Bottom sheet</DrawerTitle><DrawerDescription>Slides up from the bottom.</DrawerDescription></DrawerHeader>
        <div className="px-6 pb-6 text-sm text-muted-foreground">Ideal for mobile-style overlays.</div>
      </DrawerContent>
    </Drawer>
  )
}

function DrawerWithFormPreview() {
  return <DrawerPreview />
}

function DrawerNestedSelectPreview() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Drawer + Select</Button>} />
      <DrawerContent side="right">
        <DrawerHeader><DrawerTitle>Settings</DrawerTitle></DrawerHeader>
        <div className="flex-1 px-6 space-y-4">
          <Field><FieldLabel>Theme</FieldLabel><FieldContent>
            <Select>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select theme" /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent></Field>
        </div>
        <DrawerFooter><DrawerClose render={<Button variant="outline" className="w-full">Close</Button>} /></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const drawerPreviewMap: Record<string, React.ComponentType> = {
  drawer: DrawerPreview,
  "drawer-demo": DrawerPreview,
  "drawer-right": DrawerRightPreview,
  "drawer-left": DrawerLeftPreview,
  "drawer-bottom-sheet": DrawerBottomSheetPreview,
  "drawer-with-form": DrawerWithFormPreview,
  "drawer-nested-select": DrawerNestedSelectPreview,
}
