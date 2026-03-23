"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function TablePreview() {
  const rows = [
    { name: "Aria Chen", email: "aria@example.com", role: "Admin", status: "Active" },
    { name: "Marcus Osei", email: "marcus@example.com", role: "Editor", status: "Active" },
    { name: "Priya Nair", email: "priya@example.com", role: "Viewer", status: "Inactive" },
  ]
  return (
    <div className="w-full overflow-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.email}>
              <TableCell>
                <div className="font-medium">{row.name}</div>
                <div className="text-xs text-muted-foreground">{row.email}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.role}</TableCell>
              <TableCell>
                <Badge variant={row.status === "Active" ? "success" : "secondary"} shape="pill">
                  {row.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const tablePreviewMap: Record<string, React.ComponentType> = {
  table: TablePreview,
  "table-demo": TablePreview,
}
