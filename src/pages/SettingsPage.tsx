import { useState } from 'react'
import { Card, PageHeader, Badge } from '@/components/ui'
import { BrandMark, BrandPoweredBy } from '@/components/BrandMark'
import { BRAND } from '@/branding'
import { LAB } from '@/data/lab'
import { useNavigate } from 'react-router-dom'
import { logoutSession } from '@/lib/auth'
import { useLabStore } from '@/store/LabStore'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { resetDemoData } = useLabStore()
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  function logout() {
    logoutSession()
    navigate('/login', { replace: true })
  }

  function handleReset() {
    const ok = window.confirm(
      'Repor todos os dados de demonstração?\n\nEscalas, pedidos e alterações feitas nesta sessão serão perdidos.',
    )
    if (!ok) return
    resetDemoData()
    setResetMsg('Dados de demonstração repostos.')
  }

  return (
    <div>
      <PageHeader
        title="Definições"
        subtitle="Conta, branding e manutenção da sessão"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 text-sm font-semibold text-slate-800">Cliente</div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Organização</dt>
              <dd className="font-medium">{LAB.legal}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Gestão da escala</dt>
              <dd className="font-medium">{LAB.scheduler}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Contacto</dt>
              <dd className="font-medium">{LAB.phone}</dd>
            </div>
          </dl>
        </Card>

        <Card className="overflow-hidden">
          <div className="mb-3 text-sm font-semibold text-slate-800">Fornecedor</div>
          <div className="mb-3 flex justify-center rounded-xl border border-[#c9a227]/30 bg-slate-50 p-3">
            <BrandMark variant="full" className="h-32 max-w-full bg-transparent" />
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Empresa</dt>
              <dd className="font-medium">{BRAND.company}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Produto</dt>
              <dd className="font-medium text-[#8a7318]">{BRAND.product}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Contacto</dt>
              <dd className="text-right font-medium">
                {BRAND.phone}
                <br />
                <span className="text-xs text-slate-500">{BRAND.email}</span>
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            Manutenção da sessão
            <Badge tone="neutral">Avançado</Badge>
          </div>
          <p className="mb-3 text-sm text-slate-600">
            Use apenas se precisar de recomeçar a demonstração do zero neste dispositivo.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100"
            >
              Repor dados de demonstração
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Terminar sessão
            </button>
            <BrandPoweredBy />
          </div>
          {resetMsg ? <p className="mt-3 text-sm text-emerald-700">{resetMsg}</p> : null}
        </Card>
      </div>
    </div>
  )
}
