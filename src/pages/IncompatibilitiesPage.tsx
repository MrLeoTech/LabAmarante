import { useState } from 'react'
import { Badge, Card, PageHeader } from '@/components/ui'
import { useLabStore } from '@/store/LabStore'

export default function IncompatibilitiesPage() {
  const {
    incompatibilities,
    stationBlocks,
    staff,
    stations,
    staffName,
    stationName,
    addIncompatibility,
    removeIncompatibility,
    addStationBlock,
    removeStationBlock,
  } = useLabStore()

  const collaborators = staff.filter((s) => s.role === 'colaborador')
  const [a, setA] = useState(collaborators[0]?.id ?? '')
  const [b, setB] = useState(collaborators[1]?.id ?? collaborators[0]?.id ?? '')
  const [pairReason, setPairReason] = useState('')
  const [pairError, setPairError] = useState<string | null>(null)

  const [blockStaff, setBlockStaff] = useState(collaborators[0]?.id ?? '')
  const [blockStation, setBlockStation] = useState(stations[0]?.id ?? '')
  const [blockReason, setBlockReason] = useState('')
  const [blockError, setBlockError] = useState<string | null>(null)

  return (
    <div>
      <PageHeader
        title="Incompatibilidades"
        subtitle="Duas regras: pessoa ↔ pessoa, e pessoa ↔ posto/local (funções, distância, etc.)"
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-1 font-semibold">Colaborador ↔ colaborador</div>
          <p className="mb-3 text-xs text-slate-500">
            Não partilham o mesmo posto/turno (ex.: Joana e Pedro).
          </p>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const result = addIncompatibility({
                a,
                b,
                reason: pairReason.trim() || 'Definido pela gestão',
              })
              if (!result.ok) {
                setPairError(result.error)
                return
              }
              setPairError(null)
              setPairReason('')
            }}
          >
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={a}
              onChange={(e) => setA(e.target.value)}
            >
              {collaborators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={b}
              onChange={(e) => setB(e.target.value)}
            >
              {collaborators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Motivo"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={pairReason}
              onChange={(e) => setPairReason(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white"
            >
              Adicionar regra pessoa↔pessoa
            </button>
          </form>
          {pairError ? <p className="mt-2 text-sm text-rose-700">{pairError}</p> : null}
        </Card>

        <Card>
          <div className="mb-1 font-semibold">Colaborador ↔ posto / local</div>
          <p className="mb-3 text-xs text-slate-500">
            Ex.: Ana não vai a Mondim; ou não sabe as funções da sede. A Escala bloqueia a colocação.
          </p>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const result = addStationBlock({
                staffId: blockStaff,
                stationId: blockStation,
                reason: blockReason.trim() || 'Definido pela gestão',
              })
              if (!result.ok) {
                setBlockError(result.error)
                return
              }
              setBlockError(null)
              setBlockReason('')
            }}
          >
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={blockStaff}
              onChange={(e) => setBlockStaff(e.target.value)}
            >
              {collaborators.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={blockStation}
              onChange={(e) => setBlockStation(e.target.value)}
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Motivo (distância, funções, pedido…)"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-xl bg-brand-700 px-3 py-2 text-sm font-medium text-white"
            >
              Adicionar regra pessoa↔posto
            </button>
          </form>
          {blockError ? <p className="mt-2 text-sm text-rose-700">{blockError}</p> : null}
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Regras pessoa ↔ pessoa
        </h2>
        <div className="space-y-3">
          {incompatibilities.map((i) => (
            <Card key={i.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">
                  {staffName(i.a)} <span className="text-slate-400">↔</span> {staffName(i.b)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="warn">Pessoas</Badge>
                  <button
                    type="button"
                    className="text-xs font-medium text-rose-700 hover:underline"
                    onClick={() => removeIncompatibility(i.id)}
                  >
                    Apagar
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{i.reason}</p>
            </Card>
          ))}
          {incompatibilities.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">Sem regras entre pessoas.</p>
            </Card>
          ) : null}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Regras pessoa ↔ posto / local
        </h2>
        <div className="space-y-3">
          {stationBlocks.map((b) => (
            <Card key={b.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">
                  {staffName(b.staffId)} <span className="text-slate-400">↛</span>{' '}
                  {stationName(b.stationId)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="danger">Posto</Badge>
                  <button
                    type="button"
                    className="text-xs font-medium text-rose-700 hover:underline"
                    onClick={() => removeStationBlock(b.id)}
                  >
                    Apagar
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{b.reason}</p>
            </Card>
          ))}
          {stationBlocks.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-500">Sem bloqueios de posto. Adiciona uma regra acima.</p>
            </Card>
          ) : null}
        </div>
      </div>

      <Card className="mt-4">
        <p className="text-sm text-slate-600">
          Na <strong>Escala</strong>, se tentares colocar alguém num posto bloqueado (ou sem as
          funções exigidas em Competências), o sistema recusa. São regras diferentes: competências =
          “sabe fazer”; bloqueio de posto = “não deve ir a este local”.
        </p>
      </Card>
    </div>
  )
}
