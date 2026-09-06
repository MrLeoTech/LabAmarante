import { useState } from 'react'
import { Card, PageHeader } from '@/components/ui'
import { hasRequiredCompetences, missingCompetences } from '@/data/lab'
import { useLabStore } from '@/store/LabStore'

export default function CompetencesPage() {
  const {
    competences,
    stations,
    staff,
    stationRequiredCompetences,
    competenceLabel,
    addCompetence,
    removeCompetence,
    setStationRequirements,
  } = useLabStore()

  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')

  const blockers = stations
    .filter((st) => st.id !== 'mobile')
    .flatMap((st) =>
      staff
        .filter((s) => s.role === 'colaborador' && s.stations.includes(st.id))
        .filter(
          (s) =>
            !hasRequiredCompetences(s.id, st.id, staff, stationRequiredCompetences),
        )
        .map((s) => ({
          staff: s.name,
          station: st.name,
          missing: missingCompetences(s.id, st.id, staff, stationRequiredCompetences).map(
            competenceLabel,
          ),
        })),
    )

  function toggleReq(stationId: string, competenceId: string) {
    const current = stationRequiredCompetences[stationId] ?? []
    const next = current.includes(competenceId)
      ? current.filter((c) => c !== competenceId)
      : [...current, competenceId]
    setStationRequirements(stationId, next)
  }

  return (
    <div>
      <PageHeader
        title="Competências"
        subtitle="Cria regras, associa a postos e apaga o que não precisares"
      />

      <Card className="mb-4">
        <div className="mb-3 font-semibold">Nova competência</div>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!label.trim()) return
            addCompetence({
              label: label.trim(),
              description: description.trim() || 'Definida pela gestão',
            })
            setLabel('')
            setDescription('')
          }}
        >
          <input
            required
            placeholder="Nome (ex.: Transporte amostras)"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            placeholder="Descrição"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white sm:col-span-2"
          >
            Adicionar competência
          </button>
        </form>
      </Card>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {competences.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold">{c.label}</div>
              <button
                type="button"
                className="text-xs font-medium text-rose-700 hover:underline"
                onClick={() => removeCompetence(c.id)}
              >
                Apagar
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">{c.description}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-4">
        <div className="mb-3 font-semibold">Requisitos por posto (clica para ligar/desligar)</div>
        <div className="space-y-3">
          {stations
            .filter((s) => s.id !== 'mobile')
            .map((st) => {
              const required = stationRequiredCompetences[st.id] ?? []
              return (
                <div key={st.id} className="rounded-xl bg-slate-50 px-3 py-2">
                  <div className="mb-2 text-sm font-medium">{st.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {competences.map((c) => {
                      const on = required.includes(c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleReq(st.id, c.id)}
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            on ? 'bg-brand-700 text-white' : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>
      </Card>

      <Card>
        <div className="mb-3 font-semibold">Bloqueios potenciais</div>
        {blockers.length === 0 ? (
          <p className="text-sm text-slate-500">
            Todos os colaboradores nos postos habituais cumprem as competências mínimas.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {blockers.map((b, i) => (
              <li key={i} className="rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2">
                <strong>{b.staff}</strong> em {b.station}: falta {b.missing.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
