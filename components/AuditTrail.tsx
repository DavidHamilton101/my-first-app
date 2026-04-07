import { format } from 'date-fns'
import type { AuditEntry } from '@/types'

export default function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) {
    return <p className="text-sm text-gray-400 italic">No entries yet.</p>
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex gap-3">
          {/* Timeline line */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: '#C17D3C' }} />
            {i < entries.length - 1 && (
              <div className="w-px flex-1 my-1" style={{ background: '#E8E0D5' }} />
            )}
          </div>

          {/* Content */}
          <div className="pb-4 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <span className="text-sm font-medium" style={{ color: '#1D3A2F' }}>{entry.action}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {format(new Date(entry.created_at), 'dd MMM yyyy HH:mm')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">by {entry.actor_name}</p>
            {entry.note && (
              <p
                className="text-sm text-gray-600 mt-2 rounded-md p-2.5 border-l-2"
                style={{ background: '#FAF7F2', borderColor: '#C17D3C' }}
              >
                {entry.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
