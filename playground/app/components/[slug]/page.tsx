import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocsPage } from '../../../components/DocsPage'
import { getComponentDoc } from '../../../components/catalog'
import { PlaygroundDemo } from '../../../components/PlaygroundDemo'

export function generateStaticParams() {
  return import('../../../components/catalog').then(({ componentCatalog }) =>
    componentCatalog.map(({ slug }) => ({ slug }))
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = getComponentDoc(slug)
  return doc
    ? { title: `${doc.name} · Loomora Docs`, description: doc.description }
    : { title: 'Component not found · Loomora Docs' }
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getComponentDoc(slug)
  if (!doc) notFound()

  return (
    <DocsPage doc={doc}>
      <PlaygroundDemo demo={doc.demo} />
    </DocsPage>
  )
}
