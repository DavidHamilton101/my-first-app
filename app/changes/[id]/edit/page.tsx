import { getChangeById } from '@/lib/data/changes'
import { getSystems } from '@/lib/data/systems'
import { getApprovers } from '@/lib/data/approvers'
import { redirect, notFound } from 'next/navigation'
import ChangeForm from '@/components/ChangeForm'
import { updateChangeAction } from '@/app/actions/changes'

export default async function EditChangePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let change, systems, approvers
  try {
    ;[{ change }, systems, approvers] = await Promise.all([
      getChangeById(id),
      getSystems(),
      getApprovers(true),
    ])
  } catch {
    notFound()
  }

  if (!['draft', 'rejected', 'failed'].includes(change.status)) {
    redirect(`/changes/${id}`)
  }

  const action = updateChangeAction.bind(null, id)

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-serif mb-1" style={{ color: '#1D3A2F' }}>Edit RFC</h1>
      <p className="text-sm text-gray-500 mb-6">#{id.split('-')[0].toUpperCase()} · {change.title}</p>
      <ChangeForm systems={systems} approvers={approvers} defaultValues={change} action={action} submitLabel="Save Changes" />
    </div>
  )
}
