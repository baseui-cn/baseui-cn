import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: slug }
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params
  return (
    <div className="flex min-h-screen flex-col p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-4 capitalize">{slug}</h1>
      <p className="text-muted-foreground">Component documentation coming soon.</p>
    </div>
  )
}
