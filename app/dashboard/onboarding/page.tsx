'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase' // 👈 Using the Next.js-aware client!

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    genre: '',
    city: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Artist name is required.'); return }
    setLoading(true)
    try {
      // 👈 Simply call your pre-configured client
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      const { error: dbError } = await supabase.from('artists').upsert({
        user_id: user.id,
        name: form.name.trim(),
        genre: form.genre.trim(),
        city: form.city.trim(),
        is_live: false,
      }, { onConflict: 'user_id' })

      if (dbError) { setError('Something went wrong. Try again.'); setLoading(false); return }
      setStep(2)
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  async function handleStripeConnect() {
    setStripeLoading(true)
    setError('')
    try {
      // 👈 Use the same pre-configured client here
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/signin'); return }

      // Invoke the Edge Function we deployed earlier
      const { data, error: functionError } = await supabase.functions.invoke('create-stripe-account', {
        body: { userId: user.id }
      })

      if (functionError || !data?.url) {
        console.error("Stripe Error:", functionError)
        setError('Failed to connect to Stripe. Please try again.')
        setStripeLoading(false)
        return
      }

      // Redirect the user to Stripe's secure hosted onboarding
      window.location.href = data.url

    } catch (err) {
      console.error("Connection Error:", err)
      setError('Something went wrong. Please try again.')
      setStripeLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        :root{--bg:#f9f8f6;--ink:#0a0a0a;--ink2:#6b6b6b;--ink3:#b0b0b0;--cyan:#00c2d4;--line:rgba(10,10,10,0.12);--white:#ffffff;--serif:'DM Serif Display',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--mono:'Space Mono',monospace;}
        html,body{height:100%;background:var(--bg);}
        body{font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased;}
        .shell{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;}
        .card{background:var(--white);border:1px solid var(--line);border-radius:2px;width:100%;max-width:480px;overflow:hidden;}
        .card-header{padding:32px 36px 24px;border-bottom:1px solid var(--line);}
        .step-label{font-family:var(--mono);font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--cyan);margin-bottom:12px;}
        .card-title{font-family:var(--serif);font-size:32px;font-weight:400;color:var(--ink);line-height:1.1;}
        .card-sub{font-size:13px;color:var(--ink2);font-weight:300;line-height:1.6;margin-top:8px;}
        .card-body{padding:28px 36px;}
        .field{margin-bottom:0;border-bottom:1px solid var(--line);}
        .field:last-child{border-bottom:none;}
        .field label{display:block;font-family:var(--mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);padding:14px 0 6px;}
        .field input{width:100%;border:none;outline:none;font-family:var(--sans);font-size:15px;color:var(--ink);font-weight:300;padding-bottom:14px;background:transparent;-webkit-appearance:none;}
        .field input::placeholder{color:var(--ink3);}
        .field input:focus{color:var(--ink);}
        .optional{font-family:var(--mono);font-size:7px;letter-spacing:1px;color:var(--ink3);margin-left:6px;text-transform:uppercase;}
        .card-footer{padding:20px 36px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:16px;}
        .skip-btn{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);background:none;border:none;cursor:pointer;padding:0;transition:color 0.15s;}
        .skip-btn:hover{color:var(--ink);}
        .submit-btn{padding:13px 28px;background:var(--ink);color:var(--white);border:none;font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background 0.15s;display:flex;align-items:center;gap:8px;}
        .submit-btn:hover{background:#1a1a1a;}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .arrow{display:inline-block;transition:transform 0.2s ease;}
        .submit-btn:hover .arrow{transform:translateX(3px);}
        .error-msg{font-family:var(--mono);font-size:9px;letter-spacing:1px;color:#c0392b;padding:0 36px 16px;text-align:center;}
        .progress{height:2px;background:var(--line);width:100%;}
        .progress-fill{height:2px;background:var(--cyan);transition:width 0.4s ease;}

        /* Step 2 — done state */
        .done-wrap{padding:48px 36px;text-align:center;}
        .done-icon{width:48px;height:48px;border-radius:50%;background:var(--cyan);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}
        .done-title{font-family:var(--serif);font-size:32px;font-weight:400;color:var(--ink);margin-bottom:8px;}
        .done-sub{font-size:13px;color:var(--ink2);font-weight:300;line-height:1.7;margin-bottom:28px;}
        .done-actions{display:flex;flex-direction:column;gap:10px;}
        .primary-btn{padding:13px 24px;background:var(--ink);color:var(--white);border:none;font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background 0.15s;text-decoration:none;display:flex;justify-content:space-between;align-items:center;}
        .primary-btn:hover{background:#1a1a1a;}
        .primary-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .secondary-btn{padding:13px 24px;background:transparent;color:var(--ink2);border:1px solid var(--line);font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.15s;text-decoration:none;display:flex;justify-content:space-between;align-items:center;}
        .secondary-btn:hover{border-color:var(--ink);color:var(--ink);}
        .later-note{font-family:var(--mono);font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);margin-top:16px;}
      `}</style>

      <div className="shell">
        {step === 1 && (
          <div className="card">
            <div className="progress"><div className="progress-fill" style={{width:'50%'}}></div></div>
            <div className="card-header">
              <div className="step-label">Step 1 of 1 · Takes 60 seconds</div>
              <div className="card-title">Set up your vault.</div>
              <div className="card-sub">Just the basics. You can add bio, links, and artwork later in settings.</div>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="card-body">
                <div className="field">
                  <label htmlFor="f-name">Artist name</label>
                  <input
                    type="text" id="f-name" placeholder="How fans know you"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    autoFocus autoComplete="name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-genre">Genre <span className="optional">optional</span></label>
                  <input
                    type="text" id="f-genre" placeholder="e.g. R&B, Hip-Hop, Afrobeats"
                    value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-city">City <span className="optional">optional</span></label>
                  <input
                    type="text" id="f-city" placeholder="Where you're based"
                    value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    autoComplete="address-level2"
                  />
                </div>
              </div>
              {error && <div className="error-msg">{error}</div>}
              <div className="card-footer">
                <button type="button" className="skip-btn" onClick={() => router.push('/dashboard')}>
                  Skip for now
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  <span>{loading ? 'Saving...' : 'Save and continue'}</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="progress"><div className="progress-fill" style={{width:'100%'}}></div></div>
            <div className="done-wrap">
              <div className="done-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <polyline points="4 10 8 14 16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="done-title">Vault is ready.</div>
              <div className="done-sub">
                Your profile is set. Next — connect your bank via Stripe so you can receive direct payouts from fans.
              </div>
              
              {error && <div className="error-msg">{error}</div>}

              <div className="done-actions">
                <button 
                  onClick={handleStripeConnect} 
                  disabled={stripeLoading} 
                  className="primary-btn"
                >
                  <span>{stripeLoading ? 'Connecting...' : 'Connect Stripe Account'}</span>
                  <span>→</span>
                </button>
                <a href="/dashboard/settings" className="secondary-btn">
                  <span>I'll do this later</span>
                  <span>→</span>
                </a>
              </div>
              <div className="later-note">Bio, links, and artwork can be added in settings</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}