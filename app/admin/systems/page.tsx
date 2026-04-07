import { getSystems } from '@/lib/data/systems'
import PinGuard from '@/components/PinGuard'
import SystemsAdmin from './systems-admin'

export const dynamic = 'force-dynamic'

export default async function SystemsPage() {
  const systems = await getSystems(true)
  return (
    <PinGuard>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-serif mb-2" style={{ color: '#1D3A2F' }}>Systems</h1>
        <p className="text-sm text-gray-500 mb-6">Manage the list of business systems available when logging a change.</p>
        <SystemsAdmin systems={systems} />
      </div>
    </PinGuard>
  )
}
