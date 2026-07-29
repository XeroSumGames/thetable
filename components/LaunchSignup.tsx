'use client'

import { useState } from 'react'

// Captures "notify me at launch" emails into the shared Supabase via the public
// launch-signup edge function (same backend everything else uses).
const ENDPOINT = 'https://jbudzglgtxeoaufpejrv.supabase.co/functions/v1/launch-signup'

type Props = {
  label?: string
  source?: string
  doneMessage?: string
}

export default function LaunchSignup({
  label = 'Sign up to be notified on launch',
  source = '/table',
  doneMessage = "You're on the list. We'll email you when The Table opens.",
}: Props = {}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value) return
    setStatus('submitting')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, site: 'table', source }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.ok) {
        setStatus('done')
        setMessage(
          data.already
            ? "You're already on the list — thanks!"
            : doneMessage
        )
      } else if (data?.error === 'invalid_email') {
        setStatus('error')
        setMessage('That email doesn’t look right — mind checking it?')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'done') {
    return <p className="signup-done" role="status">{message}</p>
  }

  return (
    <form className="signup" onSubmit={onSubmit} noValidate>
      <label className="signup-label" htmlFor="signup-email">
        {label}
      </label>
      <div className="signup-row">
        <input
          id="signup-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          disabled={status === 'submitting'}
        />
        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Signing up…' : 'Notify me'}
        </button>
      </div>
      {status === 'error' && <p className="signup-error" role="alert">{message}</p>}
    </form>
  )
}
