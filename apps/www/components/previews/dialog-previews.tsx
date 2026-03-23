"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  sizes,
} from "@/components/ui/dialog"
import { ScrollArea } from "../ui/scroll-area"
import { ToastProvider, useToast } from "@/components/ui/toast"

function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your project.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogBasicPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogDescription>This is a simple dialog example.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogNoCloseButtonPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open (no × button)</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No close button</DialogTitle>
          <DialogDescription>This dialog has no × in the corner.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button>Dismiss</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogScrollablePreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Scrollable</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Long content</DialogTitle>
          <DialogDescription>Scroll to see more content inside this dialog.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              Paragraph {i + 1}: Lorem ipsum dolor sit amet consectetur.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogFullscreenPreview() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Fullscreen</Button>} />
      <DialogContent variant="fullscreen" noPadding>
        <DialogHeader>
          <DialogTitle>Fullscreen dialog</DialogTitle>
          <DialogDescription>Takes up the full viewport.</DialogDescription>
        </DialogHeader>
        <DialogBody className="p-0">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-3 p-6">
              {Array.from({ length: 100 }, (_, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  Paragraph {i + 1}: Lorem ipsum dolor sit amet consectetur.
                </p>
              ))}
            </div>
          </ScrollArea>
        </DialogBody>
      </DialogContent>
    </Dialog >
  )
}

function DialogSizesPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(sizes).map((size: string) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline" size="sm">{size}</Button>} />
          <DialogContent size={size as keyof typeof sizes}>
            <DialogHeader>
              <DialogTitle>{size.toUpperCase()} dialog</DialogTitle>
              <DialogDescription>A {size} sized dialog window.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Close</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

function DialogWithToastInner() {
  const toastManager = useToast()

  function handleConfirm() {
    toastManager.add({
      title: "Project deleted",
      description: "The project has been permanently removed.",
      type: "success",
      timeout: 4000,
    })
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Delete project</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This will permanently delete the project. A toast will confirm the action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose
            render={
              <Button variant="destructive" onClick={handleConfirm}>
                Delete
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogWithToastPreview() {
  return (
    <ToastProvider>
      <DialogWithToastInner />
    </ToastProvider>
  )
}

export const dialogPreviewMap: Record<string, React.ComponentType> = {
  dialog: DialogPreview,
  "dialog-demo": DialogPreview,
  "dialog-basic": DialogBasicPreview,
  "dialog-no-close-button": DialogNoCloseButtonPreview,
  "dialog-scrollable": DialogScrollablePreview,
  "dialog-fullscreen": DialogFullscreenPreview,
  "dialog-sizes": DialogSizesPreview,
  "dialog-with-toast": DialogWithToastPreview,
}
