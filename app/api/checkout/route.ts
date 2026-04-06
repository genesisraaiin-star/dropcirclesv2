import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const circle_id = searchParams.get('circle_id')
  const handle = searchParams.get('handle')

  // --- 1. Basic param validation ---
  if (!circle_id || !handle) {
    return NextResponse.redirect(`${APP_URL}/${handle ?? ''}?error=missing_params`)
  }

  const supabase = createServiceClient()

  // --- 2. Fetch circle + artist in one join ---
  const { data: circle, error: circleError } = await supabase
    .from('circles')
    .select(`
      id,
      title,
      price,
      is_active,
      expires_at,
      artist_id,
      artists (
        id,
        handle,
        stripe_account_id
      )
    `)
    .eq('id', circle_id)
    .single()

  if (circleError || !circle) {
    return NextResponse.redirect(`${APP_URL}/${handle}?error=drop_not_found`)
  }

  const artist = Array.isArray(circle.artists) ? circle.artists[0] : circle.artists

  // --- 3. Verify drop is still live ---
  if (!circle.is_active) {
    return NextResponse.redirect(`${APP_URL}/${handle}?error=drop_inactive`)
  }

  if (circle.expires_at && new Date(circle.expires_at) < new Date()) {
    return NextResponse.redirect(`${APP_URL}/${handle}?error=drop_expired`)
  }

  if (!artist?.stripe_account_id) {
    // Artist hasn't connected Stripe yet — can't accept payments
    return NextResponse.redirect(`${APP_URL}/${handle}?error=payments_unavailable`)
  }

  // --- 4. Calculate platform fee (5%) ---
  const priceInCents = circle.price
  const platformFee = Math.round(priceInCents * 0.05)

  // --- 5. Create Stripe Checkout Session ---
  let session: Stripe.Checkout.Session

  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: priceInCents,
            product_data: {
              name: circle.title,
              description: `Unlock access · DropCircles`,
            },
          },
        },
      ],

      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: artist.stripe_account_id,
        },
      },

      // CRITICAL: carries circle_id + artist_id into the Phase 3 webhook
      metadata: {
        circle_id: circle.id,
        artist_id: artist.id,
        handle: handle,
      },

      // Fan's email gets collected by Stripe — webhook uses it for ghost auth
      customer_creation: 'always',

      success_url: `${APP_URL}/${handle}/live/${circle.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/${handle}`,
    })
  } catch (err: any) {
    console.error('Stripe session creation failed:', err.message)
    return NextResponse.redirect(`${APP_URL}/${handle}?error=checkout_failed`)
  }

  // --- 6. Teleport ---
  return NextResponse.redirect(session.url!, 303)
}
