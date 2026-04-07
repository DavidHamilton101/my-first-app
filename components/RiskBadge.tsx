import { computeRiskScore, getRiskLabel, getRiskColorClass, type RiskLevel, type ImpactLevel } from '@/types'

interface Props {
  riskLevel?: RiskLevel | null
  impactLevel?: ImpactLevel | null
}

export default function RiskBadge({ riskLevel, impactLevel }: Props) {
  const score = computeRiskScore(riskLevel, impactLevel)
  if (score === 0) return <span className="text-xs text-gray-400">—</span>
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColorClass(score)}`}>
      {score}/16 · {getRiskLabel(score)}
    </span>
  )
}
