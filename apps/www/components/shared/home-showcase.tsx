"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  LayersIcon,
  SearchIcon,
  PlusIcon,
  CheckIcon,
  RotateCcwIcon,
  CircleIcon,
  ArrowRightIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { DatePickerInput } from "@/components/ui/date-picker"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/toast"

type WorkItem = {
  id: string
  title: string
  owner: "Avery" | "Morgan" | "Sam"
  category: string
  complete: boolean
  description: string
}
const initialWork: WorkItem[] = [
  {
    id: "UI-101",
    title: "Build the command palette",
    owner: "Avery",
    category: "Interaction",
    complete: true,
    description:
      "Give every action a clear keyboard path, useful search and predictable focus return.",
  },
  {
    id: "UI-102",
    title: "Refine the onboarding flow",
    owner: "Morgan",
    category: "Product",
    complete: false,
    description:
      "Keep the first step focused. Reveal configuration when the user is ready to create.",
  },
  {
    id: "UI-103",
    title: "Connect the design tokens",
    owner: "Sam",
    category: "Design system",
    complete: true,
    description:
      "Use ordinary CSS variables for color, focus and radius. Keep semantic status colors independent.",
  },
  {
    id: "UI-104",
    title: "Review mobile navigation",
    owner: "Avery",
    category: "Accessibility",
    complete: false,
    description: "Check keyboard focus, scrolling and touch targets at compact widths.",
  },
  {
    id: "UI-105",
    title: "Polish the data workspace",
    owner: "Morgan",
    category: "Interface",
    complete: false,
    description: "Make filters, empty states and row actions feel like one coherent interface.",
  },
  {
    id: "UI-106",
    title: "Write the handoff notes",
    owner: "Sam",
    category: "Documentation",
    complete: false,
    description:
      "Document the starting point so the next person can confidently make it their own.",
  },
]
export function HomeShowcase() {
  const [items, setItems] = React.useState(initialWork)
  const [query, setQuery] = React.useState("")
  const [owner, setOwner] = React.useState("all")
  const [view, setView] = React.useState("all")
  const [openOnly, setOpenOnly] = React.useState(false)
  const [target, setTarget] = React.useState<Date | undefined>(new Date(2026, 10, 6))
  const [newTitle, setNewTitle] = React.useState("")
  const [newOpen, setNewOpen] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const active = items.find((item) => item.id === activeId)
  const toast = useToast()
  const completed = items.filter((item) => item.complete).length
  const remaining = items.length - completed
  const visible = items.filter(
    (item) =>
      (owner === "all" || item.owner === owner) &&
      (!openOnly || !item.complete) &&
      (view !== "done" || item.complete) &&
      `${item.id} ${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  )
  const changeComplete = (id: string, complete: boolean) => {
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, complete } : item)))
    toast.add({
      title: complete ? "Task marked complete" : "Task reopened",
      description: "The release plan has been updated in this example.",
      type: "success",
    })
  }
  const reset = () => {
    setItems(initialWork)
    setQuery("")
    setOwner("all")
    setView("all")
    setOpenOnly(false)
    setTarget(new Date(2026, 10, 6))
    toast.add({
      title: "Example reset",
      description: "The original release plan is restored.",
      type: "info",
    })
  }
  return (
    <div
      className="release-workspace"
      role="group"
      aria-label="Interactive release workspace example"
    >
      <div className="release-window-bar">
        <span>
          <LayersIcon size={17} aria-hidden="true" /> Studio{" "}
          <span className="release-breadcrumb">/ Interface system</span>
        </span>
        <span className="release-example-tag">INTERACTIVE EXAMPLE</span>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcwIcon size={13} aria-hidden="true" /> Reset example
        </Button>
      </div>
      <div className="release-layout">
        <aside className="release-sidebar">
          <span className="release-side-label">WORKSPACE</span>
          <div className="release-current">
            <LayersIcon size={15} aria-hidden="true" /> Release plan{" "}
            <Badge variant="outline" size="sm">
              {items.length}
            </Badge>
          </div>
          <p>
            One shared foundation.
            <br />
            Room for your next idea.
          </p>
          <div className="release-progress">
            <span className="release-side-label">RELEASE READINESS</span>
            <strong>
              {Math.round((completed / items.length) * 100)}
              <span>%</span>
            </strong>
            <Progress value={(completed / items.length) * 100} aria-label="Release readiness" />
            <span>
              {completed} of {items.length} tasks complete
            </span>
          </div>
          <div className="release-people">
            <span className="release-side-label">THE TEAM</span>
            {["Avery", "Morgan", "Sam"].map((name, index) => (
              <span key={name}>
                <Avatar size="xs" className="release-avatar" aria-hidden="true">
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                {name}
                <span>{["Design", "Engineering", "Systems"][index]}</span>
              </span>
            ))}
          </div>
          <Link href="/docs/components/button">
            Built with baseui-cn <ArrowUpRightIcon size={13} aria-hidden="true" />
          </Link>
        </aside>
        <div className="release-main">
          <div className="release-heading">
            <div>
              <span className="release-side-label">YOUR NEXT RELEASE</span>
              <h3>Good work, coming together.</h3>
              <p>A clear plan. A few thoughtful components.</p>
            </div>
            <Dialog open={newOpen} onOpenChange={setNewOpen}>
              <DialogTrigger render={<Button />}>
                <PlusIcon size={15} aria-hidden="true" /> New task
              </DialogTrigger>
              <DialogContent noPadding={false}>
                <DialogHeader>
                  <DialogTitle>Add a task</DialogTitle>
                  <DialogDescription>
                    Try the workflow. Changes stay in this example.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (!newTitle.trim()) return
                    setItems((previous) => [
                      ...previous,
                      {
                        id: `UI-${101 + previous.length}`,
                        title: newTitle.trim(),
                        owner: "Avery",
                        category: "Product",
                        complete: false,
                        description: "A new task added to this local example.",
                      },
                    ])
                    setNewTitle("")
                    setNewOpen(false)
                    toast.add({
                      title: "Task added",
                      description: "Your release plan has a new task.",
                      type: "success",
                    })
                  }}
                >
                  <DialogBody>
                    <label className="release-form-label" htmlFor="release-new-task">
                      Task name
                    </label>
                    <Input
                      id="release-new-task"
                      value={newTitle}
                      onChange={(event) => setNewTitle(event.target.value)}
                      placeholder="What should we build next?"
                      required
                      autoComplete="off"
                    />
                  </DialogBody>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline" type="button" />}>
                      Cancel
                    </DialogClose>
                    <Button type="submit" disabled={!newTitle.trim()}>
                      Add task
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="release-summary">
            <div>
              <span>In scope</span>
              <strong>
                {items.length}
                <small>tasks</small>
              </strong>
            </div>
            <div>
              <span>Ready to ship</span>
              <strong>
                {completed}
                <small>complete</small>
              </strong>
            </div>
            <div>
              <span>Moving forward</span>
              <strong>
                {remaining}
                <small>in progress</small>
              </strong>
            </div>
            <DatePickerInput
              label="Target date"
              value={target}
              onValueChange={setTarget}
              displayFormat="MMM d, yyyy"
            />
          </div>
          <Tabs
            value={view}
            onValueChange={(value) => {
              setView(String(value))
              if (value === "done") setOpenOnly(false)
            }}
          >
            <div className="release-tabs-bar">
              <TabsList variant="underline" aria-label="Release task view">
                <TabsTab value="all">
                  All work <span>{items.length}</span>
                </TabsTab>
                <TabsTab value="done">
                  Completed <span>{completed}</span>
                </TabsTab>
              </TabsList>
              <label className="release-open-filter">
                <Switch
                  checked={openOnly}
                  onCheckedChange={(checked) => {
                    setOpenOnly(checked)
                    if (checked) setView("all")
                  }}
                />{" "}
                Open tasks only
              </label>
            </div>
            <TabsPanel value={view}>
              <div className="release-filters">
                <div className="release-search">
                  <SearchIcon size={15} aria-hidden="true" />
                  <Input
                    type="search"
                    aria-label="Search release tasks"
                    placeholder="Search tasks…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <Select
                  value={owner}
                  items={{ all: "Everyone", Avery: "Avery", Morgan: "Morgan", Sam: "Sam" }}
                  onValueChange={(value) => setOwner(value ?? "all")}
                >
                  <SelectTrigger aria-label="Filter by owner">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    {["Avery", "Morgan", "Sam"].map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <caption className="sr-only">Interactive release plan</caption>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="sr-only">Complete</span>
                    </TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Details</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <label className="release-check">
                          <span className="sr-only">Complete {item.title}</span>
                          <Checkbox
                            checked={item.complete}
                            onCheckedChange={(checked) => changeComplete(item.id, checked)}
                          />
                        </label>
                      </TableCell>
                      <TableCell>
                        <span className="release-task-id">{item.id}</span>
                        <button
                          type="button"
                          className="release-task-title"
                          onClick={() => setActiveId(item.id)}
                        >
                          {item.title}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="release-owner">
                          <Avatar size="xs" className="release-avatar" aria-hidden="true">
                            <AvatarFallback>{item.owner[0]}</AvatarFallback>
                          </Avatar>
                          {item.owner}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.complete ? "success-outline" : "outline"}>
                          {item.complete ? (
                            <CheckIcon size={11} aria-hidden="true" />
                          ) : (
                            <CircleIcon size={10} aria-hidden="true" />
                          )}
                          {item.complete ? "Done" : "In progress"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`View ${item.title}`}
                          onClick={() => setActiveId(item.id)}
                        >
                          <ArrowUpRightIcon size={15} aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!visible.length && (
                <div className="release-empty">
                  <p>No tasks match this view.</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setQuery("")
                      setOwner("all")
                      setOpenOnly(false)
                      setView("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
              <div className="release-table-footer">
                <span>
                  {visible.length} of {items.length} tasks
                </span>
                <span>
                  Pick a task to explore the details <ArrowRightIcon size={12} aria-hidden="true" />
                </span>
              </div>
            </TabsPanel>
          </Tabs>
        </div>
      </div>
      <div className="release-workspace-footer">
        <span>Real Input · Select · Tabs · Table · Date Picker · Dialog · Toast</span>
        <span>Local demo. Your changes stay in this page.</span>
      </div>
      <Dialog
        open={!!active}
        onOpenChange={(open) => {
          if (!open) setActiveId(null)
        }}
      >
        <DialogContent noPadding={false}>
          <DialogHeader>
            <DialogTitle>{active?.title ?? "Task details"}</DialogTitle>
            <DialogDescription>
              {active?.id} · {active?.category} · {active?.owner}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p className="release-task-description">{active?.description}</p>
            {active && (
              <label className="release-detail-check">
                <Checkbox
                  checked={active.complete}
                  onCheckedChange={(checked) => changeComplete(active.id, checked)}
                />{" "}
                Mark as complete
              </label>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button />}>Back to the plan</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
