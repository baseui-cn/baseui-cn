"use client"

import { useCallback, useEffect, useState } from "react"
import type {
  DataGridFeatureDataSource,
} from "@/types/data-grid-data-source"
import type { DataGridQuery } from "@/components/data-grid/data-grid-filter-server"
import type { DataGridColumnPreference } from "@/types/data-grid-data-source"
import type { RowPinningState } from "@tanstack/react-table"

const allRowsQuery: DataGridQuery = {
  pagination: { pageIndex: 0, pageSize: Number.MAX_SAFE_INTEGER },
  sorting: [],
  columnFilters: [],
}

export function useDataGridFeatureData<TData extends { id: string }>({
  dataSource,
  query,
}: {
  dataSource: DataGridFeatureDataSource<TData>
  query: DataGridQuery
}) {
  const [rows, setRows] = useState<TData[]>([])
  const [total, setTotal] = useState(0)
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [],
    bottom: [],
  })
  const [columnPreferences, setColumnPreferences] = useState<DataGridColumnPreference[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)
  const [preferenceError, setPreferenceError] = useState<string | null>(null)
  const [rowError, setRowError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshVersion, setRefreshVersion] = useState(0)

  useEffect(() => {
    let cancelled = false

    const loadPreferences = async () => {
      setPreferencesLoaded(false)
      try {
        const [nextRowPinning, nextColumnPreferences] = await Promise.all([
          dataSource.getRowPinning(),
          dataSource.getColumnState(),
        ])
        if (cancelled) return
        setRowPinning(nextRowPinning)
        setColumnPreferences(nextColumnPreferences)
        setPreferenceError(null)
      } catch (loadError) {
        if (cancelled) return
        setPreferenceError(loadError instanceof Error ? loadError.message : "Unable to load grid state.")
      } finally {
        if (!cancelled) setPreferencesLoaded(true)
      }
    }

    void loadPreferences()

    return () => {
      cancelled = true
    }
  }, [dataSource, refreshVersion])

  const requestQuery = dataSource.mode === "server" ? query : allRowsQuery

  useEffect(() => {
    let cancelled = false

    const loadRows = async () => {
      try {
        setIsLoading(true)
        const page = await dataSource.getRows(requestQuery)
        if (cancelled) return
        setRows(page.rows)
        setTotal(page.total)
        setRowError(null)
      } catch (loadError) {
        if (cancelled) return
        setRowError(loadError instanceof Error ? loadError.message : "Unable to load grid data.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadRows()

    return () => {
      cancelled = true
    }
  }, [dataSource, requestQuery, refreshVersion])

  const refresh = useCallback(() => {
    setIsLoading(true)
    setRefreshVersion((version) => version + 1)
  }, [])

  const reportError = useCallback((mutationError: unknown) => {
    setError(
      mutationError instanceof Error ? mutationError.message : "Unable to save grid changes."
    )
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    rows,
    setRows,
    total,
    rowPinning,
    setRowPinning,
    columnPreferences,
    isLoading: isLoading || !preferencesLoaded,
    error: error ?? rowError ?? preferenceError,
    refresh,
    reportError,
    clearError,
    dataSource,
  }
}
