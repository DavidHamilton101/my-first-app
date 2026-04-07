import { getApprovers } from '@/lib/data/approvers'
import { NextResponse } from 'next/server'

export async function GET() {
  const approvers = await getApprovers()
  return NextResponse.json(approvers)
}
