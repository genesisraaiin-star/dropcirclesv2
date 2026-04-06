import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { DropsGrid, ErrorBanner } from './drops-grid'

export const revalidate = 30

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params
  const supabase = createServiceClient()
  const { data: artist } = await supabase
    .from('artists')
    .select('name, bio, genre')
    .eq('handle', handle)
    .single()

  if (!artist) return { title: 'DropCircles' }
  return {
    title: `${artist.name} — DropCircles`,
    description: artist.bio || `Unreleased drops from ${artist.name}`,
  }
}

export default async function StorefrontPage({ params, searchParams }: Props) {
  const { handle } = await params
  const sp = await searchParams
  const error = typeof sp.error === 'string' ? sp.error : undefined

  const supabase = createServiceClient()

  const { data: artist } = await supabase
    .from('artists')
    .select('id, name, handle, bio, genre, city, accent_color, instagram, twitter, spotify, website')
    .eq('handle', handle)
    .single()

  if (!artist) notFound()

  const now = new Date().toISOString()
  const { data: circles } = await supabase
    .from('circles')
    .select('id, title, description, price, expires_at, assets, circle_tier')
    .eq('artist_id', artist.id)
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false })

  const accent = artist.accent_color || '#00c2d4'
  const drops = circles || []

  const socialLinks = [
    { href: artist.instagram, label: 'Instagram' },
    { href: artist.twitter, label: 'X' },
    { href: artist.spotify, label: 'Spotify' },
    { href: artist.website, label: 'Web' },
  ].filter(s => s.href)

  return (
    <div
      className="min-h-screen text-[#f5f2ee]"
      style={{ backgroundColor: '#080808', fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
          opacity: 0.035,
        }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse at top, ${accent}14 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <div className="pt-16 pb-12">
          <div className="flex items-start gap-5 mb-8">
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: `${accent}18`,
                color: accent,
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              {artist.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1
                className="text-3xl md:text-4xl font-normal tracking-tight leading-none mb-1.5 text-[#f5f2ee]"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {artist.name}
              </h1>
              <p className="text-xs font-mono" style={{ color: `${accent}60` }}>
                @{artist.handle}
                {artist.city && <span className="text-[#f5f2ee]/20 ml-2">· {artist.city}</span>}
                {artist.genre && <span className="text-[#f5f2ee]/20 ml-2">· {artist.genre}</span>}
              </p>
            </div>
          </div>

          {artist.bio && (
            <p className="text-sm text-[#f5f2ee]/50 leading-relaxed max-w-lg mb-6">{artist.bio}</p>
          )}

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-5">
              {socialLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.2em] font-mono transition-colors"
                  style={{ color: `${accent}50` }}
                >
                  {label} ↗
                </a>
              ))}
            </div>
          )}

          <div className="mt-10 h-px" style={{ backgroundColor: `${accent}12` }} />
        </div>

        <div className="pb-20">
          {error && <ErrorBanner error={error} />}
          {drops.length > 0 ? (
            <DropsGrid circles={drops} accent={accent} handle={handle} />
          ) : (
            <div className="text-center py-24">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
                style={{ backgroundColor: `${accent}08`, border: `1px solid ${accent}18`, color: `${accent}30` }}
              >
                ○
              </div>
              <h3
                className="text-xl font-normal mb-2"
                style={{ fontFamily: "'DM Serif Display', serif", color: `${accent}50` }}
              >
                Nothing dropped yet.
              </h3>
              <p className="text-sm text-[#f5f2ee]/20">Check back soon.</p>
            </div>
          )}
        </div>

        <div className="border-t py-8 flex items-center justify-between" style={{ borderColor: '#f5f2ee08' }}>
          <a href="/" className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#f5f2ee]/12 hover:text-[#f5f2ee]/35 transition-colors">
            DropCircles
          </a>
          <p className="text-[9px] font-mono text-[#f5f2ee]/10">Pre-release. Direct.</p>
        </div>
      </div>
    </div>
  )
}
