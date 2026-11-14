import { useEffect } from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { ToastProvider } from "@/components/ui/toast"
import { Pattern } from "@/components/previews/data-grid/c-data-grid-1"
import { PatternEdit1 } from "@/components/previews/data-grid/c-data-grid-2"
import { PatternEdit2 } from "@/components/previews/data-grid/c-data-grid-3"
import { DataGridFeaturesPreview } from "@/components/previews/data-grid/c-data-grid-features"

export function DataGridDemoFixture({ mode }: { mode: string }) {
  const params = new URLSearchParams(window.location.search)
  const rtl = params.get("rtl") === "1"
  const dark = params.get("dark") === "1"
  useEffect(() => {
    document.documentElement.dir = rtl ? "rtl" : "ltr"
    document.documentElement.classList.toggle("dark", dark)
  }, [rtl, dark])
  return (
    <DirectionProvider direction={rtl ? "rtl" : "ltr"}>
      <ToastProvider>
        <main className="bg-background text-foreground min-w-0 p-3">
          <h1 className="mb-3 text-xl font-semibold">Actual Data Grid demo: {mode}</h1>
          {mode === "demo-basic" ? <Pattern /> : mode === "demo-editing" ? <PatternEdit1 /> :
            mode === "demo-async" ? <PatternEdit2 /> : <DataGridFeaturesPreview />}
        </main>
      </ToastProvider>
    </DirectionProvider>
  )
}
