'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createChange, updateChange, transitionChange } from '@/lib/data/changes'
import { getApprovers } from '@/lib/data/approvers'
import {
  sendChangeSubmitted,
  sendChangeApproved,
  sendChangeRejected,
  sendChangeStatusUpdate,
} from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

function parseDateTime(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== 'string' || !value.trim()) return null
  try { return new Date(value).toISOString() } catch { return null }
}

function parseString(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== 'string' || !value.trim()) return null
  return value.trim()
}

function buildChangeData(formData: FormData, systemName: string | null) {
  return {
    title:                  formData.get('title') as string,
    type:                   (formData.get('type') as string) as 'standard' | 'normal' | 'emergency',
    system_id:              parseString(formData.get('system_id')),
    system_name:            systemName,
    description:            parseString(formData.get('description')),
    planned_start:          parseDateTime(formData.get('planned_start')),
    planned_end:            parseDateTime(formData.get('planned_end')),
    business_justification: parseString(formData.get('business_justification')),
    assignee_name:          parseString(formData.get('assignee_name')),
    assignee_email:         parseString(formData.get('assignee_email')),
    approver_name:          parseString(formData.get('approver_name')),
    approver_email:         parseString(formData.get('approver_email')),
    risk_level:             (parseString(formData.get('risk_level')) as 'low' | 'medium' | 'high' | 'critical' | null),
    impact_level:           (parseString(formData.get('impact_level')) as 'minimal' | 'minor' | 'significant' | 'major' | null),
    back_out_plan:          parseString(formData.get('back_out_plan')),
    cab_review_date:        parseString(formData.get('cab_review_date')),
    requester_name:         formData.get('requester_name') as string,
    requester_email:        parseString(formData.get('requester_email')),
  }
}

async function getSystemName(systemId: string | null): Promise<string | null> {
  if (!systemId) return null
  const supabase = await createClient()
  const { data } = await supabase.from('systems').select('name').eq('id', systemId).single()
  return data?.name ?? null
}

function revalidateAll(changeId?: string) {
  revalidatePath('/')
  revalidatePath('/list')
  if (changeId) revalidatePath(`/changes/${changeId}`)
}

export async function createChangeAction(formData: FormData) {
  const systemId = parseString(formData.get('system_id'))
  const systemName = await getSystemName(systemId)
  const data = buildChangeData(formData, systemName)
  const change = await createChange({ ...data, status: 'draft' })
  revalidateAll()
  redirect(`/changes/${change.id}`)
}

export async function updateChangeAction(id: string, formData: FormData) {
  const systemId = parseString(formData.get('system_id'))
  const systemName = await getSystemName(systemId)
  const data = buildChangeData(formData, systemName)
  const actorName = data.requester_name || 'Unknown'
  await updateChange(id, data, actorName)
  revalidateAll(id)
  redirect(`/changes/${id}`)
}

export async function submitChangeAction(id: string, actorName: string) {
  const change = await transitionChange(id, 'submitted', actorName)
  const approvers = await getApprovers(true)
  await sendChangeSubmitted(change, approvers)
  revalidateAll(id)
}

export async function approveChangeAction(
  id: string,
  approverName: string,
  approverEmail: string,
  note?: string
) {
  const change = await transitionChange(id, 'approved', approverName, note, {
    approver_name: approverName,
    approver_email: approverEmail,
  })
  await sendChangeApproved(change, note)
  revalidateAll(id)
}

export async function rejectChangeAction(
  id: string,
  approverName: string,
  approverEmail: string,
  note: string
) {
  const change = await transitionChange(id, 'rejected', approverName, note)
  await sendChangeRejected(change, note)
  revalidateAll(id)
}

export async function implementChangeAction(id: string, actorName: string, note?: string) {
  const change = await transitionChange(id, 'implemented', actorName, note)
  const approvers = await getApprovers(true)
  await sendChangeStatusUpdate(change, approvers, note)
  revalidateAll(id)
}

export async function failChangeAction(id: string, actorName: string, note: string) {
  const change = await transitionChange(id, 'failed', actorName, note)
  const approvers = await getApprovers(true)
  await sendChangeStatusUpdate(change, approvers, note)
  revalidateAll(id)
}

export async function closeChangeAction(id: string, actorName: string, note?: string) {
  const change = await transitionChange(id, 'closed', actorName, note)
  const approvers = await getApprovers(true)
  await sendChangeStatusUpdate(change, approvers, note)
  revalidateAll(id)
}

export async function returnToDraftAction(id: string, actorName: string) {
  await transitionChange(id, 'draft', actorName, 'Returned to draft for revision')
  revalidateAll(id)
}
