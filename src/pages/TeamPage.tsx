import { useState } from 'react'
import { Badge, Card, PageHeader } from '@/components/ui'
import { useLabStore } from '@/store/LabStore'

const roleLabel = {
  gestao: 'Gestão',
  colaborador: 'Colaborador',
  admin: 'Admin',
} as const

export default function TeamPage() {
  const {
    staff,
    stations,
    competences,
    competenceLabel,
    stationName,
    addStaff,
    removeStaff,
  } = useLabStore()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [selectedCompetences, setSelectedCompetences] = useState<string[]>(['colheita'])

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  return (
    <div>
      <PageHeader
        title="Equipa"
        subtitle="Junta ou remove colaboradores — ideal para mostrar flexibilidade ao cliente"
      />

      <Card className="mb-4">
        <div className="mb-3 font-semibold">Novo colaborador</div>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            addStaff({
              name: name.trim(),
              phone: phone.trim() || '—',
              stations: selectedStations,
              competences: selectedCompetences.length ? selectedCompetences : ['colheita'],
            })
            setName('')
            setPhone('')
            setSelectedStations([])
            setSelectedCompetences(['colheita'])
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Nome"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Telefone"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-slate-500">Postos habituais</div>
            <div className="flex flex-wrap gap-2">
              {stations.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => toggle(selectedStations, st.id, setSelectedStations)}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    selectedStations.includes(st.id)
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-slate-500">Competências</div>
            <div className="flex flex-wrap gap-2">
              {competences.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(selectedCompetences, c.id, setSelectedCompetences)}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    selectedCompetences.includes(c.id)
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white"
          >
            Adicionar à equipa
          </button>
        </form>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {staff.map((s) => (
          <Card key={s.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-slate-500">{s.phone}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge tone={s.role === 'gestao' ? 'brand' : 'neutral'}>{roleLabel[s.role]}</Badge>
                {s.role !== 'gestao' ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-rose-700 hover:underline"
                    onClick={() => removeStaff(s.id)}
                  >
                    Apagar
                  </button>
                ) : null}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.competences.map((c) => (
                <Badge key={c} tone="ok">
                  {competenceLabel(c)}
                </Badge>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Postos:{' '}
              {s.stations.length
                ? s.stations.map((id) => stationName(id)).join(' · ')
                : 'nenhum'}
            </div>
            <div className="mt-1 text-xs text-slate-500">Meta semanal: {s.weeklyHoursTarget}h</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
