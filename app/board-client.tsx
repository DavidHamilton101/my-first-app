'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Change, ChangeStatus } from '@/types'
import { STATUS_LABELS } from '@/types'
import ChangeCard from '@/components/ChangeCard'

type Column = {
  key: string
  label: string
  statuses: ChangeStatus[]
  accent: string
}

const COLUMNS: Column[] = [
  { key: 'draft',     label: 'Draft',            statuses: ['draft'],                     accent: '#9ca3af' },
  { key: 'submitted', label: 'Awaiting Approval', statuses: ['submitted'],                 accent: '#3b82f6' },
  { key: 'approved',  label: 'Approved',          statuses: ['approved'],                  accent: '#22c55e' },
  { key: 'impl',      label: 'Implemented',       statuses: ['implemented'],               accent: '#7c3aed' },
  { key: 'done',      label: 'Done',              statuses: ['closed', 'rejected', 'failed'], accent: '#64748b' },
]

export default function BoardClient({ initialChanges }: { initialChanges: Change[] }) {
  const [changes, setChanges] = useState(initialChanges)

  useEffect(() => {
    const supabase = createClient()
    const sub = supabase
      .channel('board-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'changes' }, async () => {
        const { data } = await supabase
          .from('changes')
          .select('*')
          .order('created_at', { ascending: false })
        if (data) setChanges(data as Change[])
      })
      .subscribe()
    return () => { sub.unsubscribe() }
  }, [])

  const byStatus = (statuses: ChangeStatus[]) =>
    changes.filter(c => statuses.includes(c.status as ChangeStatus))

  return (
    <div className="p-4 sm:p-6 max-w-screen-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif" style={{ color: '#1D3A2F' }}>Change Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {changes.length} change{changes.length !== 1 ? 's' : ''} · live
          </p>
        </div>
        <Link
          href="/changes/new"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ background: '#C17D3C' }}
        >
          + New RFC
        </Link>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {COLUMNS.map(col => {
          const items = byStatus(col.statuses)
          return (
            <div key={col.key} className="flex flex-col min-w-0">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.accent }} />
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 truncate">{col.label}</h2>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-medium flex-shrink-0">
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 flex-1">
                {items.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-400 min-h-20 flex items-center justify-center">
                    Empty
                  </div>
                ) : (
                  items.map(c => <ChangeCard key={c.id} change={c} />)
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
