import { createClient } from '@/lib/supabase/server'
import type { Approver } from '@/types'

export async function getApprovers(activeOnly = false) {
  const supabase = await createClient()
  let query = supabase.from('approvers').select('*').order('name')
  if (activeOnly) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return data as Approver[]
}

export async function createApprover(data: { name: string; email: string }) {
  const supabase = await createClient()
  const { data: approver, error } = await supabase.from('approvers').insert(data).select().single()
  if (error) throw error
  return approver as Approver
}

export async function updateApprover(id: string, data: Partial<Pick<Approver, 'name' | 'email' | 'is_active'>>) {
  const supabase = await createClient()
  const { error } = await supabase.from('approvers').update(data).eq('id', id)
  if (error) throw error
}
