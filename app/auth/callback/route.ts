import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if artist has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: artist } = await supabase
          .from('artists')
          .select('name')
          .eq('user_id', user.id)
          .single()
        // No name = hasn't onboarded yet
        if (!artist?.name) return NextResponse.redirect(`${origin}/dashboard/onboarding`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: artist } = await supabase
          .from('artists')
          .select('name')
          .eq('user_id', user.id)
          .single()
        if (!artist?.name) return NextResponse.redirect(`${origin}/dashboard/onboarding`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/signin?error=auth_failed`)
}
