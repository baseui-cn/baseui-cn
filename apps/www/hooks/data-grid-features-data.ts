import type { RowPinningState } from "@tanstack/react-table"
import type {
  DataGridColumnPreference,
  DataGridFeatureDataSource,
  DataGridRowMove,
} from "@/types/data-grid-data-source"

export type StaffStatus = "Active" | "On leave" | "Probation"

export interface StaffMember {
  id: string
  name: string
  team: string
  title: string
  salary: number
  startDate: string
  status: StaffStatus
}

const staffRows: StaffMember[] = [
  {
    id: "staff-1001",
    name: "Avery Miles",
    team: "Design",
    title: "Product Designer",
    salary: 92000,
    startDate: "2022-04-18",
    status: "Active",
  },
  {
    id: "staff-1002",
    name: "Jordan Lee",
    team: "Engineering",
    title: "Frontend Engineer",
    salary: 108000,
    startDate: "2021-09-06",
    status: "Active",
  },
  {
    id: "staff-1003",
    name: "Naomi Cruz",
    team: "Engineering",
    title: "Engineering Manager",
    salary: 132000,
    startDate: "2019-02-11",
    status: "Active",
  },
  {
    id: "staff-1004",
    name: "Ethan Brooks",
    team: "Product",
    title: "Product Manager",
    salary: 105000,
    startDate: "2023-06-12",
    status: "On leave",
  },
  {
    id: "staff-1005",
    name: "Camila Stone",
    team: "Design",
    title: "Content Designer",
    salary: 88000,
    startDate: "2020-11-02",
    status: "Active",
  },
  {
    id: "staff-1006",
    name: "Micah Patel",
    team: "Engineering",
    title: "Software Engineer",
    salary: 101000,
    startDate: "2022-01-24",
    status: "Probation",
  },
  {
    id: "staff-1007",
    name: "Riley Chen",
    team: "Operations",
    title: "Operations Lead",
    salary: 97000,
    startDate: "2020-07-20",
    status: "Active",
  },
  {
    id: "staff-1008",
    name: "Morgan James",
    team: "Product",
    title: "Product Analyst",
    salary: 84000,
    startDate: "2024-03-04",
    status: "Probation",
  },
  {
    id: "staff-1009",
    name: "Morgan James2",
    team: "Product",
    title: "Product Analyst",
    salary: 85000,
    startDate: "2024-03-04",
    status: "Probation",
  },
  {
    id: "staff-10010",
    name: "Riley Chen2",
    team: "Operations",
    title: "Operations Lead",
    salary: 98000,
    startDate: "2020-07-20",
    status: "Active",
  },
]

export function createMockStaffDataSource(): DataGridFeatureDataSource<StaffMember> {
  let rows = staffRows.map((row) => ({ ...row }))
  let rowPinning: RowPinningState = { top: [], bottom: [] }
  let columnState: DataGridColumnPreference[] = []

  return {
    mode: "client",
    async getRows() {
      return {
        rows: rows.map((row) => ({ ...row })),
        total: rows.length,
      }
    },
    async getRowPinning() {
      return {
        top: [...(rowPinning.top ?? [])],
        bottom: [...(rowPinning.bottom ?? [])],
      }
    },
    async getColumnState() {
      return columnState.map((column) => ({ ...column }))
    },
    async updateRow(rowId, nextRow) {
      if (!rows.some((row) => row.id === rowId)) {
        throw new Error(`Cannot update missing staff row "${rowId}".`)
      }
      rows = rows.map((row) => (row.id === rowId ? { ...nextRow } : row))
    },
    async reorderRows(move: DataGridRowMove) {
      const fromIndex = rows.findIndex((row) => row.id === move.rowId)
      if (fromIndex < 0) {
        throw new Error(`Cannot reorder missing staff row "${move.rowId}".`)
      }

      const nextRows = [...rows]
      const [movedRow] = nextRows.splice(fromIndex, 1)
      const nextIndex = move.nextRowId ? nextRows.findIndex((row) => row.id === move.nextRowId) : -1
      const previousIndex = move.previousRowId
        ? nextRows.findIndex((row) => row.id === move.previousRowId)
        : -1

      if (move.nextRowId && nextIndex < 0) {
        throw new Error(`Cannot find next staff row "${move.nextRowId}".`)
      }
      if (move.previousRowId && previousIndex < 0) {
        throw new Error(`Cannot find previous staff row "${move.previousRowId}".`)
      }

      const insertionIndex = nextIndex >= 0 ? nextIndex : previousIndex >= 0 ? previousIndex + 1 : 0
      nextRows.splice(insertionIndex, 0, movedRow)
      rows = nextRows
    },
    async saveRowPinning(state) {
      rowPinning = {
        top: [...(state.top ?? [])],
        bottom: [...(state.bottom ?? [])],
      }
    },
    async saveColumnState(state) {
      columnState = state.map((column) => ({ ...column }))
    },
  }
}
