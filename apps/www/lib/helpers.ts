export const throttle = (
  func: (...args: unknown[]) => void,
  limit: number
): ((...args: unknown[]) => void) => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null
  let lastRan: number | null = null

  return function (this: unknown, ...args: unknown[]) {
    if (lastRan === null) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      if (lastFunc !== null) {
        clearTimeout(lastFunc)
      }
      lastFunc = setTimeout(
        () => {
          if (Date.now() - (lastRan as number) >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - (lastRan as number))
      )
    }
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function toAbsoluteUrl(pathname: string): string {
  //get current base path from the window object
  const basePath = window.location.origin
  console.log("basePath", basePath)

  if (basePath && basePath !== "/") {
    return basePath + pathname
  } else {
    return pathname
  }
}
