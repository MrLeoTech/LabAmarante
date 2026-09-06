import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  areIncompatible,
  buildWeekAssignments,
  competences as seedCompetences,
  findIncompatibility,
  findStationBlock,
  hasRequiredCompetences,
  incompatibilities as seedIncomp,
  isBlockedFromStation,
  leaveRequests as seedLeave,
  missingCompetences,
  overtimeEntries as seedOvertime,
  staff as seedStaff,
  stationBlocks as seedStationBlocks,
  stationRequiredCompetences as seedRequired,
  stations as seedStations,
  type Assignment,
  type Competence,
  type Incompatibility,
  type LeaveRequest,
  type OvertimeEntry,
  type Role,
  type ShiftKind,
  type StaffMember,
  type Station,
  type StationBlock,
} from '@/data/lab'
import { loadJson, saveJson } from '@/lib/storage'

type LabState = {
  stations: Station[]
  staff: StaffMember[]
  competences: Competence[]
  stationRequiredCompetences: Record<string, string[]>
  assignments: Assignment[]
  leave: LeaveRequest[]
  overtime: OvertimeEntry[]
  incompatibilities: Incompatibility[]
  stationBlocks: StationBlock[]
}

export type AssignmentResult = { ok: true } | { ok: false; error: string }

type LabStoreValue = LabState & {
  staffName: (id: string) => string
  stationName: (id: string) => string
  competenceLabel: (id: string) => string
  setLeaveStatus: (id: string, status: LeaveRequest['status']) => void
  setOvertimeStatus: (id: string, status: OvertimeEntry['status']) => void
  addLeave: (entry: Omit<LeaveRequest, 'id' | 'status'> & { status?: LeaveRequest['status'] }) => void
  removeLeave: (id: string) => void
  addOvertime: (entry: Omit<OvertimeEntry, 'id' | 'status'> & { status?: OvertimeEntry['status'] }) => void
  removeOvertime: (id: string) => void
  addAssignment: (input: {
    date: string
    staffId: string
    stationId: string
    shift: ShiftKind
  }) => AssignmentResult
  removeAssignment: (id: string) => void
  addStation: (input: Omit<Station, 'id'> & { id?: string }) => void
  removeStation: (id: string) => void
  addStaff: (input: {
    name: string
    phone: string
    role?: Role
    stations: string[]
    competences: string[]
  }) => void
  removeStaff: (id: string) => void
  addCompetence: (input: { label: string; description: string }) => void
  removeCompetence: (id: string) => void
  setStationRequirements: (stationId: string, competenceIds: string[]) => void
  addIncompatibility: (input: { a: string; b: string; reason: string }) => AssignmentResult
  removeIncompatibility: (id: string) => void
  addStationBlock: (input: {
    staffId: string
    stationId: string
    reason: string
  }) => AssignmentResult
  removeStationBlock: (id: string) => void
  regenerateWeek: () => void
  resetDemoData: () => void
}

function shiftHours(shift: ShiftKind) {
  return shift === 'split' ? 8 : 4
}

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 24)
}

function makeSeed(): LabState {
  const seed: LabState = {
    stations: structuredClone(seedStations),
    staff: structuredClone(seedStaff),
    competences: structuredClone(seedCompetences),
    stationRequiredCompetences: structuredClone(seedRequired),
    leave: structuredClone(seedLeave),
    overtime: structuredClone(seedOvertime),
    incompatibilities: structuredClone(seedIncomp),
    stationBlocks: structuredClone(seedStationBlocks),
    assignments: [],
  }
  seed.assignments = buildWeekAssignments(new Date(), {
    staff: seed.staff,
    stations: seed.stations,
    incompatibilities: seed.incompatibilities,
    stationBlocks: seed.stationBlocks,
    stationRequiredCompetences: seed.stationRequiredCompetences,
  })
  return seed
}

const STORAGE_KEY = 'state-v4'

function loadState(): LabState {
  const raw = loadJson<Partial<LabState> | null>(STORAGE_KEY, null)
  if (!raw || !Array.isArray(raw.stations) || !Array.isArray(raw.staff)) return makeSeed()
  const base = makeSeed()
  return {
    ...base,
    ...raw,
    stations: raw.stations,
    staff: raw.staff,
    competences: raw.competences ?? seedCompetences,
    stationRequiredCompetences: raw.stationRequiredCompetences ?? seedRequired,
    assignments: raw.assignments ?? base.assignments,
    leave: raw.leave ?? seedLeave,
    overtime: raw.overtime ?? seedOvertime,
    incompatibilities: raw.incompatibilities ?? seedIncomp,
    stationBlocks: raw.stationBlocks ?? seedStationBlocks,
  }
}

const LabStoreContext = createContext<LabStoreValue | null>(null)

function uid(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function LabStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LabState>(() => loadState())

  useEffect(() => {
    saveJson(STORAGE_KEY, state)
  }, [state])

  const staffName = useCallback(
    (id: string) => state.staff.find((s) => s.id === id)?.name ?? id,
    [state.staff],
  )
  const stationName = useCallback(
    (id: string) => state.stations.find((s) => s.id === id)?.name ?? id,
    [state.stations],
  )
  const competenceLabel = useCallback(
    (id: string) => state.competences.find((c) => c.id === id)?.label ?? id,
    [state.competences],
  )

  const setLeaveStatus = useCallback((id: string, status: LeaveRequest['status']) => {
    setState((s) => ({
      ...s,
      leave: s.leave.map((l) => (l.id === id ? { ...l, status } : l)),
    }))
  }, [])

  const setOvertimeStatus = useCallback((id: string, status: OvertimeEntry['status']) => {
    setState((s) => ({
      ...s,
      overtime: s.overtime.map((h) => (h.id === id ? { ...h, status } : h)),
    }))
  }, [])

  const addLeave = useCallback(
    (entry: Omit<LeaveRequest, 'id' | 'status'> & { status?: LeaveRequest['status'] }) => {
      setState((s) => ({
        ...s,
        leave: [
          {
            id: uid('l'),
            status: entry.status ?? 'pending',
            staffId: entry.staffId,
            type: entry.type,
            from: entry.from,
            to: entry.to,
            note: entry.note,
          },
          ...s.leave,
        ],
      }))
    },
    [],
  )

  const removeLeave = useCallback((id: string) => {
    setState((s) => ({ ...s, leave: s.leave.filter((l) => l.id !== id) }))
  }, [])

  const addOvertime = useCallback(
    (entry: Omit<OvertimeEntry, 'id' | 'status'> & { status?: OvertimeEntry['status'] }) => {
      setState((s) => ({
        ...s,
        overtime: [
          {
            id: uid('he'),
            status: entry.status ?? 'pending',
            staffId: entry.staffId,
            date: entry.date,
            hours: entry.hours,
            reason: entry.reason,
          },
          ...s.overtime,
        ],
      }))
    },
    [],
  )

  const removeOvertime = useCallback((id: string) => {
    setState((s) => ({ ...s, overtime: s.overtime.filter((h) => h.id !== id) }))
  }, [])

  const addAssignment = useCallback(
    (input: {
      date: string
      staffId: string
      stationId: string
      shift: ShiftKind
    }): AssignmentResult => {
      const stationBlock = findStationBlock(
        input.staffId,
        input.stationId,
        state.stationBlocks,
      )
      if (stationBlock || isBlockedFromStation(input.staffId, input.stationId, state.stationBlocks)) {
        const rule = stationBlock ?? findStationBlock(input.staffId, input.stationId, state.stationBlocks)
        return {
          ok: false,
          error: `Bloqueado: ${staffName(input.staffId)} não é compatível com ${stationName(input.stationId)}${rule ? ` — ${rule.reason}` : ''}.`,
        }
      }

      if (
        !hasRequiredCompetences(
          input.staffId,
          input.stationId,
          state.staff,
          state.stationRequiredCompetences,
        )
      ) {
        const missing = missingCompetences(
          input.staffId,
          input.stationId,
          state.staff,
          state.stationRequiredCompetences,
        )
          .map((id) => competenceLabel(id))
          .join(', ')
        return {
          ok: false,
          error: `${staffName(input.staffId)} não tem as funções/competências exigidas neste posto (${missing}).`,
        }
      }

      const sameSlot = state.assignments.filter(
        (a) =>
          a.date === input.date &&
          a.stationId === input.stationId &&
          a.status === 'work' &&
          (a.shift === input.shift || a.shift === 'split' || input.shift === 'split'),
      )

      for (const other of sameSlot) {
        if (areIncompatible(other.staffId, input.staffId, state.incompatibilities)) {
          const rule = findIncompatibility(
            other.staffId,
            input.staffId,
            state.incompatibilities,
          )
          return {
            ok: false,
            error: `Bloqueado: ${staffName(input.staffId)} é incompatível com ${staffName(other.staffId)}${rule ? ` — ${rule.reason}` : ''}.`,
          }
        }
      }

      const assignment: Assignment = {
        id: uid('a'),
        date: input.date,
        staffId: input.staffId,
        stationId: input.stationId,
        shift: input.shift,
        status: 'work',
        hours: shiftHours(input.shift),
      }

      setState((s) => ({ ...s, assignments: [assignment, ...s.assignments] }))
      return { ok: true }
    },
    [state, staffName, stationName, competenceLabel],
  )

  const removeAssignment = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      assignments: s.assignments.filter((a) => a.id !== id),
    }))
  }, [])

  const addStation = useCallback((input: Omit<Station, 'id'> & { id?: string }) => {
    const id = input.id || `${slugify(input.name) || 'posto'}_${uid('').slice(0, 4)}`
    setState((s) => ({
      ...s,
      stations: [...s.stations, { ...input, id }],
      stationRequiredCompetences: {
        ...s.stationRequiredCompetences,
        [id]: s.stationRequiredCompetences[id] ?? ['colheita'],
      },
    }))
  }, [])

  const removeStation = useCallback((id: string) => {
    setState((s) => {
      const { [id]: _, ...restReq } = s.stationRequiredCompetences
      return {
        ...s,
        stations: s.stations.filter((st) => st.id !== id),
        stationRequiredCompetences: restReq,
        assignments: s.assignments.filter((a) => a.stationId !== id),
        stationBlocks: s.stationBlocks.filter((b) => b.stationId !== id),
        staff: s.staff.map((m) => ({
          ...m,
          stations: m.stations.filter((sid) => sid !== id),
        })),
      }
    })
  }, [])

  const addStaff = useCallback(
    (input: {
      name: string
      phone: string
      role?: Role
      stations: string[]
      competences: string[]
    }) => {
      setState((s) => ({
        ...s,
        staff: [
          ...s.staff,
          {
            id: uid('s'),
            name: input.name,
            phone: input.phone,
            role: input.role ?? 'colaborador',
            stations: input.stations,
            competences: input.competences,
            active: true,
            weeklyHoursTarget: 40,
          },
        ],
      }))
    },
    [],
  )

  const removeStaff = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      staff: s.staff.filter((m) => m.id !== id),
      assignments: s.assignments.filter((a) => a.staffId !== id),
      leave: s.leave.filter((l) => l.staffId !== id),
      overtime: s.overtime.filter((h) => h.staffId !== id),
      incompatibilities: s.incompatibilities.filter((i) => i.a !== id && i.b !== id),
      stationBlocks: s.stationBlocks.filter((b) => b.staffId !== id),
    }))
  }, [])

  const addCompetence = useCallback((input: { label: string; description: string }) => {
    const id = `${slugify(input.label) || 'comp'}_${uid('').slice(0, 4)}`
    setState((s) => ({
      ...s,
      competences: [...s.competences, { id, label: input.label, description: input.description }],
    }))
  }, [])

  const removeCompetence = useCallback((id: string) => {
    setState((s) => {
      const nextReq: Record<string, string[]> = {}
      for (const [sid, list] of Object.entries(s.stationRequiredCompetences)) {
        nextReq[sid] = list.filter((c) => c !== id)
      }
      return {
        ...s,
        competences: s.competences.filter((c) => c.id !== id),
        stationRequiredCompetences: nextReq,
        staff: s.staff.map((m) => ({
          ...m,
          competences: m.competences.filter((c) => c !== id),
        })),
      }
    })
  }, [])

  const setStationRequirements = useCallback((stationId: string, competenceIds: string[]) => {
    setState((s) => ({
      ...s,
      stationRequiredCompetences: {
        ...s.stationRequiredCompetences,
        [stationId]: competenceIds,
      },
    }))
  }, [])

  const addIncompatibility = useCallback(
    (input: { a: string; b: string; reason: string }): AssignmentResult => {
      if (input.a === input.b) {
        return { ok: false, error: 'Escolhe duas pessoas diferentes.' }
      }
      if (areIncompatible(input.a, input.b, state.incompatibilities)) {
        return { ok: false, error: 'Essa incompatibilidade já existe.' }
      }
      setState((s) => ({
        ...s,
        incompatibilities: [
          { id: uid('i'), a: input.a, b: input.b, reason: input.reason || 'Definido pela gestão' },
          ...s.incompatibilities,
        ],
      }))
      return { ok: true }
    },
    [state.incompatibilities],
  )

  const removeIncompatibility = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      incompatibilities: s.incompatibilities.filter((i) => i.id !== id),
    }))
  }, [])

  const addStationBlock = useCallback(
    (input: { staffId: string; stationId: string; reason: string }): AssignmentResult => {
      if (isBlockedFromStation(input.staffId, input.stationId, state.stationBlocks)) {
        return { ok: false, error: 'Essa pessoa já está bloqueada neste posto.' }
      }
      setState((s) => ({
        ...s,
        stationBlocks: [
          {
            id: uid('sb'),
            staffId: input.staffId,
            stationId: input.stationId,
            reason: input.reason || 'Definido pela gestão',
          },
          ...s.stationBlocks,
        ],
      }))
      return { ok: true }
    },
    [state.stationBlocks],
  )

  const removeStationBlock = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      stationBlocks: s.stationBlocks.filter((b) => b.id !== id),
    }))
  }, [])

  const regenerateWeek = useCallback(() => {
    setState((s) => ({
      ...s,
      assignments: buildWeekAssignments(new Date(), {
        staff: s.staff,
        stations: s.stations,
        incompatibilities: s.incompatibilities,
        stationBlocks: s.stationBlocks,
        stationRequiredCompetences: s.stationRequiredCompetences,
      }),
    }))
  }, [])

  const resetDemoData = useCallback(() => {
    setState(makeSeed())
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      staffName,
      stationName,
      competenceLabel,
      setLeaveStatus,
      setOvertimeStatus,
      addLeave,
      removeLeave,
      addOvertime,
      removeOvertime,
      addAssignment,
      removeAssignment,
      addStation,
      removeStation,
      addStaff,
      removeStaff,
      addCompetence,
      removeCompetence,
      setStationRequirements,
      addIncompatibility,
      removeIncompatibility,
      addStationBlock,
      removeStationBlock,
      regenerateWeek,
      resetDemoData,
    }),
    [
      state,
      staffName,
      stationName,
      competenceLabel,
      setLeaveStatus,
      setOvertimeStatus,
      addLeave,
      removeLeave,
      addOvertime,
      removeOvertime,
      addAssignment,
      removeAssignment,
      addStation,
      removeStation,
      addStaff,
      removeStaff,
      addCompetence,
      removeCompetence,
      setStationRequirements,
      addIncompatibility,
      removeIncompatibility,
      addStationBlock,
      removeStationBlock,
      regenerateWeek,
      resetDemoData,
    ],
  )

  return <LabStoreContext.Provider value={value}>{children}</LabStoreContext.Provider>
}

export function useLabStore() {
  const ctx = useContext(LabStoreContext)
  if (!ctx) throw new Error('useLabStore must be used within LabStoreProvider')
  return ctx
}
