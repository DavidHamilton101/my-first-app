'use client'

import { useState, useTransition } from 'react'
import { computeRiskScore, getRiskLabel, getRiskColorClass } from '@/types'
import type { System, Approver, Change, RiskLevel, ImpactLevel } from '@/types'

interface Props {
  systems: System[]
  approvers: Approver[]
  defaultValues?: Partial<Change>
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
}

export default function ChangeForm({
  systems,
  approvers,
  defaultValues,
  action,
  submitLabel = 'Save as Draft',
}: Props) {
  const [risk, setRisk] = useState<string>(defaultValues?.risk_level ?? '')
  const [impact, setImpact] = useState<string>(defaultValues?.impact_level ?? '')
  const [approverEmail, setApproverEmail] = useState(defaultValues?.approver_email ?? '')
  const [pending, startTransition] = useTransition()

  const score = computeRiskScore(risk as RiskLevel, impact as ImpactLevel)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => { await action(formData) })
  }

  const f = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-white transition-colors'
  const lbl = 'block text-sm font-medium text-gray-700 mb-1'
  const section = 'bg-white rounded-xl border border-gray-200 p-5 space-y-4'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Core details */}
      <div className={section}>
        <h2 className="font-serif font-semibold text-base" style={{ color: '#1D3A2F' }}>Core Details</h2>

        <div>
          <label className={lbl}>Title <span className="text-red-500">*</span></label>
          <input name="title" required className={f} defaultValue={defaultValues?.title ?? ''} placeholder="Short, clear description of the change" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Change Type <span className="text-red-500">*</span></label>
            <select name="type" required className={f} defaultValue={defaultValues?.type ?? 'normal'}>
              <option value="standard">Standard — Routine, pre-approved</option>
              <option value="normal">Normal — Planned, requires approval</option>
              <option value="emergency">Emergency — Urgent, fast-tracked</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Affected System <span className="text-red-500">*</span></label>
            <select name="system_id" required className={f} defaultValue={defaultValues?.system_id ?? ''}>
              <option value="">Select a system…</option>
              {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={lbl}>Description <span className="text-red-500">*</span></label>
          <textarea name="description" required className={`${f} h-32 resize-y`} defaultValue={defaultValues?.description ?? ''} placeholder="Full explanation of what is changing and which systems or users are affected" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Planned Start <span className="text-red-500">*</span></label>
            <input
              name="planned_start" type="datetime-local" required className={f}
              defaultValue={defaultValues?.planned_start ? new Date(defaultValues.planned_start).toISOString().slice(0, 16) : ''}
            />
          </div>
          <div>
            <label className={lbl}>Planned End <span className="text-red-500">*</span></label>
            <input
              name="planned_end" type="datetime-local" required className={f}
              defaultValue={defaultValues?.planned_end ? new Date(defaultValues.planned_end).toISOString().slice(0, 16) : ''}
            />
          </div>
        </div>
      </div>

      {/* People */}
      <div className={section}>
        <h2 className="font-serif font-semibold text-base" style={{ color: '#1D3A2F' }}>People</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Requester Name <span className="text-red-500">*</span></label>
            <input name="requester_name" required className={f} defaultValue={defaultValues?.requester_name ?? ''} placeholder="Your full name" />
          </div>
          <div>
            <label className={lbl}>Requester Email</label>
            <input name="requester_email" type="email" className={f} defaultValue={defaultValues?.requester_email ?? ''} placeholder="your.email@candle-shack.co.uk" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Assignee Name</label>
            <input name="assignee_name" className={f} defaultValue={defaultValues?.assignee_name ?? ''} placeholder="Person responsible for implementing" />
          </div>
          <div>
            <label className={lbl}>Assignee Email</label>
            <input name="assignee_email" type="email" className={f} defaultValue={defaultValues?.assignee_email ?? ''} placeholder="assignee@candle-shack.co.uk" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Approver</label>
            <select
              name="approver_name"
              className={f}
              defaultValue={defaultValues?.approver_name ?? ''}
              onChange={e => {
                const a = approvers.find(ap => ap.name === e.target.value)
                setApproverEmail(a?.email ?? '')
              }}
            >
              <option value="">Select approver…</option>
              {approvers.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
            <input type="hidden" name="approver_email" value={approverEmail} readOnly />
          </div>
          <div>
            <label className={lbl}>CAB Review Date</label>
            <input name="cab_review_date" type="date" className={f} defaultValue={defaultValues?.cab_review_date ?? ''} />
          </div>
        </div>
      </div>

      {/* Risk & Impact */}
      <div className={section}>
        <h2 className="font-serif font-semibold text-base" style={{ color: '#1D3A2F' }}>Risk & Impact</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Risk Level</label>
            <select name="risk_level" className={f} value={risk} onChange={e => setRisk(e.target.value)}>
              <option value="">Select…</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Impact Level</label>
            <select name="impact_level" className={f} value={impact} onChange={e => setImpact(e.target.value)}>
              <option value="">Select…</option>
              <option value="minimal">Minimal</option>
              <option value="minor">Minor</option>
              <option value="significant">Significant</option>
              <option value="major">Major</option>
            </select>
          </div>
        </div>

        {score > 0 && (
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getRiskColorClass(score)}`}>
            Combined Risk Score: <strong>{score} / 16</strong> — {getRiskLabel(score)}
          </div>
        )}
      </div>

      {/* Additional */}
      <div className={section}>
        <h2 className="font-serif font-semibold text-base" style={{ color: '#1D3A2F' }}>Additional Detail</h2>
        <div>
          <label className={lbl}>Business Justification</label>
          <textarea name="business_justification" className={`${f} h-24 resize-y`} defaultValue={defaultValues?.business_justification ?? ''} placeholder="Why is this change needed and what benefit does it deliver?" />
        </div>
        <div>
          <label className={lbl}>Back-Out Plan</label>
          <textarea name="back_out_plan" className={`${f} h-24 resize-y`} defaultValue={defaultValues?.back_out_plan ?? ''} placeholder="How will this change be reversed if it does not succeed?" />
        </div>
      </div>

      <div className="flex gap-3 justify-end pb-6">
        <a href="/" className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</a>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          style={{ background: '#1D3A2F' }}
        >
          {pending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
