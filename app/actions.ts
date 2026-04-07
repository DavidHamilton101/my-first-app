'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ── KPI Metrics ──────────────────────────────────────────────────────────────

export async function updateKpi(id: string, data: { value: string; change_pct: number }) {
  const supabase = await createClient()
  await supabase.from('kpi_metrics').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/')
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function createProduct(data: {
  name: string; sku: string; units_sold: number; revenue: string; stock: number; status: string
}) {
  const supabase = await createClient()
  await supabase.from('products').insert(data)
  revalidatePath('/')
}

export async function updateProduct(id: string, data: {
  name: string; sku: string; units_sold: number; revenue: string; stock: number; status: string
}) {
  const supabase = await createClient()
  await supabase.from('products').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/')
}

// ── Sales Channels ────────────────────────────────────────────────────────────

export async function createChannel(data: {
  name: string; orders: number; revenue: string; share_pct: number; sort_order: number
}) {
  const supabase = await createClient()
  await supabase.from('sales_channels').insert(data)
  revalidatePath('/')
}

export async function updateChannel(id: string, data: {
  name: string; orders: number; revenue: string; share_pct: number
}) {
  const supabase = await createClient()
  await supabase.from('sales_channels').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/')
}

export async function deleteChannel(id: string) {
  const supabase = await createClient()
  await supabase.from('sales_channels').delete().eq('id', id)
  revalidatePath('/')
}

// ── Monthly Revenue ───────────────────────────────────────────────────────────

export async function updateMonthlyRevenue(id: string, value: number) {
  const supabase = await createClient()
  await supabase.from('monthly_revenue').update({ value, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/')
}
