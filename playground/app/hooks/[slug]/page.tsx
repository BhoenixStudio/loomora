import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HookDemoDispatcher } from '../../../components/demos/hook-demos'
import { HookDocsPage } from '../../../components/HookDocsPage'
import { getHookDoc, hookCatalog } from '../../../components/hooks-catalog'

export function generateStaticParams() {
  return hookCatalog.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = getHookDoc(slug)
  return doc
    ? { title: `${doc.name} · Loomora Hook Docs`, description: doc.description }
    : { title: 'Hook not found · Loomora Docs' }
}

export default async function HookSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getHookDoc(slug)
  if (!doc) notFound()

  return (
    <HookDocsPage doc={doc}>
      <HookDemoDispatcher slug={doc.slug} />
    </HookDocsPage>
  )
}
