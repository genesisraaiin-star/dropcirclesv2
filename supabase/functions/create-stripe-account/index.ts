import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// 🚨 FIX 1: Native Deno npm import (No more microtask crashes!)
import Stripe from 'npm:stripe@^14.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    if (!userId) throw new Error('User ID is required')

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables in backend')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(), // Crucial for Deno
    })

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const account = await stripe.accounts.create({
      type: 'express',
    })

    // 🚨 FIX 2: Target the correct 'user_id' column in your artists table
    const { error: dbError } = await supabaseAdmin
      .from('artists')
      .update({ stripe_account_id: account.id })
      .eq('user_id', userId) 

    if (dbError) throw new Error(`Database error: ${dbError.message}`)

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://dropcirclesv2-ojizv40g0-sunnys-projects-e5a13f4d.vercel.app/dashboard/onboarding',
      return_url: 'https://dropcirclesv2-ojizv40g0-sunnys-projects-e5a13f4d.vercel.app/dashboard/circles',
      type: 'account_onboarding',
    })

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})