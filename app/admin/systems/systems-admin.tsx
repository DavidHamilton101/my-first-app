'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { System } from '@/types'
import { createSystemAction, toggleSystemHiddenAction } from '@/app/actions/admin'

export default function SystemsAdmin({ systems }: { systems: System[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleAdd() {
    if (!name.trim()) return
    setBusy(true)
    await createSystemAction(name.trim())
    setAdding(false)
    setName('')
    setBusy(false)
    router.refresh()
  }

  async function handleToggle(id: string, hidden: boolean) {
    await toggleSystemHiddenAction(id, hidden)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">System Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Default</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Visibility</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {systems.map(s => (
              <tr key={s.id} className={`hover:bg-gray-50 ${s.hidden ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3">
                  {s.is_default && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Default</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.hidden ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                    {s.hidden ? 'Hidden' : 'Visible'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggle(s.id, !s.hidden)}
                    className="text-xs underline text-gray-400 hover:text-gray-700"
                  >
                    {s.hidden ? 'Show' : 'Hide'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adding ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: '#1D3A2F' }}>Add New System</h3>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            placeholder="System name"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!name.trim() || busy} className="px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-50" style={{ background: '#1D3A2F' }}>
              {busy ? 'Adding…' : 'Add System'}
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-600">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
        >
          + Add System
        </button>
      )}
    </div>
  )
}
