import type { Change, Approver } from '@/types'

function emailTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:#1D3A2F;padding:24px 32px;">
      <div style="font-family:Georgia,serif;font-size:22px;color:#C17D3C;font-weight:bold;">🕯️ Candle Shack</div>
      <div style="color:#FAF7F2;font-size:12px;margin-top:4px;opacity:0.8;">Change Control System</div>
    </div>
    <div style="padding:32px;background:#ffffff;">
      <h2 style="font-family:Georgia,serif;color:#1D3A2F;margin:0 0 20px;font-size:18px;">${title}</h2>
      ${body}
    </div>
    <div style="padding:16px 32px;background:#FAF7F2;border-top:1px solid #E8E0D5;">
      <p style="color:#999;font-size:12px;margin:0;">Candle Shack Change Control System — automated notification, do not reply.</p>
    </div>
  </div>
</body>
</html>`
}

function changeBlock(change: Change): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:5px 0;color:#888;font-size:13px;width:140px;vertical-align:top;">${label}</td><td style="padding:5px 0;color:#1D3A2F;font-size:13px;">${value}</td></tr>`

  return `<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    ${row('Reference', `#${change.id.split('-')[0].toUpperCase()}`)}
    ${row('Title', `<strong>${change.title}</strong>`)}
    ${row('Status', change.status.toUpperCase())}
    ${row('Type', change.type)}
    ${row('System', change.system_name ?? '—')}
    ${row('Requested by', change.requester_name)}
    ${row('Assignee', change.assignee_name ?? '—')}
    ${change.risk_level ? row('Risk / Impact', `${change.risk_level} / ${change.impact_level ?? '—'}`) : ''}
    ${change.planned_start ? row('Planned Start', new Date(change.planned_start).toLocaleString('en-GB')) : ''}
    ${change.planned_end ? row('Planned End', new Date(change.planned_end).toLocaleString('en-GB')) : ''}
  </table>`
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL SKIPPED — set RESEND_API_KEY to enable] To: ${Array.isArray(to) ? to.join(', ') : to} | ${subject}`)
    return
  }
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'Candle Shack CCS <noreply@candle-shack.co.uk>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })
  } catch (err) {
    console.error('[EMAIL ERROR]', err)
  }
}

export async function sendChangeSubmitted(change: Change, approvers: Approver[]) {
  const emails = approvers.filter(a => a.is_active).map(a => a.email)
  if (!emails.length) return
  const html = emailTemplate(
    'New Change Submitted for Review',
    `<p style="color:#555;font-size:14px;margin:0 0 20px;">A new change request requires your review and approval.</p>
    ${changeBlock(change)}`
  )
  await sendEmail(emails, `[RFC] Submitted for review: ${change.title}`, html)
}

export async function sendChangeApproved(change: Change, note?: string | null) {
  if (!change.assignee_email) return
  const html = emailTemplate(
    'Change Request Approved',
    `<p style="color:#555;font-size:14px;margin:0 0 20px;">Your change request has been approved and may proceed.</p>
    ${note ? `<div style="background:#f0fdf4;border-left:3px solid #22c55e;padding:12px;margin-bottom:20px;font-size:13px;color:#444;">${note}</div>` : ''}
    ${changeBlock(change)}`
  )
  await sendEmail(change.assignee_email, `[RFC] Approved: ${change.title}`, html)
}

export async function sendChangeRejected(change: Change, note?: string | null) {
  const to = change.requester_email ?? change.assignee_email
  if (!to) return
  const html = emailTemplate(
    'Change Request Rejected',
    `<p style="color:#555;font-size:14px;margin:0 0 20px;">Your change request has been reviewed and rejected. It may be revised and resubmitted.</p>
    ${note ? `<div style="background:#fef2f2;border-left:3px solid #ef4444;padding:12px;margin-bottom:20px;font-size:13px;color:#444;">${note}</div>` : ''}
    ${changeBlock(change)}`
  )
  await sendEmail(to, `[RFC] Rejected: ${change.title}`, html)
}

export async function sendChangeStatusUpdate(change: Change, approvers: Approver[], note?: string | null) {
  const emails = approvers.filter(a => a.is_active).map(a => a.email)
  if (!emails.length) return
  const label = change.status.charAt(0).toUpperCase() + change.status.slice(1)
  const html = emailTemplate(
    `Change ${label}`,
    `<p style="color:#555;font-size:14px;margin:0 0 20px;">A change has been marked as <strong>${label}</strong>.</p>
    ${note ? `<div style="background:#fffbeb;border-left:3px solid #C17D3C;padding:12px;margin-bottom:20px;font-size:13px;color:#444;">${note}</div>` : ''}
    ${changeBlock(change)}`
  )
  await sendEmail(emails, `[RFC] ${label}: ${change.title}`, html)
}
