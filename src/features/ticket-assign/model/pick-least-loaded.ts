import type { SpecialistWorkload } from '@/entities/analytics'

export function pickLeastLoadedSpecialist(workload: SpecialistWorkload[], excludeId?: string) {
  return [...workload]
    .filter((specialist) => specialist.id !== excludeId)
    .sort((a, b) => a.openTickets - b.openTickets || a.name.localeCompare(b.name, 'uk'))[0]
}
