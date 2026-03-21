interface Prop {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prop</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Default</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <code className="font-mono text-xs text-foreground">
                  {prop.name}
                  {prop.required && <span className="text-destructive ml-0.5">*</span>}
                </code>
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-xs text-muted-foreground">{prop.type}</code>
              </td>
              <td className="px-4 py-3">
                {prop.default ? (
                  <code className="font-mono text-xs text-muted-foreground">{prop.default}</code>
                ) : (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
