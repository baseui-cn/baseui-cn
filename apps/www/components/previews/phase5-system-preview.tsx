"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as Dialog from "@/components/ui/dialog"
import * as Alert from "@/components/ui/alert-dialog"
import * as Drawer from "@/components/ui/drawer"
import * as Command from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const teams = ["Design", "Engineering", "Operations"]

function ProjectFields({ prefix }: { prefix: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Field>
        <FieldLabel htmlFor={`${prefix}-name`}>Project name</FieldLabel>
        <Input id={`${prefix}-name`} defaultValue="Graphite" />
      </Field>
      <Field>
        <FieldLabel id={`${prefix}-visibility-label`}>Visibility</FieldLabel>
        <Select defaultValue="private">
          <SelectTrigger
            id={`${prefix}-select`}
            aria-labelledby={`${prefix}-visibility-label`}
            className="w-full"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="public" disabled>
              Public (unavailable)
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}-team`}>Team</FieldLabel>
        <Combobox items={teams}>
          <ComboboxInput
            id={`${prefix}-team`}
            className="w-full"
            autoFocus={false}
            showClear
            placeholder="Find a team"
          />
          <ComboboxContent>
            <ComboboxList>
              {(team: string) => (
                <ComboboxItem key={team} value={team}>
                  {team}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger id={`${prefix}-help`} render={<Button variant="ghost" />}>
            About visibility
          </TooltipTrigger>
          <TooltipContent>Only invited people can open a private project.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function Phase5SystemPreview() {
  const [action, setAction] = React.useState("No changes saved")
  const [alertOpen, setAlertOpen] = React.useState(false)
  return (
    <div id="phase5-system" className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Dialog.Dialog>
          <Dialog.DialogTrigger id="p5-dialog" render={<Button variant="outline" />}>
            Edit project
          </Dialog.DialogTrigger>
          <Dialog.DialogContent id="p5-dialog-content">
            <Dialog.DialogHeader>
              <Dialog.DialogTitle>Edit project</Dialog.DialogTitle>
              <Dialog.DialogDescription>
                Update project details and choose who can access it.
              </Dialog.DialogDescription>
            </Dialog.DialogHeader>
            <Dialog.DialogBody>
              <ProjectFields prefix="p5-dialog" />
            </Dialog.DialogBody>
            <Dialog.DialogFooter>
              <Dialog.DialogClose render={<Button variant="outline" />}>Cancel</Dialog.DialogClose>
              <Dialog.DialogClose render={<Button />} onClick={() => setAction("Project saved")}>
                Save project
              </Dialog.DialogClose>
            </Dialog.DialogFooter>
          </Dialog.DialogContent>
        </Dialog.Dialog>
        <Alert.AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <Alert.AlertDialogTrigger id="p5-alert" render={<Button variant="destructive-outline" />}>
            Delete project
          </Alert.AlertDialogTrigger>
          <Alert.AlertDialogContent id="p5-alert-content">
            <Alert.AlertDialogHeader>
              <Alert.AlertDialogTitle>Delete Graphite?</Alert.AlertDialogTitle>
              <Alert.AlertDialogDescription>
                This permanently deletes the project and its saved work. Your team will lose access.
              </Alert.AlertDialogDescription>
            </Alert.AlertDialogHeader>
            <Alert.AlertDialogFooter>
              <Alert.AlertDialogCancel>Keep project</Alert.AlertDialogCancel>
              <Alert.AlertDialogAction
                variant="destructive"
                onClick={() => {
                  setAction("Project deleted")
                  setAlertOpen(false)
                }}
              >
                Delete project
              </Alert.AlertDialogAction>
            </Alert.AlertDialogFooter>
          </Alert.AlertDialogContent>
        </Alert.AlertDialog>
        <Drawer.Drawer swipeDirection="right">
          <Drawer.DrawerTrigger id="p5-drawer" render={<Button variant="outline" />}>
            Project settings
          </Drawer.DrawerTrigger>
          <Drawer.DrawerContent id="p5-drawer-content" side="right">
            <Drawer.DrawerHeader>
              <Drawer.DrawerTitle>Project settings</Drawer.DrawerTitle>
              <Drawer.DrawerDescription>
                Manage access and your project&apos;s team.
              </Drawer.DrawerDescription>
            </Drawer.DrawerHeader>
            <div className="px-6">
              <ProjectFields prefix="p5-drawer" />
            </div>
            <Drawer.DrawerFooter>
              <Drawer.DrawerClose render={<Button />} onClick={() => setAction("Settings saved")}>
                Save settings
              </Drawer.DrawerClose>
              <Drawer.DrawerClose render={<Button variant="outline" />}>Cancel</Drawer.DrawerClose>
            </Drawer.DrawerFooter>
          </Drawer.DrawerContent>
        </Drawer.Drawer>
        <Command.CommandDialog>
          <Command.CommandDialogTrigger id="p5-command" render={<Button variant="outline" />}>
            Project commands
          </Command.CommandDialogTrigger>
          <Command.CommandDialogPopup id="p5-command-content" aria-label="Project commands">
            <Command.Command items={["Open project", "Export report", "Archive project"]}>
              <Command.CommandInput
                id="p5-command-search"
                aria-label="Search commands"
                placeholder="Search commands…"
              />
              <Command.CommandPanel>
                <Command.CommandEmpty>No commands found.</Command.CommandEmpty>
                <Command.CommandList>
                  {(command: string) => (
                    <Command.CommandItem
                      key={command}
                      value={command}
                      onClick={() => setAction(command)}
                    >
                      {command}
                    </Command.CommandItem>
                  )}
                </Command.CommandList>
              </Command.CommandPanel>
              <Command.CommandFooter>
                <span>↑ ↓ Navigate</span>
                <span>Esc Close</span>
              </Command.CommandFooter>
            </Command.Command>
          </Command.CommandDialogPopup>
        </Command.CommandDialog>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {action}
      </p>
    </div>
  )
}
