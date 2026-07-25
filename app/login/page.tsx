'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function LoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }
    router.push(next)
  }

  const signupHref = next !== '/' ? `/signup?next=${encodeURIComponent(next)}` : '/signup'

  return (
    <main className="wrap">
      <p className="back"><a href="/">← The Table</a></p>
      <header className="masthead">
        <p className="kicker">Xero Sum Games</p>
        <h1>Log in</h1>
      </header>
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        {error && <p className="auth-error" role="alert">{error}</p>}
      </form>
      <p className="auth-alt">No account yet? <a href={signupHref}>Create one</a></p>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="wrap" />}>
      <LoginInner />
    </Suspense>
  )
}
