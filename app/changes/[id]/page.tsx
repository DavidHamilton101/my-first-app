import { getChangeById } from '@/lib/data/changes'
import { getApprovers } from '@/lib/data/approvers'
import { notFound } from 'next/navigation'
import ChangeDetail from './change-detail'

export const dynamic = 'force-dynamic'

export default async function ChangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  try {
    const [{ change, audit }, approvers] = await Promise.all([
      getChangeById(id),
      getApprovers(true),
    ])
    return <ChangeDetail change={change} audit={audit} approvers={approvers} />
  } catch {
    notFound()
  }
}
