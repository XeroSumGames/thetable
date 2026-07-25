'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Signup = { email: string; site: string | null; source: string | null; created_at: string }

export default function MailingListAdmin() {
  const [state, setState] = useState<'checking' | 'denied' | 'ready'>('checking')
  const [signups, setSignups] = useState<Signup[]>([])
  const [who, setWho] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login?next=/mailinglist'
        return
      }
      setWho(session.user.email ?? null)
      // Thriver gate (matches TheTapestry). The RLS policy on launch_signups
      // enforces this server-side too; this just picks the right UI.
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role !== 'thriver') { setState('denied'); return }

      const { data, error } = await supabase
        .from('launch_signups')
        .select('email, site, source, created_at')
        .order('created_at', { ascending: false })
        .limit(5000)
      if (error) { setState('denied'); return }
      setSignups(data ?? [])
      setState('ready')
    })()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

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

  if (state === 'checking') return <p className="ml-empty">Checking your access…</p>

  if (state === 'denied') {
    return (
      <div className="ml">
        <p className="ml-empty">
          This page is limited to the Xero Sum Games admin account
          {who ? ` — you're signed in as ${who}.` : '.'}
        </p>
        <p style={{ textAlign: 'center' }}>
          <button className="ml-signout" onClick={signOut}>Sign out</button>
        </p>
      </div>
    )
  }

  return (
    <div className="ml">
      <div className="ml-head">
        <span>{signups.length} signup{signups.length === 1 ? '' : 's'}</span>
        <span style={{ display: 'flex', gap: '8px' }}>
          {signups.length > 0 && <button className="ml-csv" onClick={downloadCsv}>Download CSV</button>}
          <button className="ml-signout" onClick={signOut}>Sign out</button>
        </span>
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
