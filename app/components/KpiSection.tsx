'use client'

import { useState } from 'react'
import { updateKpi } from '@/app/actions'
import type { KpiMetric } from '@/lib/types'

export default function KpiSection({ kpis }: { kpis: KpiMetric[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ value: '', change_pct: '' })

  function startEdit(kpi: KpiMetric) {
    setForm({ value: kpi.value, change_pct: String(kpi.change_pct) })
    setEditing(kpi.id)
  }

  async function save(id: string) {
    await updateKpi(id, { value: form.value, change_pct: parseFloat(form.change_pct) })
    setEditing(null)
  }

  return (
    <section>
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Key Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-white rounded-xl border border-gray-200 p-4 relative group">
            <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>

            {editing === kpi.id ? (
              <div className="space-y-1">
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-semibold"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="Value"
                />
                <input
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  value={form.change_pct}
                  onChange={(e) => setForm({ ...form, change_pct: e.target.value })}
                  placeholder="Change %"
                  type="number"
                  step="0.1"
                />
                <div className="flex gap-1 pt-1">
                  <button onClick={() => save(kpi.id)} className="flex-1 bg-indigo-600 text-white text-xs rounded py-1 hover:bg-indigo-700">Save</button>
                  <button onClick={() => setEditing(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs rounded py-1 hover:bg-gray-200">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
                <p className={`text-xs mt-1 font-medium ${kpi.change_pct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.change_pct >= 0 ? '▲' : '▼'} {Math.abs(kpi.change_pct)}% {kpi.period_label}
                </p>
                <button
                  onClick={() => startEdit(kpi)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 text-xs transition-opacity"
                  title="Edit"
                >
                  ✏️
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
