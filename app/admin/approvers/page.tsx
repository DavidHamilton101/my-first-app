import { getApprovers } from '@/lib/data/approvers'
import PinGuard from '@/components/PinGuard'
import ApproversAdmin from './approvers-admin'

export const dynamic = 'force-dynamic'

export default async function ApproversPage() {
  const approvers = await getApprovers()
  return (
    <PinGuard>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-serif mb-2" style={{ color: '#1D3A2F' }}>Approvers</h1>
        <p className="text-sm text-gray-500 mb-6">Manage the list of people who can approve change requests.</p>
        <ApproversAdmin approvers={approvers} />
      </div>
    </PinGuard>
  )
}
