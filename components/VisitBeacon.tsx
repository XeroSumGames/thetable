'use client'

import { useEffect, useRef } from 'react'

// Client-side visit beacon for TheTable's own pages (the static generators have
// their own inline beacon). Posts the enriched payload to the shared log-visit
// function (device/browser/os are parsed server-side from the UA). Reads geo
// from the middleware cookies. Fires a dwell "exit" beacon on tab-hide/close so
// we capture how long they stayed. Respects the owner opt-out.
const LOG_VISIT = 'https://jbudzglgtxeoaufpejrv.supabase.co/functions/v1/log-visit'

function cookie(name: string): string | null {
  const m = document.cookie.match('(^|; )' + name + '=([^;]*)')
  return m ? decodeURIComponent(m[2]) : null
}

function utm(key: string): string | null {
  try {
    return new URLSearchParams(window.location.search).get(key)
  } catch {
    return null
  }
}

export default function VisitBeacon({ page, site = 'table' }: { page: string; site?: string }) {
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true

    const start = Date.now()
    let rowId: string | null = null
    let exited = false

    const logPageview = async () => {
      try {
        if (localStorage.getItem('tapestry_no_log') === '1') return

        let sid = localStorage.getItem('tapestry_session_id')
        if (!sid) {
          sid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()
          localStorage.setItem('tapestry_session_id', sid)
        }

        const lat = cookie('geo_lat')
        const lng = cookie('geo_lng')
        const payload: Record<string, unknown> = {
          session_id: sid,
          page,
          site,
          full_path: window.location.pathname + window.location.search,
          referrer: document.referrer || null,
          country_code: cookie('geo_country'),
          region: cookie('geo_region'),
          city: cookie('geo_city'),
          latitude: lat ? parseFloat(lat) : null,
          longitude: lng ? parseFloat(lng) : null,
          language: navigator.language || null,
          screen_w: window.screen?.width ?? null,
          screen_h: window.screen?.height ?? null,
          utm_source: utm('utm_source'),
          utm_medium: utm('utm_medium'),
          utm_campaign: utm('utm_campaign'),
          utm_term: utm('utm_term'),
          utm_content: utm('utm_content'),
          ip_hash: null as string | null,
        }

        const rawIP = cookie('geo_ip')
        if (rawIP && crypto.subtle) {
          const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawIP))
          payload.ip_hash = Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
        }

        const res = await fetch(LOG_VISIT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => null)
        rowId = data?.id ?? null
      } catch {
        /* logging must never break the page */
      }
    }

    // Dwell: fire once, on the first tab-hide or page-unload, with elapsed time.
    const sendExit = () => {
      if (exited || !rowId) return
      exited = true
      try {
        navigator.sendBeacon(
          LOG_VISIT,
          JSON.stringify({ type: 'exit', id: rowId, duration_ms: Date.now() - start })
        )
      } catch {
        /* ignore */
      }
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') sendExit()
    }

    logPageview()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', sendExit)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', sendExit)
    }
  }, [page, site])

  return null
}
