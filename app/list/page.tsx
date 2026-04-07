import { getChanges } from '@/lib/data/changes'
import { getSystems } from '@/lib/data/systems'
import { Suspense } from 'react'
import ListClient from './list-client'

export const dynamic = 'force-dynamic'

export default async function ListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; system_id?: string; type?: string; search?: string }>
}) {
  const params = await searchParams
  const [changes, systems] = await Promise.all([
    getChanges({
      status: params.status,
      system_id: params.system_id,
      type: params.type,
      search: params.search,
    }),
    getSystems(),
  ])

  return (
    <Suspense>
      <ListClient initialChanges={changes} systems={systems} />
    </Suspense>
  )
}
