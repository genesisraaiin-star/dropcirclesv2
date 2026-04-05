'use client'
import { useState } from 'react'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', handle: '', email: '', genre: '', city: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from('waitlist').insert({
      name: form.name,
      email: form.email,
      handle: form.handle,
      genre: form.genre,
      city: form.city,
    })

    if (error && error.code !== '23505') {
      alert('Something went wrong. Try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',background:'#f9f8f6',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'22px 48px',borderBottom:'0.5px solid #e0deda'}}>
        <div style={{fontSize:'13px',fontWeight:300,letterSpacing:'4px',textTransform:'uppercase'}}>
          Drop<span style={{color:'#00c2d4',fontWeight:500}}>●</span>Circle
        </div>
        <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'#b0b0b0'}}>
          Invite only · Beta
        </div>
      </nav>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 65px)'}}>
        <div style={{padding:'80px 48px 80px 60px',borderRight:'0.5px solid #e0deda',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'#b0b0b0',marginBottom:'24px',display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#00c2d4',display:'inline-block'}}></span>
              Invite-only beta — now open
            </div>
            <div style={{fontFamily:'Georgia,serif',fontSize:'clamp(56px,7vw,88px)',lineHeight:1,letterSpacing:'-1px',marginBottom:'28px',color:'#0a0a0a'}}>
              Your music,<br/><em style={{fontStyle:'italic',color:'#6b6b6b'}}>their ears,</em><br/>first.
            </div>
            <p style={{fontSize:'15px',color:'#6b6b6b',lineHeight:1.8,maxWidth:'400px',marginBottom:'48px',fontWeight:300}}>
              A private layer between you and the world. Drop unreleased music to the fans who matter most — <strong style={{color:'#0a0a0a',fontWeight:500}}>before anyone else hears it.</strong> Money goes straight to you.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0',maxWidth:'400px',border:'0.5px solid #e0deda',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
                  <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Artist name" style={{padding:'14px 18px',border:'none',borderBottom:'0.5px solid #e0deda',borderRight:'0.5px solid #e0deda',fontFamily:'system-ui,sans-serif',fontSize:'13px',background:'white',outline:'none',color:'#0a0a0a'}}/>
                  <input required value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} placeholder="Genre" style={{padding:'14px 18px',border:'none',borderBottom:'0.5px solid #e0deda',fontFamily:'system-ui,sans-serif',fontSize:'13px',background:'white',outline:'none',color:'#0a0a0a'}}/>
                </div>
                <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email address" style={{padding:'14px 18px',border:'none',borderBottom:'0.5px solid #e0deda',fontFamily:'system-ui,sans-serif',fontSize:'13px',background:'white',outline:'none',color:'#0a0a0a'}}/>
                <input value={form.handle} onChange={e=>setForm({...form,handle:e.target.value})} placeholder="Instagram or SoundCloud handle" style={{padding:'14px 18px',border:'none',borderBottom:'0.5px solid #e0deda',fontFamily:'system-ui,sans-serif',fontSize:'13px',background:'white',outline:'none',color:'#0a0a0a'}}/>
                <input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="City" style={{padding:'14px 18px',border:'none',borderBottom:'0.5px solid #e0deda',fontFamily:'system-ui,sans-serif',fontSize:'13px',background:'white',outline:'none',color:'#0a0a0a'}}/>
                <button type="submit" disabled={loading} style={{padding:'15px 20px',background:'#0a0a0a',color:'white',border:'none',fontFamily:'system-ui,sans-serif',fontSize:'11px',fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>{loading ? 'Requesting...' : 'Request access'}</span>
                  <span style={{fontSize:'18px'}}>→</span>
                </button>
              </form>
            ) : (
              <div style={{maxWidth:'400px',padding:'28px',background:'white',border:'0.5px solid #e0deda',borderRadius:'3px'}}>
                <div style={{width:'20px',height:'20px',borderRadius:'50%',background:'#00c2d4',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'12px'}}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5 5 4 7.5 8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div style={{fontSize:'16px',fontWeight:500,color:'#0a0a0a',marginBottom:'6px'}}>You're on the list.</div>
                <div style={{fontSize:'13px',color:'#6b6b6b',fontWeight:300,lineHeight:1.6}}>We'll reach out to <strong style={{color:'#0a0a0a'}}>{form.email}</strong> when your spot opens. We're letting in artists one by one.</div>
              </div>
            )}
          </div>

          <div style={{display:'flex',gap:'48px',paddingTop:'40px',borderTop:'0.5px solid #e0deda',marginTop:'48px'}}>
            {[['847','Artists waiting'],['12','Spots remaining'],['0%','Platform cut']].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:'Georgia,serif',fontSize:'36px',color: n==='12' ? '#00c2d4' : '#0a0a0a',lineHeight:1}}>{n}</div>
                <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'#b0b0b0',marginTop:'4px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{padding:'80px 48px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'52px'}}>
          <div style={{position:'relative',width:'280px',height:'280px'}}>
            {[280,188,100].map((size,i)=>(
              <div key={size} style={{position:'absolute',borderRadius:'50%',border:'0.5px solid',borderColor:['#e0deda','#c0bcb8','#b0b0b0'][i],width:size,height:size,top:(280-size)/2,left:(280-size)/2}}/>
            ))}
            <div style={{position:'absolute',width:'36px',height:'36px',borderRadius:'50%',background:'#0a0a0a',top:'122px',left:'122px'}}/>
            {[['Street',-18],['Wave',28],['Inner Circle',82]].map(([label,top])=>(
              <div key={label} style={{position:'absolute',fontSize:'9px',letterSpacing:'2.5px',textTransform:'uppercase',color: label==='Inner Circle' ? '#0a0a0a' : '#b0b0b0',top,left:'50%',transform:'translateX(-50%)',whiteSpace:'nowrap'}}>{label}</div>
            ))}
          </div>

          <div style={{width:'100%',maxWidth:'300px'}}>
            {[['Inner Circle','First access · everything','#00c2d4'],['Wave','48 hr delay · mid tier','#6b6b6b'],['Street','Free · tips only','#b0b0b0']].map(([name,desc,color])=>(
              <div key={name} style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',padding:'16px 0',borderBottom:'0.5px solid #e0deda'}}>
                <div style={{fontSize:'12px',letterSpacing:'2px',textTransform:'uppercase',color,fontWeight:400}}>{name}</div>
                <div style={{fontSize:'12px',color:'#b0b0b0',fontWeight:300}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}