import { useMemo, useState } from 'react'
import { Badge, Card, PageHeader } from '@/components/ui'
import { leaveTypeLabel, shiftLabel, type LeaveRequest } from '@/data/lab'
import { useLabStore } from '@/store/LabStore'

export default function PortalPage() {
  const {
    leave,
    overtime,
    assignments,
    staff,
    staffName,
    stationName,
    addLeave,
    addOvertime,
  } = useLabStore()
  const collaborators = staff.filter((s) => s.role === 'colaborador')
  const [me, setMe] = useState(collaborators[0]?.id ?? 's1')
  const mine = useMemo(
    () => assignments.filter((a) => a.staffId === me).sort((a, b) => a.date.localeCompare(b.date)),
    [assignments, me],
  )
  const myLeave = leave.filter((l) => l.staffId === me)
  const myHe = overtime.filter((h) => h.staffId === me)

  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('folga')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [heHours, setHeHours] = useState('1')
  const [heReason, setHeReason] = useState('')

  return (
    <div>
      <PageHeader
        title="Portal do colaborador"
        subtitle="Consulta e pedidos no telemóvel — dados guardados neste dispositivo"
        action={
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={me}
            onChange={(e) => setMe(e.target.value)}
          >
            {collaborators.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        }
      />

      <div className="mx-auto max-w-md space-y-4">
        <Card className="bg-brand-800 text-white">
          <div className="text-xs uppercase tracking-wide text-brand-100">Olá</div>
          <div className="mt-1 text-xl font-semibold">{staffName(me)}</div>
          <div className="mt-1 text-sm text-brand-100">A tua escala esta semana</div>
        </Card>

        <Card>
          <div className="mb-3 font-semibold">Próximas colocações</div>
          {mine.length === 0 ? (
            <p className="text-sm text-slate-500">Sem turnos nesta semana mock.</p>
          ) : (
            <ul className="space-y-2">
              {mine.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">{a.date}</div>
                    <div className="text-slate-500">{stationName(a.stationId)}</div>
                  </div>
                  <div className="text-right">
                    <Badge tone="brand">{shiftLabel[a.shift]}</Badge>
                    <div className="mt-1 text-xs text-slate-500">{a.hours}h</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 font-semibold">Pedir folga / férias</div>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!from) return
              addLeave({
                staffId: me,
                type: leaveType,
                from,
                to: to || from,
              })
              setFrom('')
              setTo('')
            }}
          >
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveRequest['type'])}
            >
              <option value="folga">Folga</option>
              <option value="vacation">Férias</option>
              <option value="sick">Baixa</option>
            </select>
            <input
              type="date"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Até (opcional)"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white"
            >
              Enviar pedido
            </button>
          </form>
        </Card>

        <Card>
          <div className="mb-3 font-semibold">Registar horas extra</div>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              const hours = Number(heHours)
              if (!hours || !heReason.trim()) return
              addOvertime({
                staffId: me,
                date: new Date().toISOString().slice(0, 10),
                hours,
                reason: heReason.trim(),
              })
              setHeHours('1')
              setHeReason('')
            }}
          >
            <input
              type="number"
              min="0.5"
              step="0.5"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={heHours}
              onChange={(e) => setHeHours(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder="Motivo"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={heReason}
              onChange={(e) => setHeReason(e.target.value)}
            />
            <button
              type="submit"
              className="w-full rounded-xl border border-brand-700 px-3 py-2 text-sm font-medium text-brand-800"
            >
              Submeter HE
            </button>
          </form>
        </Card>

        <Card>
          <div className="mb-3 font-semibold">Os teus pedidos</div>
          {myLeave.length === 0 && myHe.length === 0 ? (
            <p className="text-sm text-slate-500">Sem pedidos registados.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {myLeave.map((l) => (
                <li key={l.id} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>
                    {leaveTypeLabel[l.type]} · {l.from}
                  </span>
                  <Badge tone={l.status === 'approved' ? 'ok' : l.status === 'rejected' ? 'danger' : 'warn'}>
                    {l.status === 'approved' ? 'OK' : l.status === 'rejected' ? 'Recusado' : 'Pendente'}
                  </Badge>
                </li>
              ))}
              {myHe.map((h) => (
                <li key={h.id} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span>
                    HE {h.hours}h · {h.date}
                  </span>
                  <Badge tone={h.status === 'approved' ? 'ok' : 'warn'}>
                    {h.status === 'approved' ? 'OK' : 'Pendente'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
