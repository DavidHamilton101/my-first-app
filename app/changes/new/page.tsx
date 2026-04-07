import { getSystems } from '@/lib/data/systems'
import { getApprovers } from '@/lib/data/approvers'
import ChangeForm from '@/components/ChangeForm'
import { createChangeAction } from '@/app/actions/changes'

export default async function NewChangePage() {
  const [systems, approvers] = await Promise.all([getSystems(), getApprovers(true)])
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-serif mb-6" style={{ color: '#1D3A2F' }}>New Request for Change</h1>
      <ChangeForm systems={systems} approvers={approvers} action={createChangeAction} submitLabel="Save as Draft" />
    </div>
  )
}
