import type { Assignment, OvertimeEntry } from '@/data/lab'
import { shiftLabel } from '@/data/lab'

function csvEscape(value: string) {
  if (/[;"\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

type NameFn = (id: string) => string

export function exportAssignmentsCsv(
  assignments: Assignment[],
  staffName: NameFn,
  stationName: NameFn,
  filename = `escala-labamarante-${new Date().toISOString().slice(0, 10)}.csv`,
) {
  const header = ['Data', 'Colaborador', 'Posto', 'Turno', 'Horas', 'Estado']
  const rows = [...assignments]
    .sort((a, b) => a.date.localeCompare(b.date) || a.stationId.localeCompare(b.stationId))
    .map((a) =>
      [
        a.date,
        staffName(a.staffId),
        stationName(a.stationId),
        shiftLabel[a.shift],
        String(a.hours),
        a.status,
      ]
        .map(csvEscape)
        .join(';'),
    )

  const bom = '\uFEFF'
  const blob = new Blob([bom + [header.join(';'), ...rows].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportHoursCsv(
  hours: Map<string, number>,
  overtime: OvertimeEntry[],
  target: number,
  staffName: NameFn,
  filename = `horas-labamarante-${new Date().toISOString().slice(0, 10)}.csv`,
) {
  const header = ['Colaborador', 'Horas semana', 'Meta', 'Desvio', 'HE aprovadas']
  const heByStaff = new Map<string, number>()
  for (const h of overtime) {
    if (h.status !== 'approved') continue
    heByStaff.set(h.staffId, (heByStaff.get(h.staffId) ?? 0) + h.hours)
  }

  const rows = [...hours.entries()].map(([id, h]) =>
    [staffName(id), String(h), String(target), String(h - target), String(heByStaff.get(id) ?? 0)]
      .map(csvEscape)
      .join(';'),
  )

  const bom = '\uFEFF'
  const blob = new Blob([bom + [header.join(';'), ...rows].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function weekDates(anchor = new Date()): string[] {
  const start = new Date(anchor)
  start.setHours(12, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export function weekdayLabel(iso: string) {
  const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const d = new Date(`${iso}T12:00:00`)
  return `${names[d.getDay()]} ${iso.slice(8, 10)}/${iso.slice(5, 7)}`
}
