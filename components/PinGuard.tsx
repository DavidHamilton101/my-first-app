'use client'

import { useState, useEffect } from 'react'

const CORRECT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? '1234'
const SESSION_KEY = 'cs_admin_verified'

export default function PinGuard({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') setVerified(true)
    setReady(true)
  }, [])

  if (!ready) return null
  if (verified) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setVerified(true)
    } else {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF7F2' }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-serif" style={{ color: '#1D3A2F' }}>Admin Area</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your PIN to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 text-center text-2xl tracking-widest outline-none transition-colors ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-400'
            }`}
            placeholder="••••"
            maxLength={8}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center">Incorrect PIN. Try again.</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity"
            style={{ background: '#1D3A2F' }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
