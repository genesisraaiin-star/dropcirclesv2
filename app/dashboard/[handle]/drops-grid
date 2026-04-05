'use client'

import { useState, useEffect, useRef } from 'react'

type Circle = {
  id: string
  title: string
  description: string | null
  price: number
  expires_at: string | null
  assets: string[] | null
  circle_tier: string | null
}

function useCountdown(expiresAt: string | null) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [urgent, setUrgent] = useState(false)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!expiresAt) return

    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now()
      if (diff <= 0) {
        setExpired(true)
        setTimeLeft(null)
        return
      }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setUrgent(diff < 3_600_000) // under 1 hour = urgent
      setTimeLeft(
        h > 0
          ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
          : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      )
    }

    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  return { timeLeft, urgent, expired }
}

function DropCard({
  circle,
  accent,
  handle,
}: {
  circle: Circle
  accent: string
  handle: string
}) {
  const { timeLeft, urgent, expired } = useCountdown(circle.expires_at)
  const [hovering, setHovering] = useState(false)
  const isHype = !!circle.expires_at
  const trackCount = circle.assets?.length ?? 0

  if (expired) return null // vanish when timer hits zero

  const priceLabel =
    circle.price === 0
      ? 'Free'
      : `$${(circle.price / 100).toFixed(2)}`

  return (
    <div
      className="group relative rounded-2xl border transition-all duration-300 overflow-hidden"
      style={{
        borderColor: hovering
          ? `${accent}50`
          : isHype
          ? '#f9731630'
          : `${accent}18`,
        backgroundColor: hovering
          ? `${accent}07`
          : isHype
          ? '#f9731604'
          : `${accent}03`,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Top bar accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{
          backgroundColor: isHype ? '#f97316' : accent,
          opacity: hovering ? 0.6 : 0.2,
        }}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {circle.circle_tier && (
              <span
                className="text-[9px] uppercase tracking-[0.3em] font-mono px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${accent}15`,
                  color: accent,
                }}
              >
                {circle.circle_tier}
              </span>
            )}
            {isHype && (
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded bg-[#f9731615] text-[#f97316]">
                Hype Drop
              </span>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div
              className="text-xl font-normal"
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: circle.price === 0 ? `${accent}90` : '#f5f2ee',
              }}
            >
              {priceLabel}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-normal leading-snug mb-2 text-[#f5f2ee]"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {circle.title}
        </h3>

        {/* Description */}
        {circle.description && (
          <p className="text-sm text-[#f5f2ee]/40 leading-relaxed line-clamp-2 mb-4">
            {circle.description}
          </p>
        )}

        {/* Track count */}
        {trackCount > 0 && (
          <p className="text-[10px] font-mono text-[#f5f2ee]/25 mb-4 uppercase tracking-[0.2em]">
            {trackCount} track{trackCount !== 1 ? 's' : ''}
          </p>
        )}

        {/* Countdown */}
        {isHype && timeLeft && (
          <div className="mb-5">
            <p className="text-[9px] font-mono text-[#f5f2ee]/30 uppercase tracking-[0.2em] mb-1">
              Closes in
            </p>
            <div
              className="font-mono text-2xl font-normal tracking-wider tabular-nums"
              style={{
                color: urgent ? '#f97316' : '#f5f2ee',
                textShadow: urgent ? '0 0 20px #f9731640' : 'none',
              }}
            >
              {timeLeft}
            </div>
          </div>
        )}

        {/* Unlock button */}
        <button
          onClick={() => {
            // Phase 2: will trigger Stripe Checkout
            // For now, placeholder
            window.location.href = `/api/checkout?circle_id=${circle.id}&handle=${handle}`
          }}
          className="w-full py-3.5 rounded-xl font-mono text-[11px] uppercase tracking-[0.25em] transition-all duration-200"
          style={{
            backgroundColor: hovering
              ? accent
              : `${accent}18`,
            color: hovering ? '#080808' : accent,
            fontWeight: hovering ? '500' : '400',
          }}
        >
          {circle.price === 0 ? 'Access Free' : 'Unlock Drop →'}
        </button>
      </div>
    </div>
  )
}

export function DropsGrid({
  circles,
  accent,
  handle,
}: {
  circles: Circle[]
  accent: string
  handle: string
}) {
  // Split hype vs regular, filter expired client-side
  const hype = circles.filter(c => c.expires_at)
  const regular = circles.filter(c => !c.expires_at)

  return (
    <div className="space-y-10">
      {hype.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-5">
            <p className="text-[9px] uppercase tracking-[0.35em] font-mono text-[#f5f2ee]/25">
              Live Now
            </p>
            <div className="flex-1 h-px bg-[#f97316]/15" />
            <span className="text-[9px] font-mono text-[#f97316]/50">
              Disappears when timer hits zero
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hype.map(c => (
              <DropCard key={c.id} circle={c} accent={accent} handle={handle} />
            ))}
          </div>
        </section>
      )}

      {regular.length > 0 && (
        <section>
          {hype.length > 0 && (
            <div className="flex items-center gap-4 mb-5">
              <p className="text-[9px] uppercase tracking-[0.35em] font-mono text-[#f5f2ee]/25">
                Drops
              </p>
              <div className="flex-1 h-px" style={{ backgroundColor: `${accent}15` }} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regular.map(c => (
              <DropCard key={c.id} circle={c} accent={accent} handle={handle} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
