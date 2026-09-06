import { useMemo, useState } from 'react'
import { Badge, Card, PageHeader } from '@/components/ui'
import {
  shiftLabel,
  weeklyHoursByStaff,
  LAB,
  type ShiftKind,
} from '@/data/lab'
import {
  exportAssignmentsCsv,
  exportHoursCsv,
  weekDates,
  weekdayLabel,
} from '@/lib/exportSchedule'
import { useLabStore } from '@/store/LabStore'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function SchedulesPage() {
  const {
    assignments,
    overtime,
    stations,
    staff,
    staffName,
    stationName,
    addAssignment,
    removeAssignment,
    regenerateWeek,
  } = useLabStore()

  const hours = useMemo(() => weeklyHoursByStaff(assignments, overtime), [assignments, overtime])
  const dates = weekDates()
  const [stationFilter, setStationFilter] = useState('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [date, setDate] = useState(todayIso)
  const collaborators = staff.filter((s) => s.role === 'colaborador' && s.active)
  const [staffId, setStaffId] = useState(() => collaborators[0]?.id ?? '')
  const [stationId, setStationId] = useState(() => stations[0]?.id ?? 'sede')
  const [shift, setShift] = useState<ShiftKind>('morning')
  const [message, setMessage] = useState<{ tone: 'ok' | 'danger' | 'warn'; text: string } | null>(
    null,
  )

  const gridStations = stations.filter((s) => s.id !== 'mobile')

  const uncovered = useMemo(() => {
    const gaps: { date: string; stationId: string }[] = []
    const stList = stations.filter((s) => s.id !== 'mobile').slice(0, 8)
    for (const d of dates) {
      for (const st of stList) {
        const day = assignments.filter(
          (a) => a.date === d && a.stationId === st.id && a.status === 'work',
        )
        const morning = day.some((a) => a.shift === 'morning' || a.shift === 'split')
        const afternoon = day.some((a) => a.shift === 'afternoon' || a.shift === 'split')
        if (!morning || !afternoon) gaps.push({ date: d, stationId: st.id })
      }
    }
    return gaps
  }, [assignments, dates, stations])

  const filtered = assignments
    .filter((a) => stationFilter === 'all' || a.stationId === stationFilter)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.stationId.localeCompare(b.stationId))

  function cellPeople(d: string, sid: string) {
    return assignments.filter((a) => a.date === d && a.stationId === sid && a.status === 'work')
  }

  return (
    <div>
      <PageHeader
        title="Escalas"
        subtitle="Grelha tipo Excel · adicionar/remover colocações · exportação"
        action={
          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => exportAssignmentsCsv(assignments, staffName, stationName)}
              className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white"
            >
              Exportar Excel (CSV)
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              PDF / Imprimir
            </button>
            <button
              type="button"
              onClick={() => {
                regenerateWeek()
                setMessage({ tone: 'ok', text: 'Semana regenerada com a equipa/postos actuais.' })
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              Regenerar
            </button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          className={`rounded-xl px-3 py-1.5 text-sm ${view === 'grid' ? 'bg-brand-800 text-white' : 'bg-white border border-slate-200'}`}
          onClick={() => setView('grid')}
        >
          Grelha (Excel)
        </button>
        <button
          type="button"
          className={`rounded-xl px-3 py-1.5 text-sm ${view === 'list' ? 'bg-brand-800 text-white' : 'bg-white border border-slate-200'}`}
          onClick={() => setView('list')}
        >
          Lista
        </button>
        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm"
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
        >
          <option value="all">Todos os postos</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm"
          onClick={() => exportHoursCsv(hours, overtime, LAB.weeklyHoursTarget, staffName)}
        >
          Exportar horas 40h
        </button>
      </div>

      <Card className="mb-4 print:hidden">
        <div className="mb-3 font-semibold">Nova colocação</div>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={(e) => {
            e.preventDefault()
            const before = hours.get(staffId) ?? 0
            const addHours = shift === 'split' ? 8 : 4
            const result = addAssignment({ date, staffId, stationId, shift })
            if (!result.ok) {
              setMessage({ tone: 'danger', text: result.error })
              return
            }
            const projected = before + addHours
            if (projected > LAB.weeklyHoursTarget) {
              setMessage({
                tone: 'warn',
                text: `Colocado. Atenção: ${staffName(staffId)} fica com ~${projected}h esta semana (meta ${LAB.weeklyHoursTarget}h).`,
              })
            } else {
              setMessage({
                tone: 'ok',
                text: `Colocado: ${staffName(staffId)} · ${stationName(stationId)} · ${shiftLabel[shift]}`,
              })
            }
          }}
        >
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-slate-500">Data</span>
            <input
              type="date"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-slate-500">Colaborador</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              {collaborators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-slate-500">Posto</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-slate-500">Turno</span>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftKind)}
            >
              <option value="morning">Manhã</option>
              <option value="afternoon">Tarde</option>
              <option value="split">Partido</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white"
            >
              Adicionar
            </button>
          </div>
        </form>
        {message ? (
          <div
            className={`mt-3 rounded-xl px-3 py-2 text-sm ${
              message.tone === 'ok'
                ? 'bg-emerald-50 text-emerald-800'
                : message.tone === 'warn'
                  ? 'bg-amber-50 text-amber-900'
                  : 'bg-rose-50 text-rose-800'
            }`}
          >
            {message.text}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            WOW: bloqueia pessoa↔pessoa, pessoa↔posto (Incompatibilidades) ou falta de funções
            (Competências). Ex.: Ana Ribeiro → Mondim.
          </p>
        )}
      </Card>

      {uncovered.length > 0 ? (
        <Card className="mb-4 border-amber-200 bg-amber-50/80 print:hidden">
          <div className="font-semibold text-amber-950">
            Alertas de cobertura ({uncovered.length})
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {uncovered.slice(0, 8).map((g) => (
              <li key={`${g.date}-${g.stationId}`}>
                <Badge tone="warn">
                  {stationName(g.stationId)} · {g.date.slice(8)}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card className="mb-4 overflow-x-auto print:hidden">
        <div className="mb-3 text-sm font-medium text-slate-600">
          Horas na semana (meta {LAB.weeklyHoursTarget}h)
        </div>
        <div className="flex min-w-max gap-2">
          {collaborators.map((s) => {
            const h = hours.get(s.id) ?? 0
            const tone =
              h > LAB.weeklyHoursTarget ? 'warn' : h < LAB.weeklyHoursTarget - 4 ? 'neutral' : 'ok'
            return (
              <div key={s.id} className="rounded-xl border border-slate-100 px-3 py-2 text-sm">
                <div className="font-medium">{s.name.split(' ')[0]}</div>
                <Badge tone={tone}>{h}h</Badge>
              </div>
            )
          })}
        </div>
      </Card>

      {view === 'grid' ? (
        <Card className="overflow-x-auto print:border-0 print:shadow-none">
          <div className="mb-3 hidden print:block">
            <div className="text-lg font-bold">LeoSuite · Escala LabAmarante</div>
            <div className="text-sm text-slate-600">
              Semana {dates[0]} → {dates[dates.length - 1]} · {LAB.planLabel}
            </div>
          </div>
          <table className="w-full min-w-[900px] border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="sticky left-0 z-10 bg-slate-100 p-2 font-semibold">Posto</th>
                {dates.map((d) => (
                  <th key={d} className="p-2 font-semibold whitespace-nowrap">
                    {weekdayLabel(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gridStations
                .filter((s) => stationFilter === 'all' || s.id === stationFilter)
                .map((st) => (
                  <tr key={st.id} className="border-t border-slate-200">
                    <td className="sticky left-0 z-10 bg-white p-2 font-medium whitespace-nowrap">
                      {st.name}
                    </td>
                    {dates.map((d) => {
                      const people = cellPeople(d, st.id)
                      const morning = people.some(
                        (a) => a.shift === 'morning' || a.shift === 'split',
                      )
                      const afternoon = people.some(
                        (a) => a.shift === 'afternoon' || a.shift === 'split',
                      )
                      const gap = !morning || !afternoon
                      return (
                        <td
                          key={d}
                          className={`align-top p-1.5 ${gap ? 'bg-rose-50' : 'bg-emerald-50/40'}`}
                        >
                          {people.length === 0 ? (
                            <span className="text-rose-700">Sem cobertura</span>
                          ) : (
                            <ul className="space-y-1">
                              {people.map((a) => (
                                <li key={a.id} className="leading-tight">
                                  <span className="font-medium">
                                    {staffName(a.staffId).split(' ')[0]}
                                  </span>
                                  <span className="text-slate-500"> · {shiftLabel[a.shift]}</span>
                                  <button
                                    type="button"
                                    className="ml-1 text-[10px] text-rose-700 print:hidden"
                                    onClick={() => removeAssignment(a.id)}
                                  >
                                    ×
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="space-y-4">
          {dates.map((d) => {
            const day = filtered.filter((a) => a.date === d)
            if (!day.length) return null
            return (
              <Card key={d}>
                <div className="mb-3 font-semibold">{weekdayLabel(d)}</div>
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="pb-2 font-medium">Colaborador</th>
                      <th className="pb-2 font-medium">Posto</th>
                      <th className="pb-2 font-medium">Turno</th>
                      <th className="pb-2 font-medium">Horas</th>
                      <th className="pb-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {day.map((a) => (
                      <tr key={a.id} className="border-t border-slate-100">
                        <td className="py-2 font-medium">{staffName(a.staffId)}</td>
                        <td className="py-2 text-slate-600">{stationName(a.stationId)}</td>
                        <td className="py-2">
                          <Badge tone="brand">{shiftLabel[a.shift]}</Badge>
                        </td>
                        <td className="py-2">{a.hours}h</td>
                        <td className="py-2 text-right">
                          <button
                            type="button"
                            className="text-xs font-medium text-rose-700 hover:underline"
                            onClick={() => removeAssignment(a.id)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
