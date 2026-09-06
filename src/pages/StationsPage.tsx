import { useState } from 'react'
import { Badge, Card, PageHeader } from '@/components/ui'
import { useLabStore } from '@/store/LabStore'

export default function StationsPage() {
  const {
    stations,
    competences,
    stationRequiredCompetences,
    competenceLabel,
    addStation,
    removeStation,
  } = useLabStore()

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [hours, setHours] = useState('Seg–Sáb 08:00–12:00')

  return (
    <div>
      <PageHeader
        title="Postos / locais"
        subtitle="Adiciona ou remove postos — a rede fica sob o teu controlo"
      />

      <Card className="mb-4">
        <div className="mb-3 font-semibold">Novo posto</div>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            addStation({
              name: name.trim(),
              city: city.trim() || '—',
              address: address.trim() || '—',
              phone: phone.trim() || '—',
              hours: hours.trim() || 'A definir',
            })
            setName('')
            setCity('')
            setAddress('')
            setPhone('')
          }}
        >
          <input
            required
            placeholder="Nome do posto"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Cidade"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            placeholder="Morada"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            placeholder="Telefone"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            placeholder="Horário"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white sm:col-span-2"
          >
            Adicionar posto
          </button>
        </form>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {stations.map((st) => (
          <Card key={st.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-900">
                  {st.name} {st.isHq ? <Badge tone="brand">Sede</Badge> : null}
                </div>
                <div className="mt-1 text-sm text-slate-500">{st.city}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge tone="neutral">{st.phone}</Badge>
                {!st.isHq ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-rose-700 hover:underline"
                    onClick={() => removeStation(st.id)}
                  >
                    Apagar
                  </button>
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">{st.address}</p>
            <p className="mt-1 text-xs text-slate-500">{st.hours}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(stationRequiredCompetences[st.id] ?? []).map((c) => (
                <Badge key={c} tone="ok">
                  {competenceLabel(c)}
                </Badge>
              ))}
              {(stationRequiredCompetences[st.id] ?? []).length === 0 ? (
                <span className="text-xs text-slate-400">Sem requisitos · ver Competências</span>
              ) : null}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {competences.length} competências no catálogo
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
