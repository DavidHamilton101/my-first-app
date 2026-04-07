'use client'

import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import type { Change } from '@/types'
import { TYPE_LABELS, TYPE_COLORS } from '@/types'
import RiskBadge from './RiskBadge'

export default function ChangeCard({ change }: { change: Change }) {
  const router = useRouter()
  const ref = change.id.split('-')[0].toUpperCase()

  return (
    <div
      onClick={() => router.push(`/changes/${change.id}`)}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all select-none"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-gray-400">#{ref}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[change.type]}`}>
          {TYPE_LABELS[change.type]}
        </span>
      </div>

      <h3 className="text-sm font-medium leading-snug mb-2 line-clamp-2" style={{ color: '#1D3A2F', fontFamily: 'Georgia, serif' }}>
        {change.title}
      </h3>

      <div className="space-y-1">
        {change.system_name && (
          <p className="text-xs text-gray-500 truncate">{change.system_name}</p>
        )}
        <RiskBadge riskLevel={change.risk_level} impactLevel={change.impact_level} />
        {change.assignee_name && (
          <p className="text-xs text-gray-400 truncate">↳ {change.assignee_name}</p>
        )}
        {change.planned_start && (
          <p className="text-xs text-gray-400">{format(new Date(change.planned_start), 'dd MMM yyyy')}</p>
        )}
      </div>
    </div>
  )
}
