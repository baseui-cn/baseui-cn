import { getComponent } from "@/lib/registry"
import { notFound, redirect } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ComponentAliasPage({ params }: Props) {
  const { slug } = await params

  if (!getComponent(slug)) {
    notFound()
  }

  redirect(`/docs/components/${slug}`)
}
