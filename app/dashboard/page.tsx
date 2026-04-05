import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const initials = artist?.name
    ? artist.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        :root{--bg:#f9f8f6;--ink:#0a0a0a;--ink2:#6b6b6b;--ink3:#b0b0b0;--cyan:#00c2d4;--line:rgba(10,10,10,0.12);--white:#ffffff;--serif:'DM Serif Display',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--mono:'Space Mono',monospace;}
        html,body{height:100%;background:var(--bg);}
        body{font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased;}
        .shell{display:grid;grid-template-columns:220px 1fr;min-height:100vh;}
        .sidebar{background:var(--white);border-right:1px solid var(--line);padding:28px 0;display:flex;flex-direction:column;}
        .sidebar-logo{padding:0 20px 24px;border-bottom:1px solid var(--line);margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .sidebar-wordmark{font-family:var(--sans);font-weight:300;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--ink);opacity:0.5;}
        .artist-block{padding:0 20px 24px;border-bottom:1px solid var(--line);margin-bottom:20px;}
        .artist-avatar{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;color:var(--ink2);margin-bottom:10px;}
        .artist-name{font-size:13px;font-weight:500;color:var(--ink);}
        .artist-tag{font-family:var(--mono);font-size:9px;color:var(--cyan);letter-spacing:1.5px;text-transform:uppercase;margin-top:3px;}
        .nav-links{display:flex;flex-direction:column;padding:0 12px;gap:2px;}
        .nav-link{font-family:var(--mono);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);padding:10px 12px;border-radius:2px;cursor:pointer;transition:all 0.1s;text-decoration:none;display:block;}
        .nav-link:hover{background:var(--bg);color:var(--ink);}
        .nav-link.active{color:var(--ink);}
        .sidebar-footer{margin-top:auto;padding:20px 20px 0;border-top:1px solid var(--line);}
        .signout-btn{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(10,10,10,0.25);background:none;border:none;cursor:pointer;padding:0;transition:color 0.15s;}
        .signout-btn:hover{color:var(--ink);}
        .main{background:var(--bg);padding:44px 52px;}
        .page-header{margin-bottom:44px;padding-bottom:24px;border-bottom:1px solid var(--line);}
        .page-title{font-family:var(--serif);font-size:44px;font-weight:400;letter-spacing:-0.5px;line-height:1;color:var(--ink);}
        .page-sub{font-family:var(--mono);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-top:8px;}
        .setup-card{background:var(--white);border:1px solid var(--line);border-radius:2px;padding:36px;max-width:520px;}
        .setup-label{font-family:var(--mono);font-size:8px;letter-spacing:3px;text-transform:uppercase;color:var(--cyan);margin-bottom:16px;}
        .setup-title{font-family:var(--serif);font-size:28px;font-weight:400;color:var(--ink);margin-bottom:10px;}
        .setup-sub{font-size:13px;color:var(--ink2);font-weight:300;line-height:1.7;margin-bottom:28px;}
        .setup-steps{display:flex;flex-direction:column;gap:0;margin-bottom:28px;border:1px solid var(--line);border-radius:2px;overflow:hidden;}
        .setup-step{display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid var(--line);font-size:12px;color:var(--ink2);}
        .setup-step:last-child{border-bottom:none;}
        .step-num{width:22px;height:22px;border-radius:50%;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:9px;color:var(--ink3);flex-shrink:0;}
        .setup-btn{padding:13px 24px;background:var(--ink);color:var(--white);border:none;font-family:var(--mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background 0.15s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}
        .setup-btn:hover{background:#1a1a1a;}
        .arrow{display:inline-block;transition:transform 0.2s ease;}
        .setup-btn:hover .arrow{transform:translateX(3px);}
        @media(max-width:768px){.shell{grid-template-columns:1fr;}.sidebar{display:none;}.main{padding:28px 24px;}}
      `}</style>

      <div className="shell">
        <div className="sidebar">
          <div className="sidebar-logo">
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="rgba(10,10,10,0.3)" strokeWidth="1"/>
              <circle cx="19" cy="9" r="8" stroke="rgba(10,10,10,0.3)" strokeWidth="1"/>
            </svg>
            <span className="sidebar-wordmark">DropCircles</span>
          </div>
          <div className="artist-block">
            <div className="artist-avatar">{initials}</div>
            <div className="artist-name">{artist?.name ?? user.email}</div>
            <div className="artist-tag">Visionary</div>
          </div>
          <div className="nav-links">
            <a className="nav-link active" href="/dashboard">Drops</a>
            <a className="nav-link" href="/dashboard/circles">Circles</a>
            <a className="nav-link" href="/dashboard/revenue">Revenue</a>
            <a className="nav-link" href="/dashboard/fans">Fans</a>
            <a className="nav-link" href="/dashboard/settings">Settings</a>
          </div>
          <div className="sidebar-footer">
            <form action="/auth/signout" method="post">
              <button className="signout-btn" type="submit">Sign out</button>
            </form>
          </div>
        </div>
        <div className="main">
          <div className="page-header">
            <div className="page-title">Welcome.</div>
            <div className="page-sub">You're inside the vault — let's set up your circles</div>
          </div>
          <div className="setup-card">
            <div className="setup-label">Getting started</div>
            <div className="setup-title">Three steps to your first drop.</div>
            <div className="setup-sub">Your dashboard is ready. Complete these steps to start receiving fan payments before your music goes public.</div>
            <div className="setup-steps">
              <div className="setup-step"><div className="step-num">1</div><span>Complete your artist profile — name, bio, genre</span></div>
              <div className="setup-step"><div className="step-num">2</div><span>Connect Stripe to receive direct fan payments</span></div>
              <div className="setup-step"><div className="step-num">3</div><span>Upload your first drop and set your circle pricing</span></div>
            </div>
            <a href="/dashboard/onboarding" className="setup-btn">Start setup <span className="arrow">→</span></a>
          </div>
        </div>
      </div>
    </>
  )
}
