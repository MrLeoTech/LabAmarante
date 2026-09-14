import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BrandMark } from '@/components/BrandMark'
import { BRAND } from '@/branding'
import { LAB } from '@/data/lab'
import { isAuthenticated, login } from '@/lib/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState('sandra')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const result = login(user, pin)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-10 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#c9a227]/15 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-[#c9a227]/10 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl border border-[#c9a227]/35 bg-transparent p-3 shadow-[0_0_40px_rgba(201,162,39,0.12)]">
            <BrandMark variant="full" className="h-36 w-auto max-w-[300px] bg-transparent" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <div className="mb-1 text-center text-xs uppercase tracking-[0.2em] text-[#e8d48b]/80">
            {BRAND.product}
          </div>
          <h1 className="text-center text-xl font-semibold text-white">{LAB.name}</h1>
          <p className="mt-1 text-center text-sm text-white/55">
            Escalas multi-local · acesso gestão
          </p>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-white/50">Utilizador</span>
              <select
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              >
                <option value="sandra">Sandra Coelho (gestão)</option>
                <option value="joao">João Matias (administração)</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-white/50">PIN</span>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                placeholder="••••"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/30"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setError(null)
                }}
              />
            </label>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#c9a227] px-3 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e8d48b]"
            >
              Entrar
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-white/40">
            {BRAND.company} · {BRAND.tagline}
          </p>
        </div>

        <p className="mt-4 text-center text-[10px] text-white/35">
          {BRAND.phone} · {BRAND.email} · {BRAND.location}
        </p>
      </div>
    </div>
  )
}
