/** Run mutations in invocation order, continuing after a failed operation. */
export function createDataGridMutationQueue<T>(save: (value: T) => Promise<void>) {
  let tail = Promise.resolve()
  return (value: T): Promise<void> => {
    const operation = tail.then(() => save(value))
    tail = operation.catch(() => {})
    return operation
  }
}

/** Hydration/refresh establishes a baseline; only user changes enqueue saves. */
export function createDataGridPreferenceWriter<T>(save: (value: T) => Promise<void>) {
  const enqueue = createDataGridMutationQueue(save)
  let observedKey: string | undefined
  let loading = true
  return (value: T, ready: boolean): Promise<void> | null => {
    const key = JSON.stringify(value)
    if (!ready || loading) {
      observedKey = key
      loading = !ready
      return null
    }
    if (key === observedKey) return null
    observedKey = key
    return enqueue(value).catch((error: unknown) => {
      if (observedKey === key) observedKey = undefined
      throw error
    })
  }
}

/** Undo only this optimistic order, retaining current row values and new/deleted rows. */
export function rollbackDataGridRowOrder<T extends { id: string }>(
  current: T[], previousIds: readonly string[], optimisticIds: readonly string[]
): T[] {
  const previous = new Set(previousIds)
  const currentById = new Map(current.map((row) => [row.id, row]))
  const actual = current.filter((row) => previous.has(row.id)).map((row) => row.id)
  const expected = optimisticIds.filter((id) => currentById.has(id))
  if (actual.length !== expected.length || actual.some((id, index) => id !== expected[index])) return current
  const restored = previousIds.flatMap((id) => currentById.has(id) ? [currentById.get(id)!] : [])
  let index = 0
  return current.map((row) => previous.has(row.id) ? restored[index++] : row)
}
