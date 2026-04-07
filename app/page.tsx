import { getChanges } from '@/lib/data/changes'
import BoardClient from './board-client'

export const dynamic = 'force-dynamic'

export default async function BoardPage() {
  const changes = await getChanges()
  return <BoardClient initialChanges={changes} />
}
