export type ChangeStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'implemented' | 'failed' | 'closed'
export type ChangeType = 'standard' | 'normal' | 'emergency'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type ImpactLevel = 'minimal' | 'minor' | 'significant' | 'major'

export interface System {
  id: string
  name: string
  hidden: boolean
  is_default: boolean
  created_at: string
}

export interface Approver {
  id: string
  name: string
  email: string
  is_active: boolean
  created_at: string
}

export interface Change {
  id: string
  title: string
  type: ChangeType
  system_id: string | null
  system_name: string | null
  description: string | null
  planned_start: string | null
  planned_end: string | null
  business_justification: string | null
  assignee_name: string | null
  assignee_email: string | null
  approver_name: string | null
  approver_email: string | null
  risk_level: RiskLevel | null
  impact_level: ImpactLevel | null
  back_out_plan: string | null
  cab_review_date: string | null
  status: ChangeStatus
  requester_name: string
  requester_email: string | null
  created_at: string
  updated_at: string
}

export interface AuditEntry {
  id: string
  change_id: string
  action: string
  actor_name: string
  note: string | null
  created_at: string
}

// ── Risk scoring ──────────────────────────────────────────────────────────────

const RISK_VALUES: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3, critical: 4 }
const IMPACT_VALUES: Record<ImpactLevel, number> = { minimal: 1, minor: 2, significant: 3, major: 4 }

export function computeRiskScore(risk?: RiskLevel | null, impact?: ImpactLevel | null): number {
  if (!risk || !impact) return 0
  return RISK_VALUES[risk] * IMPACT_VALUES[impact]
}

export function getRiskLabel(score: number): string {
  if (score >= 13) return 'Critical'
  if (score >= 9) return 'High'
  if (score >= 5) return 'Medium'
  if (score >= 1) return 'Low'
  return 'N/A'
}

export function getRiskColorClass(score: number): string {
  if (score >= 13) return 'bg-red-100 text-red-800 border-red-200'
  if (score >= 9) return 'bg-orange-100 text-orange-800 border-orange-200'
  if (score >= 5) return 'bg-amber-100 text-amber-800 border-amber-200'
  if (score >= 1) return 'bg-green-100 text-green-800 border-green-200'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}

// ── Status / type metadata ────────────────────────────────────────────────────

export const VALID_TRANSITIONS: Record<ChangeStatus, ChangeStatus[]> = {
  draft:       ['submitted'],
  submitted:   ['approved', 'rejected'],
  approved:    ['implemented', 'failed'],
  implemented: ['closed', 'failed'],
  failed:      ['draft'],
  rejected:    ['draft'],
  closed:      [],
}

export const STATUS_LABELS: Record<ChangeStatus, string> = {
  draft:       'Draft',
  submitted:   'Awaiting Approval',
  approved:    'Approved',
  rejected:    'Rejected',
  implemented: 'Implemented',
  failed:      'Failed',
  closed:      'Closed',
}

export const STATUS_COLORS: Record<ChangeStatus, string> = {
  draft:       'bg-gray-100 text-gray-700',
  submitted:   'bg-blue-100 text-blue-800',
  approved:    'bg-green-100 text-green-800',
  rejected:    'bg-red-100 text-red-700',
  implemented: 'bg-purple-100 text-purple-800',
  failed:      'bg-orange-100 text-orange-800',
  closed:      'bg-slate-100 text-slate-600',
}

export const TYPE_LABELS: Record<ChangeType, string> = {
  standard:  'Standard',
  normal:    'Normal',
  emergency: 'Emergency',
}

export const TYPE_COLORS: Record<ChangeType, string> = {
  standard:  'bg-blue-50 text-blue-700',
  normal:    'bg-emerald-50 text-emerald-700',
  emergency: 'bg-red-50 text-red-700',
}
