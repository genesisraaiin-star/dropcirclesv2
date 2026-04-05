'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function CheckEmailInner() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{height:100%;background:#080808;}
        body{background-color:#080808;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");color:#f5f2ee;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px;text-align:center;}
        @keyframes corePulse{0%,100%{opacity:0.7;}50%{opacity:1;}}
        .logo-cyan{animation:corePulse 3s ease-in-out infinite;}
        .title{font-family:'DM Serif Display',serif;font-size:36px;font-weight:400;margin:32px 0 12px;}
        .sub{font-size:14px;color:rgba(245,242,238,0.45);line-height:1.8;max-width:300px;}
        .email-highlight{color:rgba(245,242,238,0.8);}
        .note{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,242,238,0.18);margin-top:28px;}
        .back{margin-top:40px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,242,238,0.2);text-decoration:none;transition:color 0.2s;}
        .back:hover{color:rgba(245,242,238,0.55);}
      `}</style>
      <div className="page">
        <svg width="64" height="42" viewBox="0 0 72 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="23" r="22" stroke="rgba(245,242,238,0.7)" strokeWidth="1.2"/>
          <circle cx="47" cy="23" r="22" stroke="rgba(245,242,238,0.7)" strokeWidth="1.2"/>
          <circle cx="36" cy="23" r="3" fill="#00c2d4" className="logo-cyan"/>
        </svg>
        <h1 className="title">Check your email.</h1>
        <p className="sub">
          We sent a confirmation link to{' '}
          <span className="email-highlight">{email}</span>.
          {' '}Click it to activate your account and start onboarding.
        </p>
        <p className="note">Link expires in 24 hours</p>
        <a href="/signin" className="back">← Back to sign in</a>
      </div>
    </>
  )
}

export default function CheckEmailPage() {
  return <Suspense><CheckEmailInner /></Suspense>
}
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function CheckEmailInner() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{height:100%;background:#080808;}
        body{background-color:#080808;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");color:#f5f2ee;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px;text-align:center;}
        @keyframes corePulse{0%,100%{opacity:0.7;}50%{opacity:1;}}
        .logo-cyan{animation:corePulse 3s ease-in-out infinite;}
        .title{font-family:'DM Serif Display',serif;font-size:36px;font-weight:400;margin:32px 0 12px;}
        .sub{font-size:14px;color:rgba(245,242,238,0.45);line-height:1.8;max-width:300px;}
        .email-highlight{color:rgba(245,242,238,0.8);}
        .note{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(245,242,238,0.18);margin-top:28px;}
        .back{margin-top:40px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,242,238,0.2);text-decoration:none;transition:color 0.2s;}
        .back:hover{color:rgba(245,242,238,0.55);}
      `}</style>
      <div className="page">
        <svg width="64" height="42" viewBox="0 0 72 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="23" r="22" stroke="rgba(245,242,238,0.7)" strokeWidth="1.2"/>
          <circle cx="47" cy="23" r="22" stroke="rgba(245,242,238,0.7)" strokeWidth="1.2"/>
          <circle cx="36" cy="23" r="3" fill="#00c2d4" className="logo-cyan"/>
        </svg>
        <h1 className="title">Check your email.</h1>
        <p className="sub">
          We sent a confirmation link to{' '}
          <span className="email-highlight">{email}</span>.
          {' '}Click it to activate your account and start onboarding.
        </p>
        <p className="note">Link expires in 24 hours</p>
        <a href="/signin" className="back">← Back to sign in</a>
      </div>
    </>
  )
}

export default function CheckEmailPage() {
  return <Suspense><CheckEmailInner /></Suspense>
}
