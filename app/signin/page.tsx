'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    setSent(true)
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
        .logo-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:52px;}
        .wordmark{font-family:var(--sans);font-weight:300;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:var(--white);opacity:0.45;}
        .circle-mark{position:relative;width:56px;height:56px;}
        .ring{position:absolute;border-radius:50%;border:1px solid;}
        @keyframes slowSpin{100%{transform:rotate(360deg);}}
        @keyframes corePulse{0%,100%{box-shadow:0 0 0px rgba(0,194,212,0);}33%{box-shadow:0 0 10px rgba(0,194,212,0.5);}}
        @media(prefers-reduced-motion:no-preference){.r1{animation:slowSpin 9s linear infinite;}.r2{animation:slowSpin 6s linear infinite reverse;}}
        .r1{width:56px;height:56px;top:0;left:0;border-color:rgba(245,242,238,0.1);}
        .r2{width:37px;height:37px;top:9.5px;left:9.5px;border-color:rgba(245,242,238,0.18);}
        .r3{width:20px;height:20px;top:18px;left:18px;border-color:rgba(245,242,238,0.28);}
        .r-core{width:7px;height:7px;top:24.5px;left:24.5px;background:var(--cyan);border-color:var(--cyan);animation:corePulse 3s cubic-bezier(0.25,0.1,0.25,1) infinite;}
        .label{font-family:var(--mono);font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(245,242,238,0.3);margin-bottom:20px;}
        .title{font-family:var(--serif);font-size:clamp(28px,4vw,44px);line-height:1.05;letter-spacing:-1px;color:var(--white);font-weight:400;text-align:center;margin-bottom:40px;}
        .form-wrap{width:100%;max-width:320px;border:1px solid var(--line);border-radius:2px;overflow:hidden;}
        .fi{padding:14px 18px;border:none;font-family:var(--sans);font-size:13px;color:var(--white);background:rgba(245,242,238,0.04);outline:none;width:100%;font-weight:300;-webkit-appearance:none;transition:border-color 0.3s ease,padding-left 0.3s ease;}
        .fi::placeholder{color:rgba(245,242,238,0.22);transition:opacity 0.3s ease,transform 0.3s ease;}
        .fi:focus{background:rgba(245,242,238,0.07);padding-left:22px;}
        .fi:focus::placeholder{opacity:0;transform:translateX(8px);}
        .error-msg{font-family:var(--mono);font-size:9px;letter-spacing:1px;color:#e07060;margin-top:8px;text-align:center;width:100%;max-width:320px;}
        .submit-btn{width:100%;max-width:320px;margin-top:1px;padding:14px 18px;background:var(--white);color:var(--black);border:none;font-family:var(--mono);font-size:10px;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background 0.15s ease;}
        .submit-btn:hover{background:#e8e5e1;}
        .arrow{display:inline-block;transition:transform 0.2s ease;}
        .submit-btn:hover .arrow{transform:translateX(4px);}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .sent-wrap{text-align:center;max-width:320px;}
        .sent-title{font-family:var(--serif);font-size:28px;color:var(--white);margin-bottom:10px;font-weight:400;}
        .sent-sub{font-size:12px;color:rgba(245,242,238,0.4);font-weight:300;line-height:1.7;}
        .sent-sub strong{color:rgba(245,242,238,0.7);}
        .sent-note{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,242,238,0.2);margin-top:20px;}
        .footer{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:20px;white-space:nowrap;}
        .footer-link{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,242,238,0.2);text-decoration:none;transition:color 0.2s;}
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

        <div className="label">Visionary access</div>

        {!sent ? (
          <>
            <h1 className="title">Enter the vault.</h1>
            <form onSubmit={handleSubmit} noValidate style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
              <div className="form-wrap">
                <label className="sr-only" htmlFor="f-email">Email address</label>
                <input
                  className="fi"
                  type="email"
                  id="f-email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {error && <div className="error-msg" role="alert">{error}</div>}
              <button className="submit-btn" type="submit" disabled={loading}>
                <span>{loading ? 'Sending link...' : 'Send magic link'}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </button>
            </form>
          </>
        ) : (
          <div className="sent-wrap" role="status">
            <div className="sent-title">Check your email.</div>
            <div className="sent-sub">
              We sent a link to <strong>{email}</strong>.<br/>
              Click it to enter your dashboard. No password needed.
            </div>
            <div className="sent-note">Link expires in 1 hour</div>
          </div>
        )}

        <div className="footer">
          <Link href="/" className="footer-link">← Back</Link>
          <div className="footer-sep"></div>
          <Link href="/about" className="footer-link">About</Link>
        </div>
      </div>
    </>
  )
}
