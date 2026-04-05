'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--black:#080808;--white:#f5f2ee;--cyan:#00c2d4;--line:rgba(245,242,238,0.1);--line-focus:rgba(245,242,238,0.25);--serif:'DM Serif Display',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--mono:'Space Mono',monospace;}
  html,body{height:100%;background:#080808;}
  body{background-color:var(--black);background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");color:var(--white);font-family:var(--sans);-webkit-font-smoothing:antialiased;}
  .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px;position:relative;}
  .logo-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:48px;}
  .wordmark{font-family:var(--sans);font-weight:300;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:var(--white);opacity:0.4;}
  @keyframes corePulse{0%,100%{opacity:0.7;}50%{opacity:1;}}
  .logo-cyan{animation:corePulse 3s ease-in-out infinite;}
  .card{width:100%;max-width:340px;}
  .tabs{display:flex;border-bottom:1px solid var(--line);margin-bottom:32px;}
  .tab{flex:1;padding:10px 0;font-family:var(--mono);font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(245,242,238,0.28);background:none;border:none;cursor:pointer;transition:color 0.2s;border-bottom:1px solid transparent;margin-bottom:-1px;}
  .tab:hover{color:rgba(245,242,238,0.55);}
  .tab.active{color:var(--white);border-bottom-color:var(--cyan);}
  .field{margin-bottom:12px;}
  .field-label{font-family:var(--mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,242,238,0.3);margin-bottom:6px;display:block;}
  .fi{width:100%;padding:12px 14px;background:rgba(245,242,238,0.04);border:1px solid var(--line);border-radius:2px;font-family:var(--sans);font-size:13px;color:var(--white);outline:none;transition:border-color 0.2s,background 0.2s;-webkit-appearance:none;}
  .fi::placeholder{color:rgba(245,242,238,0.18);}
  .fi:focus{border-color:var(--line-focus);background:rgba(245,242,238,0.06);}
  .fi.valid{border-color:rgba(0,194,212,0.4);}
  .fi.invalid{border-color:rgba(220,80,60,0.5);}
  .code-wrap{position:relative;}
  .code-status{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-family:var(--mono);font-size:9px;letter-spacing:1px;}
  .status-ok{color:var(--cyan);}
  .status-err{color:#e07060;}
  @keyframes pulse{0%,100%{opacity:0.3;}50%{opacity:0.7;}}
  .status-checking{color:rgba(245,242,238,0.3);animation:pulse 1s ease-in-out infinite;}
  .submit-btn{width:100%;margin-top:6px;padding:13px 18px;background:var(--white);color:var(--black);border:none;border-radius:2px;font-family:var(--mono);font-size:10px;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background 0.15s;}
  .submit-btn:hover{background:#e8e5e1;}
  .submit-btn:disabled{opacity:0.4;cursor:not-allowed;}
  .arrow{transition:transform 0.2s;}
  .submit-btn:hover .arrow{transform:translateX(4px);}
  .error-msg{font-family:var(--mono);font-size:9px;letter-spacing:1px;color:#e07060;margin-top:10px;text-align:center;line-height:1.6;}
  .hint{font-family:var(--mono);font-size:8px;letter-spacing:1px;color:rgba(245,242,238,0.2);text-align:center;line-height:1.8;}
  .footer{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:20px;white-space:nowrap;}
  .footer-link{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,242,238,0.2);text-decoration:none;transition:color 0.2s;}
  .footer-link:hover{color:rgba(245,242,238,0.55);}
  .footer-sep{width:1px;height:10px;background:rgba(245,242,238,0.1);}
`

function AuthInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')

  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')
  const [siLoading, setSiLoading] = useState(false)
  const [siError, setSiError] = useState('')

  const [suCode, setSuCode] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suLoading, setSuLoading] = useState(false)
  const [suError, setSuError] = useState('')
  const [codeStatus, setCodeStatus] = useState<'idle'|'checking'|'valid'|'invalid'>('idle')
  const [inviteId, setInviteId] = useState<string|null>(null)

  useEffect(() => {
    const urlCode = searchParams.get('code')
    if (urlCode) { setSuCode(urlCode); setTab('signup'); validateCode(urlCode, '') }
    if (searchParams.get('error')) setSiError('Authentication failed. Please try again.')
  }, [])

  const validateCode = async (code: string, email: string) => {
    if (code.trim().length < 4) { setCodeStatus('idle'); return }
    setCodeStatus('checking')
    const res = await fetch('/api/validate-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim(), email }),
    })
    const data = await res.json()
    if (data.valid) { setCodeStatus('valid'); setInviteId(data.inviteId) }
    else { setCodeStatus('invalid'); setInviteId(null) }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setSiError(''); setSiLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: siEmail.trim(), password: siPassword })
    if (error) {
      setSiError(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message)
      setSiLoading(false); return
    }
    router.push('/dashboard')
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setSuError('')
    if (codeStatus !== 'valid') { setSuError('Enter a valid invite code first.'); return }
    if (suPassword.length < 8) { setSuError('Password must be at least 8 characters.'); return }
    if (suPassword !== suConfirm) { setSuError("Passwords don't match."); return }
    setSuLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: suEmail.trim(),
      password: suPassword,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setSuError(error.message); setSuLoading(false); return }
    if (inviteId && data.user) {
      await fetch('/api/use-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, userId: data.user.id }),
      })
    }
    if (data.session) { router.push('/dashboard/onboarding') }
    else { router.push('/signup/check-email?email=' + encodeURIComponent(suEmail)) }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="page">
        <div className="logo-wrap">
          <svg width="64" height="42" viewBox="0 0 72 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="23" r="22" stroke="rgba(245,242,238,0.7)" strokeWidth="1.2"/>
            <circle cx="47" cy="23" r="22" stroke="rgba(245,242,238,0.7)" strokeWidth="1.2"/>
            <circle cx="36" cy="23" r="3" fill="#00c2d4" className="logo-cyan"/>
          </svg>
          <div className="wordmark">DropCircles</div>
        </div>

        <div className="card">
          <div className="tabs">
            <button className={`tab ${tab==='signin'?'active':''}`} onClick={()=>{setTab('signin');setSiError('')}}>Sign In</button>
            <button className={`tab ${tab==='signup'?'active':''}`} onClick={()=>{setTab('signup');setSuError('')}}>Sign Up</button>
          </div>

          {tab==='signin' && (
            <form onSubmit={handleSignIn}>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="fi" type="email" placeholder="your@email.com" value={siEmail} onChange={e=>setSiEmail(e.target.value)} autoComplete="email" autoFocus required/>
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <input className="fi" type="password" placeholder="••••••••" value={siPassword} onChange={e=>setSiPassword(e.target.value)} autoComplete="current-password" required/>
              </div>
              {siError && <div className="error-msg">{siError}</div>}
              <button className="submit-btn" type="submit" disabled={siLoading}>
                <span>{siLoading ? 'Signing in...' : 'Enter vault'}</span>
                <span className="arrow">→</span>
              </button>
            </form>
          )}

          {tab==='signup' && (
            <form onSubmit={handleSignUp}>
              <div className="field">
                <label className="field-label">Invite Code</label>
                <div className="code-wrap">
                  <input
                    className={`fi ${codeStatus==='valid'?'valid':codeStatus==='invalid'?'invalid':''}`}
                    type="text" placeholder="Your invite code"
                    value={suCode}
                    onChange={e=>{setSuCode(e.target.value);setCodeStatus('idle')}}
                    onBlur={()=>validateCode(suCode,suEmail)}
                    autoFocus required
                    style={{paddingRight:'80px'}}
                  />
                  <span className="code-status">
                    {codeStatus==='checking'&&<span className="status-checking">checking</span>}
                    {codeStatus==='valid'&&<span className="status-ok">✓ valid</span>}
                    {codeStatus==='invalid'&&<span className="status-err">invalid</span>}
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="fi" type="email" placeholder="your@email.com" value={suEmail} onChange={e=>setSuEmail(e.target.value)} autoComplete="email" required/>
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <input className="fi" type="password" placeholder="Min 8 characters" value={suPassword} onChange={e=>setSuPassword(e.target.value)} autoComplete="new-password" required/>
              </div>
              <div className="field">
                <label className="field-label">Confirm Password</label>
                <input
                  className={`fi ${suConfirm&&suConfirm!==suPassword?'invalid':suConfirm&&suConfirm===suPassword?'valid':''}`}
                  type="password" placeholder="Repeat password"
                  value={suConfirm} onChange={e=>setSuConfirm(e.target.value)} autoComplete="new-password" required
                />
              </div>
              {suError && <div className="error-msg">{suError}</div>}
              <button className="submit-btn" type="submit" disabled={suLoading||codeStatus!=='valid'}>
                <span>{suLoading ? 'Creating account...' : 'Create account'}</span>
                <span className="arrow">→</span>
              </button>
              <div className="hint" style={{marginTop:'16px'}}>
                Invite-only. No code?{' '}
                <a href="/" style={{color:'rgba(0,194,212,0.6)',textDecoration:'none'}}>Request access</a>
              </div>
            </form>
          )}
        </div>

        <div className="footer">
          <a href="/" className="footer-link">← Back</a>
          <div className="footer-sep"/>
          <a href="/about" className="footer-link">About</a>
        </div>
      </div>
    </>
  )
}

export default function SignInPage() {
  return <Suspense><AuthInner /></Suspense>
}
