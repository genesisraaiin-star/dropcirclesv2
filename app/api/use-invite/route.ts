import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const { inviteId, userId } = await request.json()

  if (!inviteId || !userId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  await supabaseAdmin
    .from('invite_codes')
    .update({ used_at: new Date().toISOString(), used_by: userId })
    .eq('id', inviteId)
    .is('used_at', null)

  return NextResponse.json({ ok: true })
}
