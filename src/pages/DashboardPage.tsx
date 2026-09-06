import { Link } from 'react-router-dom'
import { AlertTriangle, MapPin, CalendarDays, Clock } from 'lucide-react'
import { Badge, Card, Metric, PageHeader } from '@/components/ui'
import { BrandMark, BrandPoweredBy } from '@/components/BrandMark'
import { BRAND } from '@/branding'
import { LAB, weeklyHoursByStaff, coverageAlerts, shiftLabel } from '@/data/lab'
import { useLabStore } from '@/store/LabStore'

export default function DashboardPage() {
  const {
    leave,
    overtime,
    incompatibilities,
    stationBlocks,
    assignments,
    stations,
    staff,
    staffName,
    stationName,
    resetDemoData,
  } = useLabStore()
  const today = new Date().toISOString().slice(0, 10)
  const todayWork = assignments.filter((a) => a.date === today && a.status === 'work')
  const coveredStations = new Set(todayWork.map((a) => a.stationId)).size
  const hours = weeklyHoursByStaff(assignments, overtime)
  const over40 = [...hours.entries()].filter(([, h]) => h > LAB.weeklyHoursTarget)
  const under40 = [...hours.entries()].filter(([, h]) => h < LAB.weeklyHoursTarget - 4)
  const coverage = coverageAlerts(assignments).slice(0, 5)
  const pendingLeave = leave.filter((l) => l.status === 'pending').length
  const pendingHe = overtime.filter((h) => h.status === 'pending').length

  return (
    <div>
      <PageHeader
        title="Dashboard operacional"
        subtitle={`${LAB.name} · ${LAB.planLabel} · escala multi-local para ${LAB.scheduler}`}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10 px-2 py-0.5 text-[10px] font-medium text-[#8a7318] sm:inline-flex">
              <BrandMark variant="mark" className="h-4 w-4 rounded" />
              Demo {BRAND.product}
            </span>
            <Badge tone="brand">{LAB.planLabel}</Badge>
            <button
              type="button"
              onClick={resetDemoData}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
            >
              Reset demo
            </button>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Locais" value={stations.length} hint="11 postos / rede" />
        <Metric
          label="Colaboradores"
          value={staff.filter((s) => s.active && s.role === 'colaborador').length}
          hint="Meta 10–15 na proposta"
        />
        <Metric label="Colocações hoje" value={todayWork.length} hint={`${coveredStations} postos cobertos`} />
        <Metric
          label="Pedidos pendentes"
          value={pendingLeave + pendingHe}
          hint={`${pendingLeave} férias/folgas · ${pendingHe} HE`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <CalendarDays className="h-4 w-4 text-brand-700" />
            Escala de hoje
          </div>
          {todayWork.length === 0 ? (
            <p className="text-sm text-slate-500">
              Sem colocações mock para hoje (domingo ou fora da semana gerada).
            </p>
          ) : (
            <ul className="space-y-2">
              {todayWork.slice(0, 8).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{staffName(a.staffId)}</span>
                    <span className="text-slate-500"> · {stationName(a.stationId)}</span>
                  </span>
                  <Badge tone="ok">{shiftLabel[a.shift]}</Badge>
                </li>
              ))}
            </ul>
          )}
          <Link to="/escalas" className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline">
            Ver escalas →
          </Link>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <Clock className="h-4 w-4 text-brand-700" />
            Alertas 40h / semana
          </div>
          {over40.length === 0 && under40.length === 0 ? (
            <p className="text-sm text-slate-500">Sem desvios relevantes nesta semana mock.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {over40.map(([id, h]) => (
                <li key={`o-${id}`} className="flex justify-between rounded-xl bg-amber-50 px-3 py-2">
                  <span>{staffName(id)}</span>
                  <Badge tone="warn">{`${h}h (> ${LAB.weeklyHoursTarget}h)`}</Badge>
                </li>
              ))}
              {under40.slice(0, 4).map(([id, h]) => (
                <li key={`u-${id}`} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>{staffName(id)}</span>
                  <Badge tone="neutral">{h}h</Badge>
                </li>
              ))}
            </ul>
          )}
          {coverage.length > 0 ? (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Cobertura</div>
              {coverage.map((c) => (
                <div
                  key={`${c.date}-${c.stationId}`}
                  className="rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-sm"
                >
                  {stationName(c.stationId)} · {c.date}: {c.message}
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Regras activas
          </div>
          <ul className="space-y-2">
            {incompatibilities.slice(0, 3).map((i) => (
              <li key={i.id} className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm">
                <div className="font-medium text-amber-950">
                  {staffName(i.a)} ↔ {staffName(i.b)}
                </div>
                <div className="text-amber-900/80">{i.reason}</div>
              </li>
            ))}
            {stationBlocks.slice(0, 3).map((b) => (
              <li key={b.id} className="rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-sm">
                <div className="font-medium text-rose-950">
                  {staffName(b.staffId)} ↛ {stationName(b.stationId)}
                </div>
                <div className="text-rose-900/80">{b.reason}</div>
              </li>
            ))}
          </ul>
          <Link
            to="/incompatibilidades"
            className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
          >
            Gerir regras →
          </Link>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <MapPin className="h-4 w-4 text-brand-700" />
            Pacote aceite (simulado)
          </div>
          <p className="text-sm text-slate-600">
            Desenvolvimento <strong>{LAB.setup}</strong> · {LAB.hostingLabel}{' '}
            <strong>{LAB.hostingChosen}</strong>
            {LAB.maintenanceChosen ? ` · manutenção ${LAB.maintenanceOptional}` : ' · sem manutenção opcional'}.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            PWA instalável + persistência local neste dispositivo (pré-cloud do alojamento anual).
          </p>
        </Card>

        <Card className="border-brand-200 bg-brand-50/50 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-brand-900">Guião WOW (1 minuto)</div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-brand-950/90">
                <li>
                  Em qualquer ecrã: <strong>Adicionar</strong> e <strong>Apagar</strong> (postos,
                  equipa, regras, férias) — “vocês têm a mão em tudo”.
                </li>
                <li>
                  <strong>Escalas → Grelha</strong>: vermelho = falha de cobertura; Joana + Pedro =
                  bloqueio.
                </li>
                <li>
                  <strong>Exportar Excel</strong> + <strong>Portal</strong> no telemóvel.
                </li>
              </ol>
            </div>
            <div className="rounded-xl border border-[#c9a227]/30 bg-slate-50 p-2">
              <BrandMark variant="full" className="h-16 max-w-[140px] bg-transparent" />
            </div>
          </div>
          <BrandPoweredBy className="mt-3" />
        </Card>
      </div>
    </div>
  )
}
