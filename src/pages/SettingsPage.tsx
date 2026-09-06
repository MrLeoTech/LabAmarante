import { Card, PageHeader, Badge } from '@/components/ui'
import { BrandMark, BrandPoweredBy } from '@/components/BrandMark'
import { BRAND } from '@/branding'
import { LAB } from '@/data/lab'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const navigate = useNavigate()

  function logout() {
    sessionStorage.removeItem('labamarante-auth')
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <PageHeader
        title="Definições"
        subtitle="Conta, branding e informações do fornecedor"
        action={<Badge tone="brand">Demo</Badge>}
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
              <dt className="text-slate-500">Plano</dt>
              <dd className="font-medium">{LAB.planLabel}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Gestão da escala</dt>
              <dd className="font-medium">{LAB.scheduler}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Alojamento</dt>
              <dd className="font-medium">{LAB.hostingChosen}</dd>
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
          <p className="mt-3 text-xs text-slate-500">{BRAND.services}</p>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-2 text-sm font-semibold text-slate-800">Sessão de demonstração</div>
          <p className="mb-3 text-sm text-slate-600">
            Esta instalação é um protótipo da Opção B para apresentação. Os dados ficam neste
            dispositivo (localStorage). Em produção, o alojamento cloud {BRAND.product} mantém a
            escala partilhada pela equipa.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BrandPoweredBy />
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Terminar sessão
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
