import { createClient } from '@/lib/supabase/server'
import type { System } from '@/types'

export async function getSystems(includeHidden = false) {
  const supabase = await createClient()
  let query = supabase.from('systems').select('*').order('name')
  if (!includeHidden) query = query.eq('hidden', false)
  const { data, error } = await query
  if (error) throw error
  return data as System[]
}

export async function createSystem(name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('systems').insert({ name }).select().single()
  if (error) throw error
  return data as System
}

export async function toggleSystemHidden(id: string, hidden: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('systems').update({ hidden }).eq('id', id)
  if (error) throw error
}
