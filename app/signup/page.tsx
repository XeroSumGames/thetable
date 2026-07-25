'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

function SignupInner() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    })
    if (error) {
      setError(error.message)
      setBusy(false)
      return
    }
    if (data.session) {
      router.push(next) // email confirmation disabled -> straight in
    } else {
      setDone('Check your email to confirm your account, then log in.')
      setBusy(false)
    }
  }

  const loginHref = next !== '/' ? `/login?next=${encodeURIComponent(next)}` : '/login'

  if (done) {
    return (
      <main className="wrap">
        <p className="back"><a href="/">← The Table</a></p>
        <header className="masthead">
          <p className="kicker">Xero Sum Games</p>
          <h1>Almost there</h1>
        </header>
        <p className="auth-alt" role="status">{done}</p>
      </main>
    )
  }

  return (
    <main className="wrap">
      <p className="back"><a href="/">← The Table</a></p>
      <header className="masthead">
        <p className="kicker">Xero Sum Games</p>
        <h1>Create account</h1>
      </header>
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required autoComplete="new-password" minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        {error && <p className="auth-error" role="alert">{error}</p>}
      </form>
      <p className="auth-alt">Already have an account? <a href={loginHref}>Log in</a></p>
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="wrap" />}>
      <SignupInner />
    </Suspense>
  )
}
