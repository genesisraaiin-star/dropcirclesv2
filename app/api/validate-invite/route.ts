import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const { code, email } = await request.json()

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('invite_codes')
    .select('*')
    .eq('code', code.trim().toLowerCase())
    .is('used_at', null)
    .single()

  if (error || !data) {
    return NextResponse.json({ valid: false, error: 'Invalid or already used invite code' }, { status: 200 })
  }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This invite code has expired' }, { status: 200 })
  }

  // If code was pre-assigned to a specific email, enforce it
  if (data.email && email && data.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ valid: false, error: 'This code was issued to a different email' }, { status: 200 })
  }

  return NextResponse.json({ valid: true, inviteId: data.id }, { status: 200 })
}
