'use server'

import { revalidatePath } from 'next/cache'
import { createSystem, toggleSystemHidden } from '@/lib/data/systems'
import { createApprover, updateApprover } from '@/lib/data/approvers'

export async function createSystemAction(name: string) {
  await createSystem(name)
  revalidatePath('/admin/systems')
  revalidatePath('/changes/new')
}

export async function toggleSystemHiddenAction(id: string, hidden: boolean) {
  await toggleSystemHidden(id, hidden)
  revalidatePath('/admin/systems')
  revalidatePath('/changes/new')
}

export async function createApproverAction(name: string, email: string) {
  await createApprover({ name, email })
  revalidatePath('/admin/approvers')
}

export async function updateApproverAction(
  id: string,
  data: { name?: string; email?: string; is_active?: boolean }
) {
  await updateApprover(id, data)
  revalidatePath('/admin/approvers')
}
