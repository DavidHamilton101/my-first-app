import { createClient } from '@/lib/supabase/server'
import type { Change, AuditEntry, ChangeStatus } from '@/types'
import { VALID_TRANSITIONS } from '@/types'

export async function getChanges(filters?: {
  status?: string
  system_id?: string
  type?: string
  search?: string
}) {
  const supabase = await createClient()
  let query = supabase.from('changes').select('*').order('created_at', { ascending: false })
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.system_id) query = query.eq('system_id', filters.system_id)
  if (filters?.type) query = query.eq('type', filters.type)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)
  const { data, error } = await query
  if (error) throw error
  return data as Change[]
}

export async function getChangeById(id: string) {
  const supabase = await createClient()
  const [{ data: change, error: ce }, { data: audit, error: ae }] = await Promise.all([
    supabase.from('changes').select('*').eq('id', id).single(),
    supabase.from('audit_entries').select('*').eq('change_id', id).order('created_at', { ascending: false }),
  ])
  if (ce) throw ce
  if (ae) throw ae
  return { change: change as Change, audit: (audit ?? []) as AuditEntry[] }
}

export async function createChange(data: Omit<Change, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data: change, error } = await supabase
    .from('changes')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  await supabase.from('audit_entries').insert({
    change_id: change.id,
    action: 'RFC Created',
    actor_name: data.requester_name,
  })
  return change as Change
}

export async function updateChange(id: string, data: Partial<Change>, actorName: string) {
  const supabase = await createClient()
  const { data: change, error } = await supabase
    .from('changes')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  await supabase.from('audit_entries').insert({
    change_id: id,
    action: 'RFC Edited',
    actor_name: actorName,
  })
  return change as Change
}

export async function transitionChange(
  id: string,
  newStatus: ChangeStatus,
  actorName: string,
  note?: string,
  extraData?: Partial<Change>
) {
  const supabase = await createClient()

  const { data: current } = await supabase.from('changes').select('status').eq('id', id).single()
  if (!current) throw new Error('Change not found')

  const allowed = VALID_TRANSITIONS[current.status as ChangeStatus]
  if (!allowed.includes(newStatus)) {
    throw new Error(`Cannot transition from ${current.status} to ${newStatus}`)
  }

  const { data: change, error } = await supabase
    .from('changes')
    .update({ status: newStatus, ...extraData })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  const actionLabels: Record<ChangeStatus, string> = {
    draft:       'Returned to Draft',
    submitted:   'Submitted for Approval',
    approved:    'Approved',
    rejected:    'Rejected',
    implemented: 'Marked Implemented',
    failed:      'Marked Failed',
    closed:      'Closed',
  }

  await supabase.from('audit_entries').insert({
    change_id: id,
    action: actionLabels[newStatus],
    actor_name: actorName,
    note: note || null,
  })

  return change as Change
}
