'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type Artist = {
  id: string;
  name: string;
  handle: string;
  bio: string | null;
  genre: string | null;
  city: string | null;
  accent_color: string | null;
  instagram: string | null;
  twitter: string | null;
  spotify: string | null;
  website: string | null;
};

type Circle = {
  id: string;
  title: string;
  description: string;
  price: number;
  circle_tier: string | null;
  is_active: boolean;
  expires_at: string | null;
  assets: string[] | null;
};

const TIER_ORDER = ['origin', 'wave', 'open'];

function TierBadge({ tier, accent }: { tier: string; accent: string }) {
  const labels: Record<string, string> = {
    origin: 'Origin',
    wave: 'Wave',
    open: 'Open',
  };
  return (
    <span
      className="text-[9px] uppercase tracking-[0.25em] font-mono px-2 py-0.5 rounded"
      style={{ backgroundColor: `${accent}15`, color: accent }}
    >
      {labels[tier] || tier}
    </span>
  );
}

function HypeTimer({ expiresAt, accent }: { expiresAt: string; accent: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <span
      className="text-[9px] font-mono tracking-[0.15em] px-2 py-0.5 rounded animate-pulse"
      style={{ backgroundColor: '#f9731610', color: '#f97316' }}
    >
      ⏱ {timeLeft}
    </span>
  );
}

export default function FanPortal() {
  const params = useParams();
  const handle = params.handle as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: artistData } = await supabase
        .from('artists')
        .select('*')
        .eq('handle', handle)
        .single();

      if (!artistData) { setNotFound(true); setLoading(false); return; }
      setArtist(artistData);

      const { data: circleData } = await supabase
        .from('circles')
        .select('*')
        .eq('artist_id', artistData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const now = new Date();
      const live = (circleData || []).filter((c: Circle) =>
        !c.expires_at || new Date(c.expires_at) > now
      );

      // Sort by tier order
      live.sort((a: Circle, b: Circle) => {
        const ai = TIER_ORDER.indexOf(a.circle_tier || 'open');
        const bi = TIER_ORDER.indexOf(b.circle_tier || 'open');
        return ai - bi;
      });

      setCircles(live);
      setLoading(false);
    }
    if (handle) load();
  }, [handle]);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border border-[#f5f2ee]/10 border-t-[#f5f2ee]/40 animate-spin mx-auto mb-4" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#f5f2ee]/20 font-mono">Loading...</p>
      </div>
    </div>
  );

  if (notFound || !artist) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full border border-[#f5f2ee]/8 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-[#f5f2ee]/20">○</span>
        </div>
        <h1 className="text-2xl font-normal text-[#f5f2ee]/60 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
          No one here.
        </h1>
        <p className="text-sm text-[#f5f2ee]/25 font-mono">@{handle} hasn't dropped into DropCircles yet.</p>
        <a
          href="/"
          className="inline-block mt-8 text-[10px] uppercase tracking-[0.25em] font-mono text-[#f5f2ee]/30 hover:text-[#f5f2ee]/60 transition-colors"
        >
          ← DropCircles
        </a>
      </div>
    </div>
  );

  const accent = artist.accent_color || '#00c2d4';

  const hypeDrops = circles.filter(c => c.expires_at);
  const regularDrops = circles.filter(c => !c.expires_at);

  const socialLinks = [
    { href: artist.instagram, label: 'IG' },
    { href: artist.twitter, label: 'X' },
    { href: artist.spotify, label: 'Spotify' },
    { href: artist.website, label: 'Web' },
  ].filter(s => s.href);

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f2ee]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Grain */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
        opacity: 0.035,
      }} />

      {/* Ambient glow behind header */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at top, ${accent}18 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6">

        {/* Artist header */}
        <div className="pt-16 pb-12">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0 flex items-center justify-center text-2xl md:text-3xl font-bold"
              style={{ backgroundColor: `${accent}20`, color: accent, fontFamily: "'DM Serif Display', serif" }}
            >
              {artist.name[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h1
                className="text-3xl md:text-4xl font-normal tracking-tight leading-none mb-1.5"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {artist.name}
              </h1>
              <p className="text-xs font-mono mb-3" style={{ color: `${accent}70` }}>
                @{artist.handle}
                {artist.city && <span className="text-[#f5f2ee]/25 ml-2">· {artist.city}</span>}
                {artist.genre && <span className="text-[#f5f2ee]/25 ml-2">· {artist.genre}</span>}
              </p>
              {artist.bio && (
                <p className="text-sm text-[#f5f2ee]/50 leading-relaxed max-w-md">{artist.bio}</p>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-4 mt-4">
                  {socialLinks.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-[0.2em] font-mono transition-colors"
                      style={{ color: `${accent}60` }}
                      onMouseEnter={e => (e.currentTarget.style.color = accent)}
                      onMouseLeave={e => (e.currentTarget.style.color = `${accent}60`)}
                    >
                      {label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 h-px" style={{ backgroundColor: `${accent}15` }} />
        </div>

        {/* Hype drops (time-sensitive first) */}
        {hypeDrops.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#f5f2ee]/30">
                Hype Drops
              </p>
              <div className="flex-1 h-px bg-[#f97316]/15" />
              <span className="text-[9px] font-mono text-[#f97316]/60">Disappears soon</span>
            </div>
            <div className="space-y-3">
              {hypeDrops.map(circle => (
                <CircleCard key={circle.id} circle={circle} accent={accent} isHype />
              ))}
            </div>
          </section>
        )}

        {/* Regular drops */}
        {regularDrops.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#f5f2ee]/30">
                Active Circles
              </p>
              <div className="flex-1 h-px" style={{ backgroundColor: `${accent}15` }} />
            </div>
            <div className="space-y-3">
              {regularDrops.map(circle => (
                <CircleCard key={circle.id} circle={circle} accent={accent} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {circles.length === 0 && (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${accent}08`, border: `1px solid ${accent}20` }}
            >
              <span className="text-xl" style={{ color: `${accent}40` }}>○</span>
            </div>
            <h3
              className="text-xl font-normal mb-2"
              style={{ fontFamily: "'DM Serif Display', serif", color: `${accent}60` }}
            >
              No drops yet.
            </h3>
            <p className="text-sm text-[#f5f2ee]/25">
              {artist.name} hasn't made any circles active. Check back soon.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#f5f2ee]/5 py-8 flex items-center justify-between">
          <a href="/" className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#f5f2ee]/15 hover:text-[#f5f2ee]/40 transition-colors">
            DropCircles
          </a>
          <p className="text-[10px] font-mono text-[#f5f2ee]/10">Pre-release. Direct.</p>
        </div>

      </div>
    </div>
  );
}

function CircleCard({ circle, accent, isHype }: { circle: Circle; accent: string; isHype?: boolean }) {
  const hasAudio = circle.assets && circle.assets.length > 0;
  const price = circle.price;

  return (
    <div
      className="rounded-xl border p-5 transition-all group cursor-pointer"
      style={{
        borderColor: isHype ? '#f9731620' : `${accent}15`,
        backgroundColor: isHype ? '#f9731605' : `${accent}05`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = isHype ? '#f9731640' : `${accent}30`;
        (e.currentTarget as HTMLDivElement).style.backgroundColor = isHype ? '#f9731608' : `${accent}08`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = isHype ? '#f9731620' : `${accent}15`;
        (e.currentTarget as HTMLDivElement).style.backgroundColor = isHype ? '#f9731605' : `${accent}05`;
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {circle.circle_tier && <TierBadge tier={circle.circle_tier} accent={isHype ? '#f97316' : accent} />}
          {circle.expires_at && <HypeTimer expiresAt={circle.expires_at} accent={accent} />}
        </div>
        <div className="flex-shrink-0 text-right">
          {price === 0 ? (
            <span className="text-xs font-mono" style={{ color: `${accent}80` }}>Free</span>
          ) : (
            <span className="text-sm font-mono font-medium text-[#f5f2ee]/80">
              ${(price / 100).toFixed(2)}<span className="text-[10px] text-[#f5f2ee]/30">/mo</span>
            </span>
          )}
        </div>
      </div>

      <h3 className="text-base font-medium text-[#f5f2ee] mb-1.5 leading-snug">{circle.title}</h3>

      {circle.description && (
        <p className="text-sm text-[#f5f2ee]/40 leading-relaxed line-clamp-2">{circle.description}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hasAudio && (
            <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#f5f2ee]/25">
              {circle.assets!.length} track{circle.assets!.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          className="text-[10px] uppercase tracking-[0.2em] font-mono px-3 py-1.5 rounded transition-all"
          style={{
            backgroundColor: `${isHype ? '#f97316' : accent}15`,
            color: isHype ? '#f97316' : accent,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${isHype ? '#f97316' : accent}25`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${isHype ? '#f97316' : accent}15`;
          }}
        >
          {price === 0 ? 'Access Free' : 'Unlock →'}
        </button>
      </div>
    </div>
  );
}
