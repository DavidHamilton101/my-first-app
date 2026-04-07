'use client'

import { useState } from 'react'
import { updateMonthlyRevenue } from '@/app/actions'
import type { MonthlyRevenue } from '@/lib/types'

export default function RevenueSection({ data }: { data: MonthlyRevenue[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState('')
  const maxValue = Math.max(...data.map((m) => m.value))

  async function save(id: string) {
    await updateMonthlyRevenue(id, parseInt(form.replace(/[^0-9]/g, ''), 10))
    setEditing(null)
  }

  return (
    <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-900 mb-4">Monthly Revenue</h2>
      <div className="flex items-end gap-3 h-40">
        {data.map((m) => {
          const height = Math.round((m.value / maxValue) * 100)
          return (
            <div key={m.id} className="flex flex-col items-center gap-1 flex-1 group">
              <span className="text-xs text-gray-500">£{(m.value / 1000000).toFixed(1)}m</span>
              <div
                className="w-full rounded-t-md bg-indigo-500 cursor-pointer hover:bg-indigo-400 transition-colors"
                style={{ height: `${height}%` }}
                onClick={() => { setForm(String(m.value)); setEditing(m.id) }}
                title="Click to edit"
              />
              <span className="text-xs text-gray-400">{m.month_label}</span>
              {editing === m.id && (
                <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-48">
                  <p className="text-xs text-gray-500 mb-1">{m.month_label} Revenue</p>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2"
                    value={form}
                    onChange={(e) => setForm(e.target.value)}
                    type="number"
                  />
                  <div className="flex gap-1">
                    <button onClick={() => save(m.id)} className="flex-1 bg-indigo-600 text-white text-xs rounded py-1">Save</button>
                    <button onClick={() => setEditing(null)} className="flex-1 bg-gray-100 text-xs rounded py-1">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-400 mt-2">Click a bar to edit</p>
    </section>
  )
}
