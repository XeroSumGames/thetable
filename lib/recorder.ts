// Session recorder - pure logic. No React, no DOM listeners here; those
// live in components/Recorder.tsx, which also owns the toggle UI.
//
// PORTED FROM TheTableau's lib/recorder.ts, which was itself ported from
// TheTapestry's lib/playtest-recorder.ts. Every principle below was
// earned by a real playtest failure mode on one of those two - resist
// the urge to "simplify" any of them:
//
// 1. TAB-LOCAL CAPTURE. The `enabled` flag lives only on
//    window.__recorder, never in a DB row. A shared-DB-flag design
//    couples every tab to one toggle, so one person hitting Stop wipes
//    someone else's recording.
// 2. PER-SCOPE localStorage RESUME, so a crashed or refreshed tab picks
//    the recording back up instead of silently stopping.
// 3. EXPLICIT WIPE on Start, EXPLICIT DOWNLOAD on Stop. Refreshes and
//    unmounts never auto-dump.
// 4. REDACTION. Strings over 500 chars are clipped; keys containing
//    password / token / cookie / authorization become "[redacted]".
//    Walk depth 3 max so console.error(window) cannot lock the tab.
// 5. RING BUFFER. 20k events is roughly 3h of moderate UI density.
//    Trim from the head.
//
// WHAT THIS CAN AND CANNOT SEE ON THIS PROPERTY - read before filing a
// bug about an empty dump. TheTable is a thin hub, and the recorder is
// mounted in its React tree, so it captures the FIVE hub pages only:
// /, /table, /login, /signup, /mailinglist. It does NOT capture:
//   - the 8 character generators. Those are proxy rewrites in
//     next.config.ts to other Vercel projects, so the browser is running
//     THEIR document and none of this code is on the page, even though
//     the address bar says thetable.xerosumgames.com/<slug>.
//   - /a24, which is a static file in public/ and likewise its own
//     document outside the React tree.
// Covering the generators needs a separate vanilla-JS build of this file
// injected into each generator's index.html (8 repos, owned by the
// Character Generators lane). Not done; do not assume it is.
//
// DIFFERENCES FROM THE TWO PARENTS, both deliberate:
//   - No Supabase realtime broadcast cascade. TheTableau has one so a GM
//     hitting Record starts every player's tab; this hub has no
//     multi-client surface at all, so that machinery would be dead code.
//     If a hub page ever becomes multi-client, lift
//     TheTableau/hooks/useRecorderToggle.ts wholesale - the
//     readScopeEnabled / writeScopeEnabled pair below is the seam it
//     plugs into.
//   - The toggle is HIDDEN until armed (see components/Recorder.tsx).
//     Tapestry and Tableau are behind a login; this site is public, and
//     a Record button on a public marketing page is wrong.

export interface RecorderEvent {
  /** Wall clock at capture, ISO. */
  t: string
  /** Milliseconds since startedAt. */
  ms: number
  kind: RecorderEventKind
  data: unknown
}

export type RecorderEventKind =
  | 'click'
  | 'input'     // field identity + value LENGTH only, never the value
  | 'route'
  | 'error'
  | 'rejection'
  | 'console-error'
  | 'console-warn'
  | 'mark'
  | 'custom'
  | 'net'       // Supabase fetch calls: method, path, status, duration, RLS/RPC errors
  | 'snapshot'  // app-state snapshot attached before error/mark and at dump time

export interface RecorderState {
  buffer: RecorderEvent[]
  startedAt: string | null
  userId: string | null
  userEmail: string | null
  sessionId: string
  pathname: string
  enabled: boolean
}

export const MAX_EVENTS = 20_000
const STORAGE_KEY = 'thetable_recorder_buffer'
const ENABLED_KEY_PREFIX = 'thetable_recorder_enabled_'
const ARMED_KEY = 'thetable_recorder_armed'
const PERSIST_THROTTLE_MS = 2_000
const PERSIST_BACKUP_COUNT = 5_000
export const PERIODIC_FLUSH_MS = 60_000
export const CHANGED_EVENT = 'thetable-recorder-changed'

const BENIGN_WARN_SUBSTRINGS: string[] = [
  // Append any noisy 3rd-party warnings that fill the buffer with junk
  // during a real session. Empty until one actually surfaces.
]

// Redaction keys (case-insensitive substring match on object keys).
const REDACT_KEY_SUBSTRINGS = ['password', 'token', 'cookie', 'authorization']
const MAX_STRING_LEN = 500
const MAX_REDACT_DEPTH = 3

declare global {
  interface Window {
    __recorder?: RecorderState
  }
}

// Idempotent global init. Called from Recorder.tsx on mount, and safe to
// call from anywhere else that needs a guaranteed instance.
export function ensureRecorder(): RecorderState {
  if (typeof window === 'undefined') return makeFreshState()
  if (!window.__recorder) {
    window.__recorder = makeFreshState()
    // Resume the buffer from a previous session (e.g. a crashed tab).
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.buffer)) {
          window.__recorder.buffer = parsed.buffer.slice(-MAX_EVENTS)
          if (typeof parsed.startedAt === 'string') window.__recorder.startedAt = parsed.startedAt
        }
      }
    } catch { /* localStorage blocked or JSON garbage; start fresh */ }
  }
  return window.__recorder
}

function makeFreshState(): RecorderState {
  return {
    buffer: [],
    startedAt: null,
    userId: null,
    userEmail: null,
    sessionId: cryptoRandomId(),
    pathname: typeof window !== 'undefined' ? window.location.pathname : '',
    enabled: false,
  }
}

function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Flip the flag and fire a CustomEvent so the React listeners (the dot,
// the toggle label) re-render.
export function setEnabled(enabled: boolean): void {
  const r = ensureRecorder()
  r.enabled = enabled
  if (enabled) r.startedAt = new Date().toISOString()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CHANGED_EVENT, { detail: { enabled } }))
  }
}

export function isEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return !!window.__recorder?.enabled
}

// Called once auth resolves, so a dump says who was driving. Stays null
// for anonymous sessions, which are still worth recording (the signup
// and login flows are exactly where anonymous bugs live).
export function setIdentity(userId: string | null, userEmail: string | null): void {
  const r = ensureRecorder()
  r.userId = userId
  r.userEmail = userEmail
}

// Clear the buffer and its backup. Called at every Start so a recording
// begins clean - resist any urge to preserve the previous session's
// events here, that is a different feature.
export function wipeBuffer(): void {
  const r = ensureRecorder()
  r.buffer.length = 0
  r.startedAt = null
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }
}

export function readScopeEnabled(scopeId: string): boolean {
  if (typeof window === 'undefined' || !scopeId) return false
  try { return localStorage.getItem(ENABLED_KEY_PREFIX + scopeId) === '1' }
  catch { return false }
}

export function writeScopeEnabled(scopeId: string, enabled: boolean): void {
  if (typeof window === 'undefined' || !scopeId) return
  try {
    if (enabled) localStorage.setItem(ENABLED_KEY_PREFIX + scopeId, '1')
    else localStorage.removeItem(ENABLED_KEY_PREFIX + scopeId)
  } catch { /* ignore quota / private-mode errors */ }
}

// ---- Arming ---------------------------------------------------------
// This site is PUBLIC, so the toggle must not be visible to ordinary
// visitors. Arming is sticky per browser: land once on any hub page with
// ?rec=1 and the control appears from then on. ?rec=0 disarms it. The
// hotkeys work whether or not the UI is armed, since a keystroke nobody
// knows about is not a visible control.
export function readArmed(): boolean {
  if (typeof window === 'undefined') return false
  try { return localStorage.getItem(ARMED_KEY) === '1' } catch { return false }
}

export function writeArmed(armed: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (armed) localStorage.setItem(ARMED_KEY, '1')
    else localStorage.removeItem(ARMED_KEY)
  } catch { /* ignore */ }
}

// Read ?rec= off the current URL and fold it into the sticky flag.
// Returns the resulting armed state.
export function syncArmedFromUrl(): boolean {
  if (typeof window === 'undefined') return false
  const param = new URLSearchParams(window.location.search).get('rec')
  if (param === '1') writeArmed(true)
  else if (param === '0') writeArmed(false)
  return readArmed()
}

// ---- Capture --------------------------------------------------------
// Tab-local gate. Early-returns when not recording, so the listeners
// installed in Recorder.tsx cost near-nothing while capture is off.
export function record(kind: RecorderEventKind, data: unknown): void {
  const r = ensureRecorder()
  if (!r.enabled) return
  if (kind === 'console-warn' && typeof data === 'object' && data !== null) {
    const args = (data as { args?: unknown[] }).args
    if (Array.isArray(args)) {
      const flat = args.map(a => typeof a === 'string' ? a : '').join(' ')
      if (BENIGN_WARN_SUBSTRINGS.some(s => flat.includes(s))) return
    }
  }
  const noteworthy = kind === 'error' || kind === 'rejection' || kind === 'mark'
  // Attach a state snapshot JUST BEFORE an unrecoverable or marked
  // moment, so a dump self-diagnoses (what page, who, what viewport) at
  // that instant rather than only at the end.
  if (noteworthy) appendEvent(r, 'snapshot', redact(captureSnapshot()))
  appendEvent(r, kind, redact(data))
  if (noteworthy) flushNow()
  else schedulePersist()
}

function appendEvent(r: RecorderState, kind: RecorderEventKind, data: unknown): void {
  const now = Date.now()
  const startedMs = r.startedAt ? new Date(r.startedAt).getTime() : now
  r.buffer.push({ t: new Date(now).toISOString(), ms: now - startedMs, kind, data })
  if (r.buffer.length > MAX_EVENTS) r.buffer.splice(0, r.buffer.length - MAX_EVENTS)
}

// ---- State snapshot -------------------------------------------------
// Every dump, error and mark carries app state, so an analyst sees the
// context and not just the click. The default is global-only; a page can
// register a richer provider whose fields merge on top.
type SnapshotProvider = () => Record<string, unknown>
let snapshotProvider: SnapshotProvider | null = null

export function setSnapshotProvider(fn: SnapshotProvider | null): void {
  snapshotProvider = fn
}

function defaultSnapshot(): Record<string, unknown> {
  if (typeof window === 'undefined') return {}
  const r = ensureRecorder()
  return {
    // The ORIGIN, not just the path - a dump that only says "/" cannot tell
    // localhost from the live site, which wasted a round trip once already.
    origin: window.location.origin,
    pathname: window.location.pathname,
    search: window.location.search,
    signed_in: !!r.userId,
    viewport: { w: window.innerWidth, h: window.innerHeight },
  }
}

function captureSnapshot(): Record<string, unknown> {
  const base = defaultSnapshot()
  if (!snapshotProvider) return base
  try { return { ...base, ...snapshotProvider() } } catch { return base }
}

// Diagnostic helper. Call trace('signup-submitted', { site }) at a point
// worth seeing in a dump; lands as a 'custom' event, dev-echoed only.
export function trace(label: string, data?: Record<string, unknown>): void {
  record('custom', { label, ...(data ?? {}) })
  if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug('[recorder-trace]', label, data ?? '')
  }
}

// Walk an arbitrary value, redacting sensitive fields and clipping long
// strings. Depth-capped.
function redact(value: unknown, depth = 0): unknown {
  if (value == null) return value
  if (typeof value === 'string') {
    return value.length > MAX_STRING_LEN
      ? value.slice(0, MAX_STRING_LEN) + `...[+${value.length - MAX_STRING_LEN}]`
      : value
  }
  if (typeof value !== 'object') return value
  if (depth >= MAX_REDACT_DEPTH) return '[depth-cap]'
  if (Array.isArray(value)) return value.map(v => redact(v, depth + 1))
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(value as Record<string, unknown>)) {
    if (REDACT_KEY_SUBSTRINGS.some(s => k.toLowerCase().includes(s))) {
      out[k] = '[redacted]'
    } else {
      out[k] = redact((value as Record<string, unknown>)[k], depth + 1)
    }
  }
  return out
}

let persistTimer: ReturnType<typeof setTimeout> | null = null
function schedulePersist(): void {
  if (persistTimer) return
  persistTimer = setTimeout(() => {
    persistTimer = null
    flushNow()
  }, PERSIST_THROTTLE_MS)
}

// Persist the trailing slice to localStorage so a browser crash
// mid-session can still be recovered.
function flushNow(): void {
  if (typeof window === 'undefined') return
  const r = ensureRecorder()
  if (!r.enabled) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      buffer: r.buffer.slice(-PERSIST_BACKUP_COUNT),
      startedAt: r.startedAt,
      sessionId: r.sessionId,
    }))
  } catch { /* quota or private mode - drop the backup */ }
}

let periodicTimer: ReturnType<typeof setInterval> | null = null
export function startPeriodicFlush(): void {
  if (periodicTimer) return
  periodicTimer = setInterval(() => {
    if (isEnabled()) flushNow()
  }, PERIODIC_FLUSH_MS)
}

export function flushAllNow(): void { flushNow() }

export function eventCount(): number {
  if (typeof window === 'undefined') return 0
  return window.__recorder?.buffer.length ?? 0
}

// Build the JSON dump and hand it to the browser as a download. Called
// from the Stop path and from the Ctrl+Shift+L hotkey.
export function downloadDump(): void {
  if (typeof window === 'undefined') return
  const r = ensureRecorder()
  const now = new Date()
  const startedAt = r.startedAt ?? now.toISOString()
  const startedMs = new Date(startedAt).getTime()
  const meta = {
    dumped_at: now.toISOString(),
    started_at: startedAt,
    duration_ms: Math.max(0, now.getTime() - startedMs),
    session_id: r.sessionId,
    user_id: r.userId,
    user_email: r.userEmail,
    user_agent: navigator.userAgent,
    viewport: { w: window.innerWidth, h: window.innerHeight },
    origin: window.location.origin,
    pathname: window.location.pathname,
    event_count: r.buffer.length,
    app_version: APP_VERSION,
    // Spelled out in the dump itself so nobody reads an empty recording
    // as a broken recorder.
    coverage: 'TheTable hub React pages only (/, /table, /login, /signup, /mailinglist). Proxied generators and /a24 are separate documents and are NOT captured.',
    final_snapshot: captureSnapshot(),
  }
  const blob = new Blob([JSON.stringify({ meta, events: r.buffer }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filenameFor(r.userEmail, now)
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

function filenameFor(email: string | null, when: Date): string {
  const who = email ? email.split('@')[0].replace(/[^a-z0-9-]+/gi, '-') : 'anon'
  const iso = when.toISOString().replace(/[:.]/g, '-')
  return `thetable-recording-${who}-${iso}.json`
}

// Stamp the dump so cross-version recordings are obvious. Bump on any
// breaking change to the event schema or the meta shape.
export const APP_VERSION = 'thetable-2026-09-12-recorder-v1'

// Convenience for the corner dot / toggle listeners.
export function onRecorderChanged(handler: (enabled: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const listener = (e: Event) => handler(!!(e as CustomEvent<{ enabled: boolean }>).detail?.enabled)
  window.addEventListener(CHANGED_EVENT, listener)
  return () => window.removeEventListener(CHANGED_EVENT, listener)
}
