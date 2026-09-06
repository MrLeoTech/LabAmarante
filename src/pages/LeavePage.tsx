import { useState } from 'react'
import { Badge, Card, PageHeader } from '@/components/ui'
import { leaveTypeLabel, type LeaveRequest } from '@/data/lab'
import { useLabStore } from '@/store/LabStore'

const leaveTone = {
  pending: 'warn',
  approved: 'ok',
  rejected: 'danger',
} as const

export default function LeavePage() {
  const {
    leave,
    overtime,
    staff,
    staffName,
    setLeaveStatus,
    setOvertimeStatus,
    addLeave,
    removeLeave,
    addOvertime,
    removeOvertime,
  } = useLabStore()

  const collaborators = staff.filter((s) => s.role === 'colaborador')
  const [staffId, setStaffId] = useState(collaborators[0]?.id ?? '')
  const [type, setType] = useState<LeaveRequest['type']>('folga')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [heStaff, setHeStaff] = useState(collaborators[0]?.id ?? '')
  const [heHours, setHeHours] = useState('1')
  const [heReason, setHeReason] = useState('')
  const [heDate, setHeDate] = useState(new Date().toISOString().slice(0, 10))

  return (
    <div>
      <PageHeader
        title="Férias, folgas e horas extra"
        subtitle="Cria, aprova ou apaga pedidos — gestão com a mão em tudo"
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 font-semibold">Novo pedido (férias/folga/baixa)</div>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!staffId || !from) return
              addLeave({
                staffId,
                type,
                from,
                to: to || from,
              })
              setFrom('')
              setTo('')
            }}
          >
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              {collaborators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as LeaveRequest['type'])}
            >
              <option value="folga">Folga</option>
              <option value="vacation">Férias</option>
              <option value="sick">Baixa</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                required
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <input
                type="date"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white"
            >
              Adicionar pedido
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
              if (!heStaff || !hours || !heReason.trim()) return
              addOvertime({
                staffId: heStaff,
                date: heDate,
                hours,
                reason: heReason.trim(),
              })
              setHeHours('1')
              setHeReason('')
            }}
          >
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={heStaff}
              onChange={(e) => setHeStaff(e.target.value)}
            >
              {collaborators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={heDate}
              onChange={(e) => setHeDate(e.target.value)}
            />
            <input
              type="number"
              min="0.5"
              step="0.5"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={heHours}
              onChange={(e) => setHeHours(e.target.value)}
            />
            <input
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
              Adicionar HE
            </button>
          </form>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 font-semibold">Pedidos</div>
          <ul className="space-y-2">
            {leave.map((l) => (
              <li key={l.id} className="rounded-xl border border-slate-100 px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{staffName(l.staffId)}</span>
                  <Badge tone={leaveTone[l.status]}>
                    {l.status === 'pending'
                      ? 'Pendente'
                      : l.status === 'approved'
                        ? 'Aprovado'
                        : 'Recusado'}
                  </Badge>
                </div>
                <div className="mt-1 text-slate-600">
                  {leaveTypeLabel[l.type]} · {l.from}
                  {l.to !== l.from ? ` → ${l.to}` : ''}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {l.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        className="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-medium text-white"
                        onClick={() => setLeaveStatus(l.id, 'approved')}
                      >
                        Aprovar
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                        onClick={() => setLeaveStatus(l.id, 'rejected')}
                      >
                        Recusar
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-700"
                    onClick={() => removeLeave(l.id)}
                  >
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 font-semibold">Horas extra</div>
          <ul className="space-y-2">
            {overtime.map((h) => (
              <li key={h.id} className="rounded-xl border border-slate-100 px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{staffName(h.staffId)}</span>
                  <Badge tone={h.status === 'approved' ? 'ok' : 'warn'}>
                    {h.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </div>
                <div className="mt-1 text-slate-600">
                  {h.date} · {h.hours}h
                </div>
                <div className="mt-1 text-xs text-slate-500">{h.reason}</div>
                <div className="mt-2 flex gap-2">
                  {h.status === 'pending' ? (
                    <button
                      type="button"
                      className="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-medium text-white"
                      onClick={() => setOvertimeStatus(h.id, 'approved')}
                    >
                      Aprovar HE
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-700"
                    onClick={() => removeOvertime(h.id)}
                  >
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
