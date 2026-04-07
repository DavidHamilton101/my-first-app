import { STATUS_LABELS, STATUS_COLORS, type ChangeStatus } from '@/types'

export default function StatusBadge({ status }: { status: ChangeStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
