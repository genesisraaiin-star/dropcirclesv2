'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

const ACCENT_PRESETS = [
  { label: 'Cyan', value: '#00c2d4' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Ember', value: '#f97316' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Lime', value: '#84cc16' },
  { label: 'Gold', value: '#eab308' },
  { label: 'Slate', value: '#94a3b8' },
  { label: 'White', value: '#f5f2ee' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [handleTaken, setHandleTaken] = useState(false);
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [artistId, setArtistId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    handle: '',
    bio: '',
    genre: '',
    city: '',
    accent_color: '#00c2d4',
    instagram: '',
    twitter: '',
    spotify: '',
    website: '',
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/signin'); return; }

      const { data: artist } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!artist) { router.push('/dashboard/onboarding'); return; }

      setArtistId(artist.id);
      setForm({
        name: artist.name || '',
        handle: artist.handle || '',
        bio: artist.bio || '',
        genre: artist.genre || '',
        city: artist.city || '',
        accent_color: artist.accent_color || '#00c2d4',
        instagram: artist.instagram || '',
        twitter: artist.twitter || '',
        spotify: artist.spotify || '',
        website: artist.website || '',
      });
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const sanitizeHandle = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 32);

  const checkHandle = async (handle: string) => {
    if (!handle || handle.length < 2) return;
    setCheckingHandle(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('artists')
      .select('id')
      .eq('handle', handle)
      .neq('id', artistId)
      .maybeSingle();
    setHandleTaken(!!data);
    setCheckingHandle(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (handleTaken) return;
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { error } = await supabase
      .from('artists')
      .update({
        name: form.name,
        handle: form.handle || null,
        bio: form.bio || null,
        genre: form.genre || null,
        city: form.city || null,
        accent_color: form.accent_color,
        instagram: form.instagram || null,
        twitter: form.twitter || null,
        spotify: form.spotify || null,
        website: form.website || null,
      })
      .eq('id', artistId);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const accent = form.accent_color || '#00c2d4';

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <p className="text-[#f5f2ee]/30 text-xs tracking-[0.3em] uppercase animate-pulse font-mono">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f2ee]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
        backgroundSize: '200px',
        opacity: 0.035,
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#f5f2ee]/30 hover:text-[#f5f2ee]/70 transition-colors mb-10 font-mono"
          >
            ← Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-mono mb-3" style={{ color: accent }}>
                Artist Identity
              </p>
              <h1 className="text-4xl font-normal tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Your Profile
              </h1>
              <p className="text-[#f5f2ee]/40 text-sm mt-2">
                How fans see you. How the world finds you.
              </p>
            </div>
            {form.handle && (
              <a
                href={`/${form.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] font-mono px-3 py-2 border rounded-md transition-colors hover:opacity-80"
                style={{ borderColor: `${accent}40`, color: accent }}
              >
                View Public ↗
              </a>
            )}
          </div>
        </div>

        {/* Live preview strip */}
        <div
          className="rounded-xl p-5 mb-10 border flex items-center gap-4"
          style={{ borderColor: `${accent}20`, backgroundColor: `${accent}08` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            {form.name ? form.name[0].toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[#f5f2ee] truncate">
              {form.name || 'Your Name'}
            </div>
            <div className="text-xs font-mono truncate" style={{ color: `${accent}80` }}>
              dropcirclesv2.vercel.app/{form.handle || 'yourhandle'}
            </div>
            {form.bio && (
              <div className="text-xs text-[#f5f2ee]/40 mt-1 truncate">{form.bio}</div>
            )}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.2em] font-mono px-2 py-1 rounded"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            {form.genre || 'Genre'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Identity */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#f5f2ee]/30 mb-5">Identity</p>
            <div className="space-y-4">

              <div>
                <label className="block text-xs font-mono text-[#f5f2ee]/50 mb-2 uppercase tracking-[0.15em]">
                  Artist Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="How fans know you"
                  className="w-full bg-[#f5f2ee]/[0.04] border border-[#f5f2ee]/10 rounded-lg px-4 py-3 text-sm text-[#f5f2ee] placeholder:text-[#f5f2ee]/20 focus:outline-none focus:border-[#f5f2ee]/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#f5f2ee]/50 mb-2 uppercase tracking-[0.15em]">
                  Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f5f2ee]/30 text-sm font-mono">@</span>
                  <input
                    type="text"
                    value={form.handle}
                    onChange={e => {
                      const v = sanitizeHandle(e.target.value);
                      setForm({ ...form, handle: v });
                    }}
                    onBlur={() => checkHandle(form.handle)}
                    placeholder="yourhandle"
                    maxLength={32}
                    className="w-full bg-[#f5f2ee]/[0.04] border border-[#f5f2ee]/10 rounded-lg pl-8 pr-4 py-3 text-sm text-[#f5f2ee] placeholder:text-[#f5f2ee]/20 focus:outline-none focus:border-[#f5f2ee]/30 transition-colors font-mono"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px]">
                    {checkingHandle && <span className="text-[#f5f2ee]/30 animate-pulse">checking...</span>}
                    {!checkingHandle && handleTaken && <span className="text-red-400">taken</span>}
                    {!checkingHandle && !handleTaken && form.handle.length >= 2 && (
                      <span style={{ color: accent }}>✓</span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-[#f5f2ee]/25 font-mono mt-1.5">
                  Lowercase letters, numbers, underscores only
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#f5f2ee]/50 mb-2 uppercase tracking-[0.15em]">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="A few words about you and your sound"
                  maxLength={280}
                  className="w-full bg-[#f5f2ee]/[0.04] border border-[#f5f2ee]/10 rounded-lg px-4 py-3 text-sm text-[#f5f2ee] placeholder:text-[#f5f2ee]/20 focus:outline-none focus:border-[#f5f2ee]/30 transition-colors resize-none"
                />
                <p className="text-[10px] text-[#f5f2ee]/25 font-mono mt-1 text-right">
                  {form.bio.length}/280
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#f5f2ee]/50 mb-2 uppercase tracking-[0.15em]">Genre</label>
                  <input
                    type="text"
                    value={form.genre}
                    onChange={e => setForm({ ...form, genre: e.target.value })}
                    placeholder="Hip-hop, R&B, Electronic..."
                    className="w-full bg-[#f5f2ee]/[0.04] border border-[#f5f2ee]/10 rounded-lg px-4 py-3 text-sm text-[#f5f2ee] placeholder:text-[#f5f2ee]/20 focus:outline-none focus:border-[#f5f2ee]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#f5f2ee]/50 mb-2 uppercase tracking-[0.15em]">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="Atlanta, NY, LA..."
                    className="w-full bg-[#f5f2ee]/[0.04] border border-[#f5f2ee]/10 rounded-lg px-4 py-3 text-sm text-[#f5f2ee] placeholder:text-[#f5f2ee]/20 focus:outline-none focus:border-[#f5f2ee]/30 transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Accent color */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#f5f2ee]/30 mb-5">Accent Color</p>
            <p className="text-xs text-[#f5f2ee]/40 mb-4">Your portal's signature color. Fans will associate this with you.</p>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {ACCENT_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setForm({ ...form, accent_color: preset.value })}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-xs font-mono"
                  style={{
                    borderColor: form.accent_color === preset.value ? preset.value : 'rgba(245,242,238,0.08)',
                    backgroundColor: form.accent_color === preset.value ? `${preset.value}15` : 'rgba(245,242,238,0.03)',
                    color: form.accent_color === preset.value ? preset.value : 'rgba(245,242,238,0.4)',
                  }}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: preset.value }} />
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono text-[#f5f2ee]/40">Custom:</label>
              <div className="flex items-center gap-2 bg-[#f5f2ee]/[0.04] border border-[#f5f2ee]/10 rounded-lg px-3 py-2">
                <input
                  type="color"
                  value={form.accent_color}
                  onChange={e => setForm({ ...form, accent_color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-none"
                />
                <span className="text-xs font-mono text-[#f5f2ee]/50">{form.accent_color}</span>
              </div>
            </div>
          </section>

          {/* Social links */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#f5f2ee]/30 mb-5">Links</p>
            <div className="space-y-4">
              {[
                { key: 'instagram', label: 'Instagram', placeholder: 'instagram.com/yourname' },
                { key: 'twitter', label: 'X / Twitter', placeholder: 'x.com/yourname' },
                { key: 'spotify', label: 'Spotify', placeholder: 'open.spotify.com/artist/...' },
                { key: 'website', label: 'Website', placeholder: 'yoursite.com' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-mono text-[#f5f2ee]/50 mb-2 uppercase tracking-[0.15em]">
                    {label}
                  </label>
                  <input
                    type="url"
                    value={(form as any)[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#f5f2ee]/[0.04] border border-[#f5f2ee]/10 rounded-lg px-4 py-3 text-sm text-[#f5f2ee] placeholder:text-[#f5f2ee]/20 focus:outline-none focus:border-[#f5f2ee]/30 transition-colors font-mono"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Save */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving || handleTaken}
              className="flex-1 py-4 rounded-xl text-sm font-medium tracking-wide transition-all disabled:opacity-40"
              style={{
                backgroundColor: accent,
                color: '#080808',
              }}
            >
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Profile'}
            </button>
            {saved && (
              <p className="text-xs font-mono animate-pulse" style={{ color: accent }}>
                Profile updated
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
