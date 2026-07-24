'use client'

import { useEffect, useRef } from 'react'

// Client-side visit beacon for TheTable's own pages (the static generators have
// their own inline beacon). Mirrors the generators' payload exactly so visits
// land in the same visitor_logs via the shared log-visit function, enriched by
// the geo_* cookies set in middleware.ts. Respects the owner opt-out.
const LOG_VISIT = 'https://jbudzglgtxeoaufpejrv.supabase.co/functions/v1/log-visit'

function cookie(name: string): string | null {
  const m = document.cookie.match('(^|; )' + name + '=([^;]*)')
  return m ? decodeURIComponent(m[2]) : null
}

export default function VisitBeacon({ page }: { page: string }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    try {
      if (localStorage.getItem('tapestry_no_log') === '1') return

      let sid = localStorage.getItem('tapestry_session_id')
      if (!sid) {
        sid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()
        localStorage.setItem('tapestry_session_id', sid)
      }

      const lat = cookie('geo_lat')
      const lng = cookie('geo_lng')
      const send = (ipHash: string | null) => {
        fetch(LOG_VISIT, {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: String(sid).slice(0, 64),
            page,
            referrer: document.referrer || null,
            country_code: cookie('geo_country'),
            region: cookie('geo_region'),
            city: cookie('geo_city'),
            latitude: lat ? parseFloat(lat) : null,
            longitude: lng ? parseFloat(lng) : null,
            ip_hash: ipHash,
          }),
        }).catch(() => {})
      }

      const rawIP = cookie('geo_ip')
      if (rawIP && crypto.subtle) {
        crypto.subtle
          .digest('SHA-256', new TextEncoder().encode(rawIP))
          .then((buf) =>
            send(
              Array.from(new Uint8Array(buf))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
            )
          )
          .catch(() => send(null))
      } else {
        send(null)
      }
    } catch {
      /* logging must never break the page */
    }
  }, [page])

  return null
}
