import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!
const PLATFORM_ACCOUNT_ID = process.env.STRIPE_PLATFORM_ACCOUNT_ID ?? ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const circle_id = searchParams.get('circle_id')
  const handle = searchParams.get('handle')

  if (!circle_id || !handle) {
    return NextResponse.redirect(`${APP_URL}/${handle ?? ''}?error=missing_params`)
  }

  const supabase = createServiceClient()

  const { data: circle, error: circleError } = await supabase
    .from('circles')
    .select(`
      id, title, price, is_active, expires_at, artist_id,
      artists ( id, handle, stripe_account_id )
    `)
    .eq('id', circle_id)
    .single()

  if (circleError || !circle) {
    return NextResponse.redirect(`${APP_URL}/${handle}?error=drop_not_found`)
  }

  const artist = Array.isArray(circle.artists) ? circle.artists[0] : circle.artists

  if (!circle.is_active) {
    return NextResponse.redirect(`${APP_URL}/${handle}?error=drop_inactive`)
  }

  if (circle.expires_at && new Date(circle.expires_at) < new Date()) {
    return NextResponse.redirect(`${APP_URL}/${handle}?error=drop_expired`)
  }

  const priceInCents = circle.price
  const platformFee = Math.round(priceInCents * 0.05)
  const artistAccountId: string = artist?.stripe_account_id ?? ''
  const isConnectedAccount = artistAccountId && artistAccountId !== PLATFORM_ACCOUNT_ID

  // Build line items
  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency: 'usd' as const,
        unit_amount: priceInCents,
        product_data: {
          name: circle.title,
          description: 'Unlock access · DropCircles',
        },
      },
    },
  ]

  let session: Stripe.Checkout.Session
  try {
    if (isConnectedAccount) {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        payment_intent_data: {
          application_fee_amount: platformFee,
          transfer_data: { destination: artistAccountId },
        },
        metadata: { circle_id: circle.id, artist_id: artist?.id ?? '', handle },
        customer_creation: 'always',
        success_url: `${APP_URL}/${handle}/live/${circle.id}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/${handle}`,
      })
    } else {
      // Testing mode — no Connect transfer
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        metadata: { circle_id: circle.id, artist_id: artist?.id ?? '', handle },
        customer_creation: 'always',
        success_url: `${APP_URL}/${handle}/live/${circle.id}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/${handle}`,
      })
    }
  } catch (err: any) {
    console.error('Stripe session creation failed:', err.message)
    return NextResponse.redirect(`${APP_URL}/${handle}?error=checkout_failed`)
  }

  return NextResponse.redirect(session.url!, 303)
}
