'use client'

import { useEffect, useState } from 'react'

// Secret-gated view of the launch mailing list. The secret is checked
// server-side by the launch-list function; the list never returns without it.
const ENDPOINT = 'https://jbudzglgtxeoaufpejrv.supabase.co/functions/v1/launch-list'
const KEY = 'xsg_list_secret'

type Signup = { email: string; site: string | null; source: string | null; created_at: string }

export default function LaunchList() {
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [signups, setSignups] = useState<Signup[]>([])
  const [error, setError] = useState('')

  async function fetchList(sec: string) {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: sec }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.ok) {
        setSignups(data.signups ?? [])
        setStatus('ok')
        try { sessionStorage.setItem(KEY, sec) } catch {}
      } else if (res.status === 401) {
        setStatus('error')
        setError('Incorrect access key.')
        try { sessionStorage.removeItem(KEY) } catch {}
      } else {
        setStatus('error')
        setError('Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setError('Something went wrong. Try again.')
    }
  }

  useEffect(() => {
    let saved = ''
    try { saved = sessionStorage.getItem(KEY) || '' } catch {}
    if (saved) { setSecret(saved); fetchList(saved) }
  }, [])

  function downloadCsv() {
    const rows = [
      ['email', 'site', 'source', 'created_at'],
      ...signups.map((s) => [s.email, s.site ?? '', s.source ?? '', s.created_at]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'thetable-mailinglist.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === 'ok') {
    return (
      <div className="ml">
        <div className="ml-head">
          <span>{signups.length} signup{signups.length === 1 ? '' : 's'}</span>
          {signups.length > 0 && <button className="ml-csv" onClick={downloadCsv}>Download CSV</button>}
        </div>
        {signups.length === 0 ? (
          <p className="ml-empty">No signups yet.</p>
        ) : (
          <div className="ml-table">
            <div className="ml-row ml-row--head"><span>Email</span><span>Site</span><span>When</span></div>
            {signups.map((s, i) => (
              <div className="ml-row" key={s.email + i}>
                <span className="ml-email">{s.email}</span>
                <span>{s.site}</span>
                <span>{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <form
      className="ml-gate"
      onSubmit={(e) => { e.preventDefault(); if (secret.trim()) fetchList(secret.trim()) }}
    >
      <label className="ml-label" htmlFor="ml-secret">Access key</label>
      <div className="ml-gate-row">
        <input
          id="ml-secret"
          type="password"
          autoComplete="off"
          value={secret}
          onChange={(e) => { setSecret(e.target.value); if (status === 'error') setStatus('idle') }}
          placeholder="Enter access key"
          disabled={status === 'loading'}
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Checking…' : 'View list'}
        </button>
      </div>
      {status === 'error' && <p className="ml-error" role="alert">{error}</p>}
    </form>
  )
}
