'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Artist name is required.'); return }
    if (!emailRegex.test(form.email.trim())) { setError('Please enter a valid email address.'); return }
    setLoading(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { error: dbError } = await supabase.from('waitlist').insert({ name: form.name.trim(), email: form.email.trim() })
      if (dbError && dbError.code !== '23505') { setError('Something went wrong. Try again.'); setLoading(false); return }
    } catch { setError('Something went wrong. Try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        :root{--black:#080808;--white:#f5f2ee;--cyan:#00c2d4;--line:rgba(245,242,238,0.12);--serif:'DM Serif Display',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--mono:'Space Mono',monospace;}
        html,body{height:100%;background:#080808;}
        body{background-color:var(--black);background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");color:var(--white);font-family:var(--sans);-webkit-font-smoothing:antialiased;}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 32px;position:relative;}
        .logo-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:56px;}
        .wordmark{font-family:var(--sans);font-weight:300;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:var(--white);opacity:0.45;}
        .circle-mark{position:relative;width:72px;height:72px;}
        .ring{position:absolute;border-radius:50%;border:1px solid;}
        @keyframes slowSpin{100%{transform:rotate(360deg);}}
        @keyframes corePulse{0%,100%{box-shadow:0 0 0px rgba(0,194,212,0);}33%{box-shadow:0 0 10px rgba(0,194,212,0.5);}}
        @media(prefers-reduced-motion:no-preference){.r1{animation:slowSpin 9s linear infinite;}.r2{animation:slowSpin 6s linear infinite reverse;}}
        .r1{width:72px;height:72px;top:0;left:0;border-color:rgba(245,242,238,0.1);}
        .r2{width:48px;height:48px;top:12px;left:12px;border-color:rgba(245,242,238,0.18);}
        .r3{width:26px;height:26px;top:23px;left:23px;border-color:rgba(245,242,238,0.28);}
        .r-core{width:9px;height:9px;top:31.5px;left:31.5px;background:var(--cyan);border-color:var(--cyan);animation:corePulse 3s cubic-bezier(0.25,0.1,0.25,1) infinite;}
        .badge{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border:1px solid rgba(0,194,212,0.25);border-radius:100px;font-family:var(--mono);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--cyan);margin-bottom:44px;}
        .badge::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--cyan);flex-shrink:0;animation:blink 2s ease-in-out infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.1}}
        .title{font-family:var(--serif);font-size:clamp(40px,7vw,84px);line-height:1.05;letter-spacing:-2px;color:var(--white);font-weight:400;text-align:center;margin-bottom:52px;}
        .title em{font-style:italic;color:rgba(245,242,238,0.32);}
        .form-wrap{width:100%;max-width:340px;border:1px solid var(--line);border-radius:2px;overflow:hidden;}
        .fi{padding:14px 18px;border:none;border-bottom:1px solid var(--line);font-family:var(--sans);font-size:13px;color:var(--white);background:rgba(245,242,238,0.04);outline:none;width:100%;font-weight:300;-webkit-appearance:none;transition:border-color 0.3s ease,padding-left 0.3s ease;}
        .fi::placeholder{color:rgba(245,242,238,0.22);transition:opacity 0.3s ease,transform 0.3s ease;}
        .fi:focus{background:rgba(245,242,238,0.07);border-bottom-color:rgba(245,242,238,0.28);padding-left:22px;}
        .fi:focus::placeholder{opacity:0;transform:translateX(8px);}
        .fi-last{border-bottom:none;}
        .error-msg{font-family:var(--mono);font-size:9px;letter-spacing:1px;color:#e07060;margin-top:8px;text-align:center;width:100%;max-width:340px;}
        .submit-btn{width:100%;max-width:340px;margin-top:1px;padding:14px 18px;background:var(--white);color:var(--black);border:none;font-family:var(--mono);font-size:10px;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background 0.15s ease;}
        .submit-btn:hover{background:#e8e5e1;}
        .arrow{display:inline-block;transition:transform 0.2s ease;}
        .submit-btn:hover .arrow{transform:translateX(4px);}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .success-wrap{text-align:center;max-width:340px;}
        .sb-title{font-family:var(--serif);font-size:32px;color:var(--white);margin-bottom:10px;font-weight:400;}
        .sb-sub{font-size:12px;color:rgba(245,242,238,0.4);font-weight:300;line-height:1.7;margin-bottom:16px;}
        .sb-line{font-family:var(--mono);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--cyan);}
        .footer{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:20px;white-space:nowrap;}
        .footer-link{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,242,238,0.2);cursor:pointer;transition:color 0.2s;text-decoration:none;background:none;border:none;padding:0;}
        .footer-link:hover{color:rgba(245,242,238,0.55);}
        .footer-sep{width:1px;height:10px;background:rgba(245,242,238,0.1);}
      `}</style>

      <div className="page">
        <div className="logo-wrap">
          <div className="circle-mark">
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>
            <div className="ring r-core"></div>
          </div>
          <div className="wordmark">DropCircles</div>
        </div>

        <div className="badge">Ecosystem locked · Beta</div>

        <h1 className="title">
          No platform.<br/>
          No permission.<br/>
          <em>No performance.</em>
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
            <div className="form-wrap">
              <label className="sr-only" htmlFor="f-name">Artist name</label>
              <input className="fi" type="text" id="f-name" placeholder="Artist name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoComplete="name"/>
              <label className="sr-only" htmlFor="f-email">Email address</label>
              <input className="fi fi-last" type="email" id="f-email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} autoComplete="email"/>
            </div>
            {error && <div className="error-msg" role="alert">{error}</div>}
            <button className="submit-btn" type="submit" disabled={loading}>
              <span>{loading ? 'Requesting...' : 'Request vault access'}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </button>
          </form>
        ) : (
          <div className="success-wrap" role="status">
            <div className="sb-title">You're in the vault.</div>
            <div className="sb-sub">We'll reach out to <strong style={{color:'rgba(245,242,238,0.7)'}}>{form.email}</strong> personally. No bulk invites. One artist at a time.</div>
            <div className="sb-line">Experience infinite greatness — here, today.</div>
          </div>
        )}

        <div className="footer">
          <Link href="/about" className="footer-link">About →</Link>
          <div className="footer-sep"></div>
          <button className="footer-link" type="button">Already approved? Sign in</button>
        </div>
      </div>
    </>
  )
}
