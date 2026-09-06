export type Role = 'admin' | 'gestao' | 'colaborador'

export type Station = {
  id: string
  name: string
  city: string
  address: string
  phone: string
  hours: string
  isHq?: boolean
}

/** Competências / aptidões exigíveis por posto ou turno */
export type Competence = {
  id: string
  label: string
  description: string
}

export type StaffMember = {
  id: string
  name: string
  role: Role
  phone: string
  stations: string[]
  competences: string[]
  active: boolean
  weeklyHoursTarget: number
}

export type ShiftKind = 'morning' | 'afternoon' | 'split'
export type ShiftStatus = 'work' | 'off' | 'vacation' | 'sick' | 'absent'

export type Assignment = {
  id: string
  date: string
  staffId: string
  stationId: string
  shift: ShiftKind
  status: ShiftStatus
  hours: number
}

export type LeaveRequest = {
  id: string
  staffId: string
  type: 'vacation' | 'folga' | 'sick'
  from: string
  to: string
  status: 'pending' | 'approved' | 'rejected'
  note?: string
}

export type OvertimeEntry = {
  id: string
  staffId: string
  date: string
  hours: number
  reason: string
  status: 'pending' | 'approved'
}

/** Pares que não devem trabalhar juntos no mesmo posto/turno */
export type Incompatibility = {
  id: string
  a: string
  b: string
  reason: string
}

/** Colaborador que não deve ser colocado num posto/local concreto */
export type StationBlock = {
  id: string
  staffId: string
  stationId: string
  reason: string
}

export const LAB = {
  name: 'LabAmarante',
  legal: 'LabAmarante, Lda.',
  nif: '501182306',
  contact: 'João Matias',
  scheduler: 'Sandra Coelho',
  plan: 'B' as const,
  planLabel: 'Opção B — Recomendada',
  setup: '2.890 € s/ IVA',
  hostingPlan: 'annual' as const,
  hostingLabel: 'Alojamento anual',
  hostingMonthly: '39,90 €/mês s/ IVA',
  hostingAnnual: '399 €/ano s/ IVA',
  hostingChosen: '399 €/ano s/ IVA',
  maintenanceOptional: '49 €/mês s/ IVA',
  maintenanceChosen: false,
  weeklyHoursTarget: 40,
  phone: '255 410 650',
  email: 'geral@labamarante.com',
  website: 'https://www.labamarante.com',
}

export const competences: Competence[] = [
  { id: 'colheita', label: 'Colheita', description: 'Colheita de amostras em posto' },
  { id: 'recepcao', label: 'Recepção', description: 'Atendimento e recepção de utentes' },
  { id: 'sede_lab', label: 'Sede / lab', description: 'Apoio na sede e circuitos internos' },
  { id: 'conducao', label: 'Condução', description: 'Deslocação entre postos (quando aplicável)' },
  { id: 'supervisao', label: 'Supervisão', description: 'Cobertura e validação de escala' },
]

/** Competências mínimas por posto (bloqueio na atribuição) */
export const stationRequiredCompetences: Record<string, string[]> = {
  sede: ['colheita', 'recepcao'],
  feira: ['colheita', 'recepcao'],
  felgueiras: ['colheita'],
  lixa: ['colheita'],
  livracao: ['colheita'],
  smp: ['colheita'],
  marco: ['colheita', 'recepcao'],
  mondim: ['colheita'],
  fervenca: ['colheita'],
  serrinha: ['colheita'],
}

export const stations: Station[] = [
  {
    id: 'sede',
    name: 'Amarante (Sede)',
    city: 'Amarante',
    address: 'Av. Joaquim Leite de Carvalho, 167, S. Gonçalo, 4600-019',
    phone: '255 410 650/1',
    hours: 'Seg–Sáb 08:00–19:00',
    isHq: true,
  },
  {
    id: 'feira',
    name: 'Campo da Feira',
    city: 'Amarante',
    address: 'Largo Sertório de Carvalho, 164, Ed. Mirante, 4600-037',
    phone: '255 440 010',
    hours: 'Seg–Sex 07:30–12:30 / 14:00–18:00 · Sáb 07:00–12:00',
  },
  {
    id: 'felgueiras',
    name: 'Felgueiras',
    city: 'Felgueiras',
    address: 'Av. Dr. Ribeiro de Magalhães, 1086, Margaride, 4610-108',
    phone: '255 336 314',
    hours: 'Seg–Sex 07:30–12:00 / 14:00–19:00 · Sáb 07:30–12:00',
  },
  {
    id: 'lixa',
    name: 'Lixa',
    city: 'Lixa',
    address: 'Av. Alto da Lixa, 1158, Freixo de Cima, 4615-013',
    phone: '255 489 138',
    hours: 'Seg–Sáb 07:30–10:30',
  },
  {
    id: 'livracao',
    name: 'Livração (Toutosa)',
    city: 'Marco de Canaveses',
    address: 'Rua Antónia e Camila Pamplona, 804, Toutosa, 4635-524',
    phone: '255 535 009',
    hours: 'Seg–Sáb 07:30–10:30',
  },
  {
    id: 'smp',
    name: 'Santa Marta de Penaguião',
    city: 'Santa Marta de Penaguião',
    address: 'Alameda 13 de Janeiro, 26, S. Miguel, 5030-470',
    phone: '255 410 650',
    hours: 'Seg, Qua, Sex 09:00–11:00',
  },
  {
    id: 'marco',
    name: 'Marco de Canaveses',
    city: 'Marco de Canaveses',
    address: 'Rua Prof. José Magalhães Aguiar, Loja 84, Fornos, 4630-409',
    phone: '255 531 246',
    hours: 'Seg–Sex 07:30–12:00 / 14:00–17:00 · Sáb 07:30–11:00',
  },
  {
    id: 'mondim',
    name: 'Mondim de Basto',
    city: 'Mondim de Basto',
    address: 'CC Sr.ª da Graça, 4880-231 Mondim de Basto',
    phone: '255 382 194',
    hours: 'Seg–Sáb 07:30–11:00',
  },
  {
    id: 'fervenca',
    name: 'Fervença',
    city: 'Celorico de Basto',
    address: 'Rua de Fervença, 48, Mota, 4890-314',
    phone: '255 010 894',
    hours: 'Seg–Sáb 07:30–10:30',
  },
  {
    id: 'serrinha',
    name: 'Serrinha',
    city: 'Felgueiras',
    address: 'Av. Sr.ª do Alívio, 444, Santão, 4615-463',
    phone: '255 482 084',
    hours: 'Seg–Sex 07:30–12:00 / 14:00–17:00 · Sáb 07:30–12:00',
  },
  {
    id: 'mobile',
    name: 'Apoio / rotação',
    city: 'Rede',
    address: 'Cobertura entre postos conforme escala',
    phone: '255 410 650',
    hours: 'Conforme necessidade',
  },
]

export const staff: StaffMember[] = [
  {
    id: 'sandra',
    name: 'Sandra Coelho',
    role: 'gestao',
    phone: '910 100 001',
    stations: stations.map((s) => s.id),
    competences: ['supervisao', 'recepcao', 'colheita', 'sede_lab'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's1',
    name: 'Ana Ribeiro',
    role: 'colaborador',
    phone: '910 000 001',
    stations: ['sede', 'feira'],
    competences: ['colheita', 'recepcao', 'sede_lab'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's2',
    name: 'Carlos Mendes',
    role: 'colaborador',
    phone: '910 000 002',
    stations: ['sede', 'feira', 'smp'],
    competences: ['colheita', 'recepcao'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's3',
    name: 'Joana Costa',
    role: 'colaborador',
    phone: '910 000 003',
    stations: ['felgueiras', 'lixa', 'serrinha'],
    competences: ['colheita'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's4',
    name: 'Pedro Silva',
    role: 'colaborador',
    phone: '910 000 004',
    stations: ['felgueiras', 'serrinha'],
    competences: ['colheita', 'recepcao'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's5',
    name: 'Marta Lopes',
    role: 'colaborador',
    phone: '910 000 005',
    stations: ['marco', 'livracao'],
    competences: ['colheita', 'recepcao'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's6',
    name: 'Ricardo Alves',
    role: 'colaborador',
    phone: '910 000 006',
    stations: ['mondim', 'fervenca'],
    competences: ['colheita', 'conducao'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's7',
    name: 'Sofia Martins',
    role: 'colaborador',
    phone: '910 000 007',
    stations: ['sede', 'feira', 'mobile'],
    competences: ['colheita', 'recepcao', 'sede_lab'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's8',
    name: 'Tiago Ferreira',
    role: 'colaborador',
    phone: '910 000 008',
    stations: ['marco', 'livracao', 'smp'],
    competences: ['colheita'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's9',
    name: 'Helena Dias',
    role: 'colaborador',
    phone: '910 000 009',
    stations: ['lixa', 'felgueiras', 'mobile'],
    competences: ['colheita', 'recepcao'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's10',
    name: 'Nuno Teixeira',
    role: 'colaborador',
    phone: '910 000 010',
    stations: ['sede', 'feira', 'felgueiras'],
    competences: ['colheita', 'recepcao', 'supervisao'],
    active: true,
    weeklyHoursTarget: 40,
  },
  {
    id: 's11',
    name: 'Inês Carvalho',
    role: 'colaborador',
    phone: '910 000 011',
    stations: ['mondim', 'fervenca', 'mobile'],
    competences: ['colheita'],
    active: true,
    weeklyHoursTarget: 40,
  },
]

export const incompatibilities: Incompatibility[] = [
  { id: 'i1', a: 's3', b: 's4', reason: 'Conflito operacional reportado pela coordenação' },
  { id: 'i2', a: 's5', b: 's8', reason: 'Pedido explícito de não partilha de posto' },
  { id: 'i3', a: 's7', b: 's2', reason: 'Incompatibilidade em colocações anteriores' },
]

/** Exemplos: pessoa ↔ local (além das competências/funções) */
export const stationBlocks: StationBlock[] = [
  {
    id: 'sb1',
    staffId: 's1',
    stationId: 'mondim',
    reason: 'Distância / não disponível para este local',
  },
  {
    id: 'sb2',
    staffId: 's6',
    stationId: 'sede',
    reason: 'Sem formação nas funções de recepção da sede',
  },
  {
    id: 'sb3',
    staffId: 's11',
    stationId: 'felgueiras',
    reason: 'Pedido da gestão: não colocar neste posto',
  },
]

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'l1',
    staffId: 's3',
    type: 'vacation',
    from: '2026-09-01',
    to: '2026-09-05',
    status: 'pending',
    note: 'Férias marcadas no Excel antigo',
  },
  {
    id: 'l2',
    staffId: 's6',
    type: 'folga',
    from: '2026-08-28',
    to: '2026-08-28',
    status: 'approved',
  },
  {
    id: 'l3',
    staffId: 's9',
    type: 'sick',
    from: '2026-08-25',
    to: '2026-08-26',
    status: 'approved',
    note: 'Baixa médica curta',
  },
]

export const overtimeEntries: OvertimeEntry[] = [
  {
    id: 'he1',
    staffId: 's1',
    date: '2026-08-22',
    hours: 2,
    reason: 'Cobertura sede fim de turno',
    status: 'approved',
  },
  {
    id: 'he2',
    staffId: 's10',
    date: '2026-08-23',
    hours: 1.5,
    reason: 'Apoio Felgueiras',
    status: 'pending',
  },
]

export function staffName(id: string, list: StaffMember[] = staff) {
  return list.find((s) => s.id === id)?.name ?? id
}

export function stationName(id: string, list: Station[] = stations) {
  return list.find((s) => s.id === id)?.name ?? id
}

export function competenceLabel(id: string, list: Competence[] = competences) {
  return list.find((c) => c.id === id)?.label ?? id
}

export function areIncompatible(
  a: string,
  b: string,
  list: Incompatibility[] = incompatibilities,
) {
  return list.some((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a))
}

export function findIncompatibility(
  a: string,
  b: string,
  list: Incompatibility[] = incompatibilities,
) {
  return list.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a))
}

export function findStationBlock(
  staffId: string,
  stationId: string,
  list: StationBlock[] = stationBlocks,
) {
  return list.find((x) => x.staffId === staffId && x.stationId === stationId)
}

export function isBlockedFromStation(
  staffId: string,
  stationId: string,
  list: StationBlock[] = stationBlocks,
) {
  return Boolean(findStationBlock(staffId, stationId, list))
}

export function hasRequiredCompetences(
  staffId: string,
  stationId: string,
  staffList: StaffMember[] = staff,
  requiredMap: Record<string, string[]> = stationRequiredCompetences,
) {
  const member = staffList.find((s) => s.id === staffId)
  if (!member) return false
  if (member.role === 'gestao') return true
  const required = requiredMap[stationId] ?? ['colheita']
  return required.every((c) => member.competences.includes(c))
}

export function missingCompetences(
  staffId: string,
  stationId: string,
  staffList: StaffMember[] = staff,
  requiredMap: Record<string, string[]> = stationRequiredCompetences,
) {
  const member = staffList.find((s) => s.id === staffId)
  if (!member) return []
  const required = requiredMap[stationId] ?? ['colheita']
  return required.filter((c) => !member.competences.includes(c))
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

function shiftHours(shift: ShiftKind) {
  if (shift === 'split') return 8
  if (shift === 'morning') return 4
  return 4
}

export type ScheduleContext = {
  staff: StaffMember[]
  stations: Station[]
  incompatibilities: Incompatibility[]
  stationBlocks: StationBlock[]
  stationRequiredCompetences: Record<string, string[]>
}

/** Escala mock da semana corrente (dias úteis + sábado) */
export function buildWeekAssignments(
  anchor = new Date(),
  ctx?: Partial<ScheduleContext>,
): Assignment[] {
  const staffList = ctx?.staff ?? staff
  const stationList = ctx?.stations ?? stations
  const incomp = ctx?.incompatibilities ?? incompatibilities
  const blocks = ctx?.stationBlocks ?? stationBlocks
  const reqMap = ctx?.stationRequiredCompetences ?? stationRequiredCompetences

  const start = new Date(anchor)
  start.setHours(12, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))

  const list: Assignment[] = []
  let n = 0
  const active = staffList.filter((s) => s.active && s.role === 'colaborador')

  for (let day = 0; day < 6; day++) {
    const d = new Date(start)
    d.setDate(start.getDate() + day)
    const date = iso(d)
    const dayStations = stationList.filter((s) => s.id !== 'mobile').slice(0, day === 5 ? 7 : 9)

    for (const st of dayStations) {
      const pool = active.filter(
        (s) =>
          (s.stations.includes(st.id) || s.stations.includes('mobile')) &&
          hasRequiredCompetences(s.id, st.id, staffList, reqMap) &&
          !isBlockedFromStation(s.id, st.id, blocks),
      )
      const candidates = pool.length
        ? pool
        : active.filter(
            (s) =>
              hasRequiredCompetences(s.id, st.id, staffList, reqMap) &&
              !isBlockedFromStation(s.id, st.id, blocks),
          )
      const pick: StaffMember[] = []

      for (const c of candidates) {
        if (pick.length >= 2) break
        if (pick.some((p) => areIncompatible(p.id, c.id, incomp))) continue
        if (list.some((a) => a.date === date && a.staffId === c.id && a.status === 'work')) continue
        pick.push(c)
      }

      if (pick.length === 1) {
        list.push({
          id: `a${++n}`,
          date,
          staffId: pick[0].id,
          stationId: st.id,
          shift: 'split',
          status: 'work',
          hours: shiftHours('split'),
        })
      } else {
        pick.forEach((p, idx) => {
          const shift: ShiftKind = idx === 0 ? 'morning' : 'afternoon'
          list.push({
            id: `a${++n}`,
            date,
            staffId: p.id,
            stationId: st.id,
            shift,
            status: 'work',
            hours: shiftHours(shift),
          })
        })
      }
    }
  }
  return list
}

export function weeklyHoursByStaff(
  assignments: Assignment[],
  overtime: OvertimeEntry[] = overtimeEntries,
) {
  const map = new Map<string, number>()
  for (const a of assignments) {
    if (a.status !== 'work') continue
    map.set(a.staffId, (map.get(a.staffId) ?? 0) + a.hours)
  }
  for (const he of overtime) {
    if (he.status !== 'approved') continue
    map.set(he.staffId, (map.get(he.staffId) ?? 0) + he.hours)
  }
  return map
}

export function coverageAlerts(assignments: Assignment[]) {
  const byKey = new Map<string, Assignment[]>()
  for (const a of assignments.filter((x) => x.status === 'work')) {
    const key = `${a.date}|${a.stationId}`
    const arr = byKey.get(key) ?? []
    arr.push(a)
    byKey.set(key, arr)
  }
  const alerts: { date: string; stationId: string; message: string }[] = []
  for (const [key, arr] of byKey) {
    const [date, stationId] = key.split('|')
    const hasMorning = arr.some((a) => a.shift === 'morning' || a.shift === 'split')
    const hasAfternoon = arr.some((a) => a.shift === 'afternoon' || a.shift === 'split')
    if (!hasMorning || !hasAfternoon) {
      alerts.push({
        date,
        stationId,
        message: 'Cobertura incompleta (manhã/tarde)',
      })
    }
  }
  return alerts
}

export const shiftLabel: Record<ShiftKind, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  split: 'Partido',
}

export const leaveTypeLabel: Record<LeaveRequest['type'], string> = {
  vacation: 'Férias',
  folga: 'Folga',
  sick: 'Baixa',
}
