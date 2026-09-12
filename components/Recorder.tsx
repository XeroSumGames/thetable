'use client'
// Session recorder mount-once component. Mounted in app/layout.tsx so it
// covers every hub page. Owns:
//   - window.__recorder init
//   - DOM listeners: click (capture phase), input, error,
//     unhandledrejection, beforeunload
//   - console.error / console.warn patches (always passed through to the
//     originals, so devtools keep working)
//   - a window.fetch patch that records our own Supabase calls
//   - hotkeys: Ctrl+Shift+R start/stop, Ctrl+Shift+L dump,
//     Ctrl+Shift+M mark, Ctrl+Shift+P peek the last 20
//   - the red "recording" dot, and the Record control itself
//
// The pure logic is in lib/recorder.ts; read the header comment there
// first, especially the part about what this can and cannot see.
//
// Unlike TheTableau (which puts its toggle in an authenticated chrome
// bar), the control here is HIDDEN until armed, because this is a public
// unauthenticated site. Arm it by visiting any hub page with ?rec=1
// once - it sticks in localStorage from then on. ?rec=0 disarms.

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase, SUPABASE_URL } from '../lib/supabase'
import {
  ensureRecorder, setIdentity, isEnabled, record, setEnabled, wipeBuffer,
  startPeriodicFlush, flushAllNow, downloadDump, onRecorderChanged,
  readScopeEnabled, writeScopeEnabled, syncArmedFromUrl, eventCount,
  APP_VERSION,
} from '../lib/recorder'

const SCOPE = 'hub'

export default function Recorder() {
  const [recording, setRecording] = useState(false)
  const [armed, setArmed] = useState(false)
  const [count, setCount] = useState(0)
  const pathname = usePathname()

  // Install on mount, remove on unmount, symmetrically.
  // DO NOT add an "init once" ref guard here. Both parent implementations
  // (TheTableau, TheTapestry) have one and it makes the recorder INERT in
  // dev: strict mode runs the effect, runs the cleanup, then runs the
  // effect again - and the guard turns that third step into a no-op, so
  // the listeners the cleanup just removed are never re-installed.
  // Nothing gets captured while the Record button still lights up, so it
  // looks like it works. Caught on the VTT port by checking whether
  // console.error had actually been patched. Production never
  // double-invokes, which is why it went unnoticed upstream.
  //
  // What the guard was FOR, because it was not pointless: with no
  // cleanup, a double-invoke really does double-install. Each run
  // builds fresh closures, so two runs leave two click listeners; and
  // the console patch NESTS, run 2 saving run 1's patch as its
  // "original", so errors record twice and the real console.error is
  // buried for good. A guard is the right answer to that - it is what
  // TheTapestry does, and its recorder works.
  //
  // So there are two valid shapes and this file is the other one:
  // guard + no cleanup (install once, never tear down), or cleanup +
  // no guard (this file - install A, remove A, install B, ending at
  // exactly one set of listeners and one layer of patches, because
  // cleanup restores the true original before the next run saves it).
  // Mixing them is what captures nothing. Do not re-add the guard
  // without also deleting the cleanup.
  useEffect(() => {
    ensureRecorder()
    startPeriodicFlush()
    setArmed(syncArmedFromUrl())

    // Resume a recording that was running when the tab reloaded.
    if (readScopeEnabled(SCOPE)) {
      setEnabled(true)
      setRecording(true)
    } else {
      setRecording(isEnabled())
    }

    // Click capture, passive, capture phase so we still see events that
    // something downstream stops from bubbling.
    const onClick = (e: MouseEvent) => {
      if (!isEnabled()) return
      const tgt = e.target as Element | null
      if (!tgt) return
      record('click', { ...describeTarget(tgt), x: e.clientX, y: e.clientY, button: e.button })
    }
    document.addEventListener('click', onClick, { capture: true, passive: true })

    // Field edits. The hub's interactive surface is almost entirely
    // forms (signup, login, mailing list), so a dump with no input
    // events would miss the actual interaction. Records the field
    // identity and the value LENGTH only - never the value, because
    // these fields hold emails and passwords.
    const onInput = (e: Event) => {
      if (!isEnabled()) return
      const el = e.target as HTMLInputElement | null
      if (!el || !el.tagName) return
      const tag = el.tagName.toLowerCase()
      if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') return
      record('input', {
        tag,
        type: el.type ?? null,
        name: el.name || null,
        id: el.id || null,
        value_length: typeof el.value === 'string' ? el.value.length : null,
      })
    }
    document.addEventListener('input', onInput, { capture: true, passive: true })

    const onError = (e: ErrorEvent) => {
      record('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack ?? null,
      })
    }
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason as Error | undefined
      record('rejection', { message: r?.message ?? String(e.reason), stack: r?.stack ?? null })
    }
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)

    // One-shot final flush on unload. Never auto-download; the dump is
    // always explicit.
    const onBeforeUnload = () => { flushAllNow() }
    window.addEventListener('beforeunload', onBeforeUnload)

    const origErr = console.error
    const origWarn = console.warn
    console.error = function patchedErr(...args: unknown[]) {
      try { record('console-error', { args: args.map(captureArg) }) } catch { /* never let the recorder break console */ }
      origErr.apply(console, args)
    }
    console.warn = function patchedWarn(...args: unknown[]) {
      try { record('console-warn', { args: args.map(captureArg) }) } catch { /* ignore */ }
      origWarn.apply(console, args)
    }

    // Network capture, our Supabase project only. Records
    // method/path/status/duration plus any RLS or auth error code, never
    // request or response BODIES. This is what surfaces a silent 403 or
    // a failed signup that the UI swallowed.
    const origFetch = window.fetch
    window.fetch = async function patchedFetch(...args: Parameters<typeof fetch>) {
      const started = performance.now()
      const input = args[0]
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input)
      const method = (args[1]?.method || (input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase()
      const watch = isEnabled() && url.startsWith(SUPABASE_URL)
      try {
        const res = await origFetch.apply(this, args)
        if (watch) {
          const dur = Math.round(performance.now() - started)
          let error_code: unknown, error_message: unknown
          if (!res.ok) {
            try { const j = await res.clone().json(); error_code = j?.code ?? j?.error; error_message = j?.message ?? j?.error_description } catch { /* not JSON */ }
          }
          record('net', {
            method, url_path: supaPath(url), table_or_rpc: supaTarget(url),
            status: res.status, ok: res.ok, duration_ms: dur,
            ...(dur > 1500 ? { slow: true } : {}),
            ...(error_code !== undefined ? { error_code } : {}),
            ...(error_message !== undefined ? { error_message } : {}),
          })
        }
        return res
      } catch (err) {
        if (watch) {
          record('net', {
            method, url_path: supaPath(url), table_or_rpc: supaTarget(url),
            ok: false, network_error: true, error_message: String(err),
            duration_ms: Math.round(performance.now() - started),
          })
        }
        throw err
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey) return
      const k = e.key.toLowerCase()
      if (k === 'r') {
        e.preventDefault()
        toggle()
      } else if (k === 'l') {
        e.preventDefault()
        downloadDump()
      } else if (k === 'm') {
        e.preventDefault()
        const label = window.prompt('Mark label (recorded in the dump)') ?? ''
        if (label.trim()) record('mark', { label: label.trim() })
      } else if (k === 'p') {
        e.preventDefault()
        // eslint-disable-next-line no-console
        origErr.call(console, '[recorder peek]', ensureRecorder().buffer.slice(-20))
      }
    }
    window.addEventListener('keydown', onKey)

    const off = onRecorderChanged(setRecording)

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('input', onInput, true)
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('keydown', onKey)
      console.error = origErr
      console.warn = origWarn
      window.fetch = origFetch
      off()
    }
    // Deliberately empty deps: one install per mount lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stamp each navigation so a recording can be read page by page.
  useEffect(() => {
    if (!pathname) return
    const r = ensureRecorder()
    r.pathname = pathname
    if (isEnabled()) record('route', { pathname, search: typeof window !== 'undefined' ? window.location.search : '' })
  }, [pathname])

  // Resolve identity so a dump says who was driving. Re-runs on sign
  // in/out so a session that logs in mid-recording is tagged from there.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      setIdentity(user?.id ?? null, user?.email ?? null)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setIdentity(session?.user?.id ?? null, session?.user?.email ?? null)
    })
    return () => { cancelled = true; sub.subscription.unsubscribe() }
  }, [])

  // Live event count on the control, so it is obvious capture is working
  // rather than silently dead. Only ticks while recording.
  useEffect(() => {
    if (!recording) return
    setCount(eventCount())
    const id = setInterval(() => setCount(eventCount()), 1_000)
    return () => clearInterval(id)
  }, [recording])

  function toggle() {
    if (isEnabled()) {
      // Stop: dump first, then disable, so the download carries the
      // whole session.
      downloadDump()
      setEnabled(false)
      writeScopeEnabled(SCOPE, false)
    } else {
      wipeBuffer()
      setEnabled(true)
      writeScopeEnabled(SCOPE, true)
    }
  }

  if (!armed) return null

  return (
    <>
      {recording && (
        <div
          aria-hidden
          style={{
            position: 'fixed', right: 8, bottom: 8, width: 8, height: 8, borderRadius: '50%',
            background: '#c0392b', boxShadow: '0 0 6px rgba(192,57,43,.9), 0 0 0 1px rgba(0,0,0,.7)',
            pointerEvents: 'none', zIndex: 99999,
          }}
        />
      )}
      <button
        type="button"
        onClick={toggle}
        title={`${APP_VERSION}\nCtrl+Shift+R start/stop, Ctrl+Shift+L dump, Ctrl+Shift+M mark, Ctrl+Shift+P peek`}
        style={{
          position: 'fixed', right: 22, bottom: 4, zIndex: 99999,
          font: '600 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace',
          letterSpacing: '.04em', textTransform: 'uppercase',
          color: recording ? '#fff' : 'var(--muted, #98958c)',
          background: recording ? '#c0392b' : 'var(--panel, #16161a)',
          border: '1px solid ' + (recording ? '#c0392b' : 'var(--line, #262630)'),
          borderRadius: 4, padding: '3px 8px', cursor: 'pointer',
        }}
      >
        {recording ? `recording ${count}` : 'record'}
      </button>
    </>
  )
}

// Cap an arbitrary console arg so one console.error(window) cannot bloat
// the buffer, while keeping the dump structured rather than stringified.
function captureArg(arg: unknown): unknown {
  if (arg == null) return arg
  if (typeof arg === 'string') return arg.length > 10_000 ? arg.slice(0, 10_000) + `...[+${arg.length - 10_000}]` : arg
  if (arg instanceof Error) return { name: arg.name, message: arg.message, stack: arg.stack?.slice(0, 4_000) ?? null }
  try {
    const s = JSON.stringify(arg)
    if (s.length > 10_000) return s.slice(0, 10_000) + `...[+${s.length - 10_000}]`
    return JSON.parse(s)
  } catch {
    return '[unserialisable]'
  }
}

// Rich click context. Beyond the raw target, climb up to 6 parents for
// the nearest meaningful control, so a click reads as "the Twilight 2000
// generator tile" rather than "<div> at 412,300". data-recorder="label"
// on an element is the explicit way to name one.
function describeTarget(tgt: Element): Record<string, unknown> {
  const el = tgt as HTMLElement
  const tag = tgt.tagName.toLowerCase()
  const cls = typeof el.className === 'string' ? el.className.slice(0, 120) : null
  const text = (tgt.textContent ?? '').trim().slice(0, 80)
  const link_href = tag === 'a' ? (el as HTMLAnchorElement).href : undefined

  let nearest_interactive: string | null = null
  let generator: string | null = null
  let node: Element | null = tgt
  for (let i = 0; i < 6 && node; i++) {
    const h = node as HTMLElement
    const rec = h.getAttribute?.('data-recorder')
    const role = h.getAttribute?.('role')
    if (!nearest_interactive && (node.tagName === 'BUTTON' || node.tagName === 'A' || rec || role === 'button' || role === 'tab')) {
      nearest_interactive = rec || (node.textContent ?? '').trim().slice(0, 40) || node.tagName.toLowerCase()
    }
    // Which generator tile / property card was clicked. The landing page
    // is a wall of links, and the href is what disambiguates them.
    if (!generator) {
      const href = h.getAttribute?.('href')
      if (href && href.startsWith('/')) generator = href.slice(1).split(/[?#]/)[0] || null
    }
    node = node.parentElement
  }
  return {
    tag, id: el.id || null, cls, text,
    ...(nearest_interactive ? { nearest_interactive } : {}),
    ...(generator ? { target_route: generator } : {}),
    ...(link_href ? { link_href } : {}),
  }
}

// Parse a Supabase REST/auth URL into a body-free path: query VALUES are
// dropped, the table or rpc name is kept.
function supaPath(url: string): string {
  try {
    const u = new URL(url)
    const keys = Array.from(u.searchParams.keys()).join(',')
    return u.pathname + (keys ? ` ?${keys}` : '')
  } catch { return url.slice(SUPABASE_URL.length) }
}

function supaTarget(url: string): string {
  const p = url.slice(SUPABASE_URL.length)
  const rpc = p.match(/\/rest\/v1\/rpc\/([a-z0-9_]+)/i)
  if (rpc) return `rpc/${rpc[1]}`
  const table = p.match(/\/rest\/v1\/([a-z0-9_]+)/i)
  if (table) return table[1]
  if (p.includes('/auth/')) return 'auth'
  if (p.includes('/functions/')) return 'functions'
  if (p.includes('/storage/')) return 'storage'
  return 'other'
}
