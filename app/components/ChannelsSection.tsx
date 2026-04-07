'use client'

import { useState } from 'react'
import { createChannel, updateChannel, deleteChannel } from '@/app/actions'
import type { SalesChannel } from '@/lib/types'

const empty = { name: '', orders: '', revenue: '', share_pct: '' }

export default function ChannelsSection({ channels }: { channels: SalesChannel[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(empty)

  function startEdit(c: SalesChannel) {
    setForm({ name: c.name, orders: String(c.orders), revenue: c.revenue, share_pct: String(c.share_pct) })
    setEditing(c.id)
  }

  async function save(id: string) {
    await updateChannel(id, { name: form.name, orders: parseInt(form.orders), revenue: form.revenue, share_pct: parseInt(form.share_pct) })
    setEditing(null)
  }

  async function add() {
    await createChannel({ name: form.name, orders: parseInt(form.orders), revenue: form.revenue, share_pct: parseInt(form.share_pct), sort_order: channels.length + 1 })
    setAdding(false)
    setForm(empty)
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900">Sales by Channel</h2>
        <button onClick={() => { setAdding(true); setForm(empty) }} className="text-xs text-indigo-600 hover:text-indigo-800">+ Add</button>
      </div>

      <div className="space-y-3">
        {channels.map((c) => (
          <div key={c.id} className="group">
            {editing === c.id ? (
              <div className="border border-indigo-200 rounded-lg p-2 space-y-1">
                <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Channel name" />
                <div className="flex gap-1">
                  <input className="w-1/2 border border-gray-200 rounded px-2 py-1 text-xs" value={form.orders} onChange={(e) => setForm({ ...form, orders: e.target.value })} placeholder="Orders" type="number" />
                  <input className="w-1/2 border border-gray-200 rounded px-2 py-1 text-xs" value={form.share_pct} onChange={(e) => setForm({ ...form, share_pct: e.target.value })} placeholder="Share %" type="number" />
                </div>
                <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} placeholder="Revenue e.g. £100,000" />
                <div className="flex gap-1">
                  <button onClick={() => save(c.id)} className="flex-1 bg-indigo-600 text-white text-xs rounded py-1">Save</button>
                  <button onClick={() => setEditing(null)} className="flex-1 bg-gray-100 text-xs rounded py-1">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                  <span>{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.share_pct}%</span>
                    <button onClick={() => startEdit(c)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">✏️</button>
                    <button onClick={() => deleteChannel(c.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity">✕</button>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${c.share_pct}%` }} />
                </div>
              </>
            )}
          </div>
        ))}

        {adding && (
          <div className="border border-indigo-200 rounded-lg p-2 space-y-1">
            <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Channel name" />
            <div className="flex gap-1">
              <input className="w-1/2 border border-gray-200 rounded px-2 py-1 text-xs" value={form.orders} onChange={(e) => setForm({ ...form, orders: e.target.value })} placeholder="Orders" type="number" />
              <input className="w-1/2 border border-gray-200 rounded px-2 py-1 text-xs" value={form.share_pct} onChange={(e) => setForm({ ...form, share_pct: e.target.value })} placeholder="Share %" type="number" />
            </div>
            <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} placeholder="Revenue e.g. £100,000" />
            <div className="flex gap-1">
              <button onClick={add} className="flex-1 bg-indigo-600 text-white text-xs rounded py-1">Add</button>
              <button onClick={() => setAdding(false)} className="flex-1 bg-gray-100 text-xs rounded py-1">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
