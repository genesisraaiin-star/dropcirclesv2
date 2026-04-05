'use client'
import { useState } from 'react'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', genre: '', email: '', handle: '', city: '' })

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
      const { error: dbError } = await supabase.from('waitlist').insert({ name: form.name.trim(), email: form.email.trim(), handle: form.handle.trim(), genre: form.genre.trim(), city: form.city.trim() })
      if (dbError && dbError.code !== '23505') { setError('Something went wrong. Please try again.'); setLoading(false); return }
    } catch { setError('Something went wrong. Please try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        :root{--black:#080808;--white:#f5f2ee;--off:#f9f8f6;--cyan:#00c2d4;--line:rgba(245,242,238,0.15);--linelt:rgba(10,10,10,0.12);--ink2:#6b6b6b;--ink3:#b0b0b0;--gray:#3a3a3a;--serif:'DM Serif Display',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--mono:'Space Mono',monospace;}
        html{background:#080808;}
        body{background-color:var(--black);background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");color:var(--white);font-family:var(--sans);-webkit-font-smoothing:antialiased;}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
        .grain{background-color:var(--black);background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");}
        .nav{display:flex;justify-content:center;align-items:center;flex-direction:column;padding:32px 48px 24px;border-bottom:1px solid var(--line);gap:8px;}
        .wordmark{font-family:var(--sans);font-weight:300;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:var(--white);opacity:0.6;}
        .hero-black{padding:72px 60px 80px;border-bottom:1px solid var(--line);}
        .invite-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border:1px solid rgba(0,194,212,0.3);border-radius:100px;font-family:var(--mono);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--cyan);margin-bottom:32px;}
        .invite-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--cyan);flex-shrink:0;animation:blink 2s ease-in-out infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .hero-title{font-family:var(--serif);font-size:clamp(48px,8vw,110px);line-height:1.05;letter-spacing:-2px;color:var(--white);font-weight:400;}
        .hero-title em{font-style:italic;color:rgba(245,242,238,0.4);}
        .hero-sub{font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gray);margin-top:32px;max-width:400px;line-height:1.6;}
        .manifesto-moment{border-bottom:1px solid var(--line);}
        .you-block{padding:72px 60px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;}
        .you-col{border-right:1px solid var(--line);padding-right:40px;}
        .you-col:not(:first-child){padding-left:40px;}
        .you-col:last-child{border-right:none;padding-right:0;}
        .you-verb{font-family:var(--serif);font-size:clamp(26px,3.5vw,48px);line-height:1.1;color:var(--white);font-weight:400;margin-bottom:8px;}
        .you-desc{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gray);line-height:1.8;margin-top:10px;}
        .manifesto-strip{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid var(--line);}
        .m-col{padding:32px 28px;border-right:1px solid var(--line);position:relative;overflow:hidden;}
        .m-col:last-child{border-right:none;}
        .m-num{position:absolute;top:-10px;left:-5px;font-family:var(--serif);font-size:120px;color:rgba(245,242,238,0.03);font-weight:400;line-height:1;z-index:0;pointer-events:none;user-select:none;}
        .m-text{position:relative;z-index:1;font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gray);line-height:1.9;}
        .light{background:var(--off);color:#0a0a0a;}
        .two-col{display:grid;grid-template-columns:1fr 1fr;min-height:640px;}
        .col-l{padding:52px 52px 52px 60px;border-right:1px solid var(--linelt);display:flex;flex-direction:column;justify-content:center;}
        .col-r{padding:52px 48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;}
        .col-hed{font-family:var(--serif);font-size:clamp(32px,4vw,54px);line-height:1.0;letter-spacing:-0.5px;color:#0a0a0a;margin-bottom:10px;}
        .col-hed em{font-style:italic;color:#0a0a0a;}
        .col-sub{font-size:14px;color:var(--ink2);font-weight:300;line-height:1.75;max-width:400px;margin-bottom:28px;}
        .lock-bar{font-family:var(--mono);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--ink2);padding:11px 0;border-top:1px solid var(--linelt);border-bottom:1px solid var(--linelt);margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
        .lock-spots{color:var(--cyan);}
        .form-wrap{border:1px solid var(--linelt);border-radius:2px;overflow:hidden;max-width:400px;}
        .f-row-2{display:grid;grid-template-columns:1fr 1fr;}
        .fi{padding:13px 16px;border:none;border-bottom:1px solid var(--linelt);font-family:var(--sans);font-size:13px;color:#0a0a0a;background:#fff;outline:none;width:100%;font-weight:300;-webkit-appearance:none;transition:border-color 0.3s ease,padding-left 0.3s ease;}
        .fi::placeholder{color:var(--ink3);transition:opacity 0.3s ease,transform 0.3s ease;}
        .fi:focus{background:#fff;border-bottom-color:#0a0a0a;padding-left:20px;}
        .fi:focus::placeholder{opacity:0;transform:translateX(10px);}
        .fi.err{border-bottom-color:#c0392b;}
        .fi-r{border-right:1px solid var(--linelt);}
        .fi-last{border-bottom:none;}
        .error-msg{font-family:var(--mono);font-size:9px;letter-spacing:1px;color:#c0392b;margin-top:8px;max-width:400px;}
        .submit-btn{width:100%;max-width:400px;padding:14px 18px;background:#0a0a0a;color:#fff;border:none;font-family:var(--mono);font-size:10px;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:background 0.15s ease;}
        .submit-btn:hover{background:#1a1a1a;}
        .submit-btn .arrow{display:inline-block;transition:transform 0.2s ease;}
        .submit-btn:hover .arrow{transform:translateX(4px);}
        .submit-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .sign-in-btn{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);margin-top:12px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:color 0.15s;background:none;border:none;padding:0;}
        .sign-in-btn:hover{color:#0a0a0a;}
        .success-block{max-width:400px;padding:24px;border:1px solid var(--linelt);border-radius:2px;background:#fff;}
        .sb-check{width:18px;height:18px;border-radius:50%;background:var(--cyan);display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
        .sb-title{font-family:var(--serif);font-size:20px;color:#0a0a0a;margin-bottom:6px;}
        .sb-sub{font-size:12px;color:var(--ink2);font-weight:300;line-height:1.7;}
        .sb-manifesto{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--cyan);margin-top:14px;padding-top:14px;border-top:1px solid var(--linelt);}
        .sec-label{font-family:var(--mono);font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--ink3);margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--linelt);width:100%;max-width:260px;}
        .circle-vis{position:relative;width:210px;height:210px;margin:0 auto 24px;}
        .ring{position:absolute;border-radius:50%;border:1px solid;}
        @keyframes slowSpin{100%{transform:rotate(360deg);}}
        @keyframes corePulse{0%,100%{box-shadow:0 0 0px rgba(0,194,212,0),inset 0 0 0px rgba(0,194,212,0);}33%{box-shadow:0 0 14px rgba(0,194,212,0.45),inset 0 0 4px rgba(0,194,212,0.2);}}
        @media(prefers-reduced-motion:no-preference){.r1{animation:slowSpin 9s linear infinite;}.r2{animation:slowSpin 6s linear infinite reverse;}}
        .r1{width:210px;height:210px;top:0;left:0;border-color:rgba(10,10,10,0.14);}
        .r2{width:140px;height:140px;top:35px;left:35px;border-color:rgba(10,10,10,0.28);}
        .r3{width:74px;height:74px;top:68px;left:68px;border-color:rgba(10,10,10,0.5);}
        .r-core{width:26px;height:26px;top:92px;left:92px;background:#0a0a0a;border-color:#0a0a0a;animation:corePulse 3s cubic-bezier(0.25,0.1,0.25,1) infinite;}
        .rl{position:absolute;font-family:var(--mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);white-space:nowrap;left:50%;transform:translateX(-50%);}
        .rl-1{top:-13px;}.rl-2{top:21px;color:#888;}.rl-3{top:62px;color:#0a0a0a;}
        .tier-rows{width:100%;max-width:260px;}
        .tier-row{display:grid;grid-template-columns:1fr auto;padding:10px 0;border-bottom:1px solid var(--linelt);transition:padding-left 0.2s ease,border-bottom-color 0.2s ease,background-color 0.2s ease;cursor:crosshair;}
        .tier-row:last-child{border-bottom:none;}
        .tier-row:hover:nth-child(1){padding-left:8px;background-color:#faf5e6;border-bottom-color:#e8dcb8;}
        .tier-row:hover:nth-child(2){padding-left:8px;background-color:#fdf5f7;border-bottom-color:#f0dbe0;}
        .tier-row:hover:nth-child(3){padding-left:8px;background-color:#f0f7f4;border-bottom-color:#dcece4;}
        .tr-name{font-family:var(--mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;}
        .tr-name.ic{color:var(--cyan);}.tr-name.wave{color:var(--ink2);}.tr-name.street{color:var(--ink3);}
        .tr-price{font-family:var(--mono);font-size:9px;color:#0a0a0a;}
        .geo-tease{max-width:260px;width:100%;margin-top:8px;padding:14px 16px;border:1px solid var(--linelt);border-radius:2px;background:#fff;}
        .geo-label{font-family:var(--mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:6px;}
        .geo-text{font-size:11px;color:var(--ink2);font-weight:300;line-height:1.6;}
        .geo-text span{color:var(--cyan);}
        .compare{background:var(--off);padding:0 60px 52px;}
        .compare-label{font-family:var(--mono);font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--ink3);padding:28px 0 12px;border-bottom:1px solid var(--linelt);}
        .table-outer{overflow-x:auto;margin:16px 0;}
        .table-wrap{width:100%;border:1px solid var(--linelt);border-radius:2px;overflow:hidden;min-width:560px;}
        .t-head{display:grid;grid-template-columns:140px 1.5fr 1fr 1.2fr;background:var(--off);border-bottom:1px solid var(--linelt);}
        .th{font-family:var(--mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);padding:9px 13px;display:flex;align-items:center;}
        .th:last-child{justify-content:flex-end;}
        .t-row{display:grid;grid-template-columns:140px 1.5fr 1fr 1.2fr;border-bottom:1px solid var(--linelt);background:#fff;transition:background 0.1s;}
        .t-row:last-child{border-bottom:none;}.t-row.dc{background:#f0fdfe;}
        .t-row:hover{background:#f6f6f4;}.t-row.dc:hover{background:#e6fbfd;}
        .div-label{font-family:var(--mono);font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);padding:7px 13px;background:var(--off);border-bottom:1px solid var(--linelt);border-top:1px solid var(--linelt);}
        .td{padding:12px 13px;font-size:12px;display:flex;align-items:center;}
        .td:last-child{justify-content:flex-end;}
        .td-p{font-weight:500;color:#0a0a0a;}.td-p.dc{color:var(--cyan);}
        .td-m{font-size:11px;color:var(--ink2);font-weight:300;}
        .mono{font-family:var(--mono);font-size:10px;}
        .red{color:#c0392b;}.orange{color:#e67e22;}.cyan-t{color:var(--cyan);font-weight:700;}
        .fn-wrap{display:flex;flex-direction:column;gap:6px;}
        .fn{display:flex;gap:8px;font-family:var(--mono);font-size:8px;color:var(--ink3);line-height:1.7;}
        .fn span:first-child{color:var(--cyan);flex-shrink:0;}
        @media(max-width:768px){
          .nav{padding:24px 20px 18px;}
          .hero-black{padding:48px 24px 60px;}
          .you-block{grid-template-columns:1fr;padding:48px 24px;gap:0;}
          .you-col{border-right:none;border-bottom:1px solid var(--line);padding:32px 0 !important;}
          .you-col:last-child{border-bottom:none;}
          .manifesto-strip{grid-template-columns:1fr;}
          .m-col{border-right:none;border-bottom:1px solid var(--line);}
          .m-col:last-child{border-bottom:none;}
          .two-col{grid-template-columns:1fr;min-height:unset;}
          .col-l{padding:36px 24px;border-right:none;border-bottom:1px solid var(--linelt);justify-content:flex-start;}
          .col-r{padding:36px 24px;align-items:flex-start;}
          .sec-label,.tier-rows,.geo-tease{max-width:100%;}
          .compare{padding:0 24px 40px;}
          .f-row-2{grid-template-columns:1fr;}
          .fi-r{border-right:none;border-bottom:1px solid var(--linelt);}
          .form-wrap,.submit-btn{max-width:100%;}
          .lock-bar{flex-direction:column;align-items:flex-start;gap:4px;}
        }
      `}</style>

      <nav className="nav grain">
        <svg width="42" height="27" viewBox="0 0 42 27" fill="none" aria-hidden="true">
          <circle cx="14" cy="13.5" r="12.5" stroke="rgba(245,242,238,0.55)" strokeWidth="1"/>
          <circle cx="28" cy="13.5" r="12.5" stroke="rgba(245,242,238,0.55)" strokeWidth="1"/>
        </svg>
        <div className="wordmark">DropCircles</div>
      </nav>

      <div className="hero-black grain">
        <div className="invite-badge">Ecosystem locked · Beta</div>
        <h1 className="hero-title">No platform.<br/>No permission.<br/><em>No performance.</em></h1>
        <div className="hero-sub">The ecosystem is currently locked. 100 founding Visionaries only. Your music, their ears, first.</div>
      </div>

      <div className="manifesto-moment grain">
        <div className="you-block">
          <div className="you-col">
            <div className="you-verb">You create.</div>
            <div className="you-desc">Unreleased tracks, snippets, voice notes — yours to drop whenever you're ready. No release schedule. No label approval.</div>
          </div>
          <div className="you-col">
            <div className="you-verb">You invite.</div>
            <div className="you-desc">Three circles. You choose who gets in. Inner Circle, Wave, Street. Your rules. Your community. No algorithm decides your reach.</div>
          </div>
          <div className="you-col">
            <div className="you-verb">You collect.</div>
            <div className="you-desc">Money moves directly to your account — before the world hears a note. We take 5%. That's it. No monthly fee. No permission needed.</div>
          </div>
        </div>
      </div>

      <div className="manifesto-strip grain">
        <div className="m-col">
          <div className="m-num">01</div>
          <div className="m-text">A closed-circuit infrastructure. No algorithms. No platform tax. No gatekeepers.</div>
        </div>
        <div className="m-col">
          <div className="m-num">02</div>
          <div className="m-text">Direct-to-vault drops. Your superfans pay you — before the world gets access.</div>
        </div>
        <div className="m-col">
          <div className="m-num">03</div>
          <div className="m-text">We take 5%. Patreon takes 12%. Bandcamp takes 15%. The math is not close.</div>
        </div>
      </div>

      <div className="light">
        <div className="two-col">
          <div className="col-l">
            <div>
              <h2 className="col-hed">Your music,<br/><em>their ears,</em><br/>first.</h2>
              <p className="col-sub">Every platform between you and your fan is a toll booth. DropCircles removes the toll. Your superfans pay you directly — before anyone else hears the music. We take 5%. That's it. No monthly fee. No algorithm deciding your reach.</p>
              <div className="lock-bar">
                <span>Beta · 100 Visionaries total</span>
                <span><span className="lock-spots">100 spots</span> · first come, first in</span>
              </div>
              {!submitted ? (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-wrap">
                    <div className="f-row-2">
                      <div><label className="sr-only" htmlFor="f-name">Artist name</label><input className="fi fi-r" type="text" id="f-name" placeholder="Artist name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoComplete="name"/></div>
                      <div><label className="sr-only" htmlFor="f-genre">Genre</label><input className="fi" type="text" id="f-genre" placeholder="Genre" value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}/></div>
                    </div>
                    <div><label className="sr-only" htmlFor="f-email">Email address</label><input className="fi" type="email" id="f-email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} autoComplete="email"/></div>
                    <div><label className="sr-only" htmlFor="f-handle">Social handle</label><input className="fi" type="text" id="f-handle" placeholder="Instagram or SoundCloud handle" value={form.handle} onChange={e => setForm({...form, handle: e.target.value})}/></div>
                    <div><label className="sr-only" htmlFor="f-city">City</label><input className="fi fi-last" type="text" id="f-city" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} autoComplete="address-level2"/></div>
                  </div>
                  {error && <div className="error-msg" role="alert">{error}</div>}
                  <button className="submit-btn" type="submit" disabled={loading}>
                    <span>{loading ? 'Requesting...' : 'Request vault access'}</span>
                    <span className="arrow" aria-hidden="true">→</span>
                  </button>
                </form>
              ) : (
                <div className="success-block" role="status">
                  <div className="sb-check" aria-hidden="true"><svg width="9" height="9" viewBox="0 0 9 9" fill="none"><polyline points="1 4.5 3.5 7 8 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
                  <div className="sb-title">You're in the vault.</div>
                  <div className="sb-sub">We'll reach out to <strong>{form.email}</strong> personally when your spot opens. No bulk invites. One artist at a time.</div>
                  <div className="sb-manifesto">Experience infinite greatness — here, today.</div>
                </div>
              )}
              <button className="sign-in-btn" type="button">Already approved? Sign in →</button>
            </div>
          </div>
          <div className="col-r">
            <div className="sec-label">The circle structure</div>
            <div className="circle-vis" aria-hidden="true">
              <div className="ring r1"></div><div className="ring r2"></div>
              <div className="ring r3"></div><div className="ring r-core"></div>
              <div className="rl rl-1">Street — free</div>
              <div className="rl rl-2">Wave — 48hr</div>
              <div className="rl rl-3">Inner Circle</div>
            </div>
            <div className="tier-rows">
              <div className="tier-row"><span className="tr-name ic">Inner Circle</span><span className="tr-price">You set the price</span></div>
              <div className="tier-row"><span className="tr-name wave">Wave</span><span className="tr-price">You set the price</span></div>
              <div className="tier-row"><span className="tr-name street">Street</span><span className="tr-price">Always free</span></div>
            </div>
            <div className="geo-tease">
              <div className="geo-label">Coming soon · Geo drops</div>
              <div className="geo-text">Drop to fans in <span>Tampa</span>, <span>Atlanta</span>, or any city before it goes global. Build local heat before the world hears it.</div>
            </div>
          </div>
        </div>
        <div className="compare">
          <div className="compare-label">Platform comparison — what you actually keep per $1 earned</div>
          <div className="table-outer">
            <div className="table-wrap">
              <div className="t-head">
                <div className="th">Platform</div><div className="th">Model</div><div className="th">Their cut</div><div className="th">You keep</div>
              </div>
              <div className="div-label">Streaming — paid per play</div>
              <div className="t-row"><div className="td td-p">Spotify</div><div className="td td-m">Per stream · algorithmic reach</div><div className="td mono red">$0.003 / stream</div><div className="td mono red">333 streams = $1</div></div>
              <div className="t-row"><div className="td td-p">YouTube</div><div className="td td-m">Per view · ad revenue share</div><div className="td mono red">$0.001–$0.008 / view</div><div className="td mono red">~125k views = $100</div></div>
              <div className="div-label">Fan platforms — take a % of what you earn</div>
              <div className="t-row"><div className="td td-p">Patreon</div><div className="td td-m">Fan subscriptions · general</div><div className="td mono red">8–12%</div><div className="td mono red">88¢ of every $1</div></div>
              <div className="t-row"><div className="td td-p">Bandcamp</div><div className="td td-m">Sales + subscriptions</div><div className="td mono red">15%</div><div className="td mono red">85¢ of every $1</div></div>
              <div className="t-row"><div className="td td-p">SoundCloud</div><div className="td td-m">Streaming · plan required</div><div className="td mono orange">$2.50 / 1k streams</div><div className="td mono orange">Fan pays nothing</div></div>
              <div className="div-label">DropCircles — direct fan payments, pre-release, music-first</div>
              <div className="t-row dc"><div className="td td-p dc">DropCircles</div><div className="td td-m">Direct · pre-release · tiered circles</div><div className="td mono cyan-t">5% only</div><div className="td mono cyan-t">95¢ of every $1</div></div>
            </div>
          </div>
          <div className="fn-wrap">
            <div className="fn"><span>*</span><span>Stripe processing (~2.9% + 30¢) applies to all direct payment platforms including DropCircles. It's the cost of moving money, not our fee. We don't hide it.</span></div>
            <div className="fn"><span>*</span><span>Spotify and YouTube payouts vary by country, listener tier, and distribution deal. Figures represent published industry averages.</span></div>
            <div className="fn"><span>*</span><span>DropCircles charges no monthly fee to join. The 5% only applies when you make money. If your fans pay you $0, you pay us $0.</span></div>
          </div>
        </div>
      </div>
    </>
  )
}
