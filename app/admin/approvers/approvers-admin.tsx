'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Approver } from '@/types'
import { createApproverAction, updateApproverAction } from '@/app/actions/admin'

export default function ApproversAdmin({ approvers }: { approvers: Approver[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [busy, setBusy] = useState(false)

  const input = 'border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 w-full'

  async function handleAdd() {
    if (!form.name || !form.email) return
    setBusy(true)
    await createApproverAction(form.name, form.email)
    setAdding(false)
    setForm({ name: '', email: '' })
    setBusy(false)
    router.refresh()
  }

  async function handleToggle(id: string, is_active: boolean) {
    await updateApproverAction(id, { is_active })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {approvers.map(a => (
              <tr key={a.id} className={`${a.is_active ? '' : 'opacity-50'} hover:bg-gray-50`}>
                <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                <td className="px-4 py-3 text-gray-500 text-sm">{a.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleToggle(a.id, !a.is_active)} className="text-xs underline text-gray-400 hover:text-gray-700">
                    {a.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adding ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: '#1D3A2F' }}>Add New Approver</h3>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={input} placeholder="Full name" />
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className={input} placeholder="Email address" />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.name || !form.email || busy} className="px-4 py-2 rounded-lg text-sm text-white font-medium disabled:opacity-50" style={{ background: '#1D3A2F' }}>
              {busy ? 'Adding…' : 'Add Approver'}
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-600">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
        >
          + Add Approver
        </button>
      )}
    </div>
  )
}
