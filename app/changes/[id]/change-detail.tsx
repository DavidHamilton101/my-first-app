'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import type { Change, AuditEntry, Approver, ChangeStatus } from '@/types'
import { TYPE_LABELS, TYPE_COLORS } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import RiskBadge from '@/components/RiskBadge'
import AuditTrail from '@/components/AuditTrail'
import {
  submitChangeAction,
  approveChangeAction,
  rejectChangeAction,
  implementChangeAction,
  failChangeAction,
  closeChangeAction,
  returnToDraftAction,
} from '@/app/actions/changes'

type Panel = 'submit' | 'approve' | 'reject' | 'implement' | 'fail' | 'close' | null

export default function ChangeDetail({
  change,
  audit,
  approvers,
}: {
  change: Change
  audit: AuditEntry[]
  approvers: Approver[]
}) {
  const router = useRouter()
  const [panel, setPanel] = useState<Panel>(null)
  const [approverName, setApproverName] = useState('')
  const [note, setNote] = useState('')
  const [actor, setActor] = useState('')
  const [busy, setBusy] = useState(false)

  const ref = `#${change.id.split('-')[0].toUpperCase()}`
  const selectedApprover = approvers.find(a => a.name === approverName)

  async function run(fn: () => Promise<void>) {
    setBusy(true)
    try { await fn(); router.refresh(); setPanel(null); setNote(''); setActor('') }
    finally { setBusy(false) }
  }

  const btnPrimary = 'px-3 py-1.5 rounded-lg text-sm text-white font-medium disabled:opacity-50 transition-opacity hover:opacity-90'
  const btnSecondary = 'px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50'
  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400'

  return (
    <div className="p-4 sm:p-6 max-w-screen-lg mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-gray-600">Board</Link>
        <span>/</span>
        <span>RFC {ref}</span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs text-gray-400">{ref}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[change.type]}`}>
              {TYPE_LABELS[change.type]}
            </span>
            <StatusBadge status={change.status} />
          </div>
          <h1 className="text-2xl font-serif" style={{ color: '#1D3A2F' }}>{change.title}</h1>
          {change.system_name && <p className="text-sm text-gray-500 mt-1">{change.system_name}</p>}
        </div>
        {['draft', 'rejected', 'failed'].includes(change.status) && (
          <Link href={`/changes/${change.id}/edit`} className={btnSecondary}>Edit</Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">

          {/* Actions */}
          {change.status !== 'closed' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold mb-3" style={{ color: '#1D3A2F' }}>Actions</h2>

              <div className="flex flex-wrap gap-2">
                {change.status === 'draft' && (
                  <button onClick={() => setPanel('submit')} className={btnPrimary} style={{ background: '#1D3A2F' }}>
                    Submit for Approval
                  </button>
                )}
                {change.status === 'submitted' && (<>
                  <button onClick={() => setPanel('approve')} className={btnPrimary} style={{ background: '#16a34a' }}>Approve</button>
                  <button onClick={() => setPanel('reject')} className={`${btnPrimary} bg-red-600`}>Reject</button>
                </>)}
                {change.status === 'approved' && (<>
                  <button onClick={() => setPanel('implement')} className={btnPrimary} style={{ background: '#7c3aed' }}>Mark Implemented</button>
                  <button onClick={() => setPanel('fail')} className={`${btnPrimary} bg-orange-600`}>Mark Failed</button>
                </>)}
                {change.status === 'implemented' && (<>
                  <button onClick={() => setPanel('close')} className={btnPrimary} style={{ background: '#1D3A2F' }}>Close Change</button>
                  <button onClick={() => setPanel('fail')} className={`${btnPrimary} bg-orange-600`}>Mark Failed</button>
                </>)}
                {['rejected', 'failed'].includes(change.status) && (
                  <button
                    onClick={() => run(() => returnToDraftAction(change.id, 'System'))}
                    disabled={busy}
                    className={btnSecondary}
                  >
                    Return to Draft
                  </button>
                )}
              </div>

              {/* Submit panel */}
              {panel === 'submit' && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-sm text-gray-600">Enter your name to submit this RFC for approval. All approvers will be notified.</p>
                  <input value={actor} onChange={e => setActor(e.target.value)} className={inputCls} placeholder="Your name" />
                  <div className="flex gap-2">
                    <button disabled={!actor || busy} onClick={() => run(() => submitChangeAction(change.id, actor))} className={btnPrimary} style={{ background: '#1D3A2F' }}>
                      {busy ? 'Submitting…' : 'Confirm Submit'}
                    </button>
                    <button onClick={() => setPanel(null)} className={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Approve / Reject panel */}
              {(panel === 'approve' || panel === 'reject') && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <select value={approverName} onChange={e => setApproverName(e.target.value)} className={inputCls}>
                    <option value="">Select your name (approver)…</option>
                    {approvers.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className={`${inputCls} h-20 resize-none`}
                    placeholder={panel === 'reject' ? 'Reason for rejection (required)' : 'Note for requester (optional)'}
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={!approverName || (panel === 'reject' && !note) || busy}
                      onClick={() => run(() =>
                        panel === 'approve'
                          ? approveChangeAction(change.id, approverName, selectedApprover?.email ?? '', note || undefined)
                          : rejectChangeAction(change.id, approverName, selectedApprover?.email ?? '', note)
                      )}
                      className={`${btnPrimary} ${panel === 'approve' ? 'bg-green-600' : 'bg-red-600'}`}
                    >
                      {busy ? 'Processing…' : panel === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
                    </button>
                    <button onClick={() => setPanel(null)} className={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Implement / Close panel */}
              {(panel === 'implement' || panel === 'close') && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <input value={actor} onChange={e => setActor(e.target.value)} className={inputCls} placeholder="Your name" />
                  <textarea value={note} onChange={e => setNote(e.target.value)} className={`${inputCls} h-20 resize-none`} placeholder="Outcome notes (optional)" />
                  <div className="flex gap-2">
                    <button
                      disabled={!actor || busy}
                      onClick={() => run(() =>
                        panel === 'implement'
                          ? implementChangeAction(change.id, actor, note || undefined)
                          : closeChangeAction(change.id, actor, note || undefined)
                      )}
                      className={btnPrimary}
                      style={{ background: panel === 'implement' ? '#7c3aed' : '#1D3A2F' }}
                    >
                      {busy ? 'Processing…' : panel === 'implement' ? 'Confirm Implemented' : 'Confirm Close'}
                    </button>
                    <button onClick={() => setPanel(null)} className={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Fail panel */}
              {panel === 'fail' && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <input value={actor} onChange={e => setActor(e.target.value)} className={inputCls} placeholder="Your name" />
                  <textarea value={note} onChange={e => setNote(e.target.value)} className={`${inputCls} h-24 resize-none`} placeholder="What happened and what back-out action was taken (required)" />
                  <div className="flex gap-2">
                    <button disabled={!actor || !note || busy} onClick={() => run(() => failChangeAction(change.id, actor, note))} className={`${btnPrimary} bg-orange-600`}>
                      {busy ? 'Processing…' : 'Confirm Failed'}
                    </button>
                    <button onClick={() => setPanel(null)} className={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <h2 className="text-sm font-semibold mb-2" style={{ color: '#1D3A2F' }}>Description</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{change.description || '—'}</p>
            </div>
            {change.business_justification && (
              <div>
                <h2 className="text-sm font-semibold mb-2" style={{ color: '#1D3A2F' }}>Business Justification</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{change.business_justification}</p>
              </div>
            )}
            {change.back_out_plan && (
              <div>
                <h2 className="text-sm font-semibold mb-2" style={{ color: '#1D3A2F' }}>Back-Out Plan</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{change.back_out_plan}</p>
              </div>
            )}
          </div>

          {/* Audit trail */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#1D3A2F' }}>Audit Trail</h2>
            <AuditTrail entries={audit} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: '#1D3A2F' }}>Details</h2>
            <Detail label="System" value={change.system_name} />
            <Detail label="Requester" value={change.requester_name} />
            {change.requester_email && <Detail label="Requester Email" value={change.requester_email} />}
            <Detail label="Assignee" value={change.assignee_name} />
            {change.assignee_email && <Detail label="Assignee Email" value={change.assignee_email} />}
            <Detail label="Approver" value={change.approver_name} />

            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-1">Risk Score</p>
              <RiskBadge riskLevel={change.risk_level} impactLevel={change.impact_level} />
              {change.risk_level && (
                <p className="text-xs text-gray-400 mt-1">Risk: {change.risk_level} · Impact: {change.impact_level}</p>
              )}
            </div>

            {(change.planned_start || change.planned_end) && (
              <div className="border-t border-gray-100 pt-3 space-y-2">
                {change.planned_start && <Detail label="Planned Start" value={format(new Date(change.planned_start), 'dd MMM yyyy HH:mm')} />}
                {change.planned_end && <Detail label="Planned End" value={format(new Date(change.planned_end), 'dd MMM yyyy HH:mm')} />}
              </div>
            )}

            {change.cab_review_date && (
              <div className="border-t border-gray-100 pt-3">
                <Detail label="CAB Review Date" value={format(new Date(change.cab_review_date), 'dd MMM yyyy')} />
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <Detail label="Created" value={format(new Date(change.created_at), 'dd MMM yyyy HH:mm')} />
              <Detail label="Updated" value={format(new Date(change.updated_at), 'dd MMM yyyy HH:mm')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-700">{value || '—'}</p>
    </div>
  )
}
