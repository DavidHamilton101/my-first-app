'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Change, System, ChangeStatus, ChangeType } from '@/types'
import { STATUS_LABELS, TYPE_LABELS, TYPE_COLORS } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import RiskBadge from '@/components/RiskBadge'

const ALL_STATUSES: ChangeStatus[] = ['draft', 'submitted', 'approved', 'rejected', 'implemented', 'failed', 'closed']
const ALL_TYPES: ChangeType[] = ['standard', 'normal', 'emergency']

const sel = 'border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-400 bg-white'

export default function ListClient({
  initialChanges,
  systems,
}: {
  initialChanges: Change[]
  systems: System[]
}) {
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const sub = supabase
      .channel('list-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'changes' }, () => {
        router.refresh()
      })
      .subscribe()
    return () => { sub.unsubscribe() }
  }, [router])

  function set(key: string, value: string) {
    const p = new URLSearchParams(sp.toString())
    value ? p.set(key, value) : p.delete(key)
    router.push(`/list?${p.toString()}`)
  }

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif" style={{ color: '#1D3A2F' }}>All Changes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{initialChanges.length} result{initialChanges.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/changes/new" className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ background: '#C17D3C' }}>
          + New RFC
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search title…"
          defaultValue={sp.get('search') ?? ''}
          onChange={e => set('search', e.target.value)}
          className={`${sel} flex-1 min-w-40`}
        />
        <select className={sel} value={sp.get('status') ?? ''} onChange={e => set('status', e.target.value)}>
          <option value="">All statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select className={sel} value={sp.get('type') ?? ''} onChange={e => set('type', e.target.value)}>
          <option value="">All types</option>
          {ALL_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
        <select className={sel} value={sp.get('system_id') ?? ''} onChange={e => set('system_id', e.target.value)}>
          <option value="">All systems</option>
          {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {['Ref', 'Title', 'Type', 'System', 'Status', 'Risk', 'Assignee', 'Created'].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialChanges.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">No changes found</td></tr>
            )}
            {initialChanges.map(c => (
              <tr
                key={c.id}
                onClick={() => router.push(`/changes/${c.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-400">#{c.id.split('-')[0].toUpperCase()}</td>
                <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{c.title}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[c.type]}`}>{TYPE_LABELS[c.type]}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{c.system_name ?? '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3"><RiskBadge riskLevel={c.risk_level} impactLevel={c.impact_level} /></td>
                <td className="px-4 py-3 text-xs text-gray-500">{c.assignee_name ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{format(new Date(c.created_at), 'dd MMM yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
