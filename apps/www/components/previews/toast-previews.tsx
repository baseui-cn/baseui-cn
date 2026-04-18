"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ToastProvider, useToast } from "@/components/ui/toast"
import type { ToastPosition } from "@/components/ui/toast"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"

/* ─── Default demo ─── */

function ToastDemo() {
  const { add } = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Changes saved",
            description: "Your profile has been updated.",
            timeout: 3000,
          })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Success!",
            description: "Your changes have been saved.",
            type: "success",
            timeout: 3000,
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Error",
            description: "Something went wrong.",
            type: "error",
            timeout: 3000,
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          add({
            title: "Warning",
            description: "Please review your settings.",
            type: "warning",
            timeout: 3000,
          })
        }
      >
        Warning
      </Button>
    </div>
  )
}

function ToastPreview() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  )
}

/* ─── Variants ─── */

function ToastVariantsDemo() {
  const { add } = useToast()
  const variants = [
    { type: undefined, label: "Default", title: "Info", desc: "This is a default toast." },
    { type: "success" as const, label: "Success", title: "Success!", desc: "Operation completed." },
    { type: "error" as const, label: "Error", title: "Error", desc: "Something went wrong." },
    { type: "warning" as const, label: "Warning", title: "Warning", desc: "Please be careful." },
    { type: "info" as const, label: "Info", title: "Heads up", desc: "Here is some information." },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <Button
          key={v.label}
          variant="outline"
          onClick={() => add({ title: v.title, description: v.desc, type: v.type, timeout: 3000 })}
        >
          {v.label}
        </Button>
      ))}
    </div>
  )
}

function ToastVariantsPreview() {
  return (
    <ToastProvider>
      <ToastVariantsDemo />
    </ToastProvider>
  )
}

/* ─── With action (undo) ─── */

function ToastActionDemo() {
  const toastManager = useToast()

  function performAction() {
    const id = toastManager.add({
      title: "Item deleted",
      description: "The item has been removed.",
      type: "success",
      timeout: 5000,
      actionProps: {
        children: "Undo",
        onClick() {
          toastManager.close(id)
          toastManager.add({
            title: "Restored",
            description: "The item has been restored.",
            timeout: 3000,
          })
        },
      },
    })
  }

  return (
    <Button variant="outline" onClick={performAction}>
      Delete item
    </Button>
  )
}

function ToastWithActionPreview() {
  return (
    <ToastProvider>
      <ToastActionDemo />
    </ToastProvider>
  )
}

/* ─── Promise with Loader2 ─── */

function ToastPromiseDemo() {
  const toastManager = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        toastManager.promise(
          new Promise<string>((resolve, reject) => {
            const shouldSucceed = Math.random() > 0.3
            setTimeout(() => {
              shouldSucceed ? resolve("Data loaded") : reject(new Error("Request failed"))
            }, 2000)
          }),
          {
            loading: {
              title: "Loading...",
              description: "Please wait while we fetch your data.",
              type: "loading",
            },
            success: (data: string) => ({
              title: "Done!",
              description: `${data} successfully.`,
            }),
            error: (err: Error) => ({
              title: "Error",
              description: err.message,
            }),
          }
        )
      }
    >
      <Loader2 className="mr-2 size-4" />
      Run promise
    </Button>
  )
}

function ToastPromisePreview() {
  return (
    <ToastProvider>
      <ToastPromiseDemo />
    </ToastProvider>
  )
}

/* ─── Custom data ─── */

function ToastCustomDemo() {
  const toastManager = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        toastManager.add({
          title: "New follower",
          description: "jane_doe started following you.",
          data: { userId: "123" },
        })
      }
    >
      Custom data toast
    </Button>
  )
}

function ToastCustomPreview() {
  return (
    <ToastProvider>
      <ToastCustomDemo />
    </ToastProvider>
  )
}

/* ─── Toast from Drawer ─── */

function ToastFromDrawerDemo() {
  const toastManager = useToast()
  const [name, setName] = React.useState("Aria Chen")

  function handleSave() {
    toastManager.add({
      title: "Profile updated",
      description: `Name changed to "${name}".`,
      type: "success",
      timeout: 4000,
    })
  }

  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Update your name and save. Closing the toast won&apos;t close the drawer.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="drawer-name" className="text-sm font-medium">
              Display name
            </label>
            <Input
              id="drawer-name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Close drawer</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ToastFromDrawerPreview() {
  return (
    <ToastProvider>
      <ToastFromDrawerDemo />
    </ToastProvider>
  )
}

/* ─── Positions ─── */

function ToastPositionsDemo() {
  const positions: { pos: ToastPosition; label: string }[] = [
    { pos: "top-left", label: "Top Left" },
    { pos: "top-center", label: "Top Center" },
    { pos: "top-right", label: "Top Right" },
    { pos: "bottom-left", label: "Bottom Left" },
    { pos: "bottom-center", label: "Bottom Center" },
    { pos: "bottom-right", label: "Bottom Right" },
  ]
  const [selected, setSelected] = React.useState<ToastPosition>("bottom-right")

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {positions.map(({ pos, label }) => (
          <Button
            key={pos}
            variant={selected === pos ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(pos)}
          >
            {label}
          </Button>
        ))}
      </div>
      <ToastProvider position={selected}>
        <ToastPositionTrigger position={selected} />
      </ToastProvider>
    </div>
  )
}

function ToastPositionTrigger({ position }: { position: ToastPosition }) {
  const { add } = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        add({
          title: `Toast — ${position}`,
          description: `This toast appears at the ${position.replace("-", " ")} of the screen.`,
          timeout: 3000,
        })
      }
    >
      Show toast
    </Button>
  )
}

function ToastTopLeftPreview() {
  return (
    <ToastProvider position="top-left">
      <ToastPositionButton position="top-left" />
    </ToastProvider>
  )
}

function ToastTopCenterPreview() {
  return (
    <ToastProvider position="top-center">
      <ToastPositionButton position="top-center" />
    </ToastProvider>
  )
}

function ToastTopRightPreview() {
  return (
    <ToastProvider position="top-right">
      <ToastPositionButton position="top-right" />
    </ToastProvider>
  )
}

function ToastBottomLeftPreview() {
  return (
    <ToastProvider position="bottom-left">
      <ToastPositionButton position="bottom-left" />
    </ToastProvider>
  )
}

function ToastBottomCenterPreview() {
  return (
    <ToastProvider position="bottom-center">
      <ToastPositionButton position="bottom-center" />
    </ToastProvider>
  )
}

function ToastPositionButton({ position }: { position: ToastPosition }) {
  const { add } = useToast()
  return (
    <Button
      variant="outline"
      onClick={() =>
        add({
          title: `Toast — ${position}`,
          description: `Appearing at ${position.replace("-", " ")}.`,
          timeout: 3000,
        })
      }
    >
      {position.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </Button>
  )
}

export const toastPreviewMap: Record<string, React.ComponentType> = {
  toast: ToastPreview,
  "toast-demo": ToastPreview,
  "toast-with-action": ToastWithActionPreview,
  "toast-promise": ToastPromisePreview,
  "toast-custom-data": ToastCustomPreview,
  "toast-variants": ToastVariantsPreview,
  "toast-from-drawer": ToastFromDrawerPreview,
  "toast-positions": ToastPositionsDemo,
  "toast-top-left": ToastTopLeftPreview,
  "toast-top-center": ToastTopCenterPreview,
  "toast-top-right": ToastTopRightPreview,
  "toast-bottom-left": ToastBottomLeftPreview,
  "toast-bottom-center": ToastBottomCenterPreview,
}
