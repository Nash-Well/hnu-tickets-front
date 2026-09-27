import { useState } from 'react'
import { ActionIcon, Button, Group, Select, Stack, Text, Tooltip } from '@mantine/core'
import { IconUserCheck, IconWand } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useSpecialistAnalytics } from '@/entities/analytics'
import { type Ticket, ticketApi, useSyncTicket } from '@/entities/ticket'
import { useSpecialists } from '@/entities/user'
import { notifyError, notifySuccess } from '@/shared/lib'
import { pickLeastLoadedSpecialist } from '../model/pick-least-loaded'

const ALL_TIME = {}

export function AssignSpecialistForm({ ticket }: { ticket: Ticket }) {
  const specialists = useSpecialists()
  const workload = useSpecialistAnalytics(ALL_TIME)
  const syncTicket = useSyncTicket()
  const [specialistId, setSpecialistId] = useState<string | null>(ticket.assignedTo?.id ?? null)

  const workloadById = new Map((workload.data ?? []).map((item) => [item.id, item.openTickets]))
  const options = (specialists.data ?? []).map((specialist) => {
    const openTickets = workloadById.get(specialist.id)
    return {
      value: specialist.id,
      label: openTickets === undefined ? specialist.name : `${specialist.name} · активних: ${openTickets}`,
    }
  })

  const assign = useMutation({
    mutationFn: (id: string) => ticketApi.assign(ticket.id, id),
    onSuccess: async (updated) => {
      await syncTicket(updated)
      notifySuccess(
        `Відповідальний: ${updated.assignedTo?.name ?? '—'}`,
        ticket.assignedTo ? 'Заявку перепризначено' : 'Спеціаліста призначено',
      )
    },
    onError: (error) => notifyError(error, 'Не вдалося призначити спеціаліста'),
  })

  const suggestSpecialist = () => {
    const suggestion = pickLeastLoadedSpecialist(workload.data ?? [], ticket.assignedTo?.id)
    if (suggestion) {
      setSpecialistId(suggestion.id)
    }
  }

  const unchanged = specialistId === ticket.assignedTo?.id
  const noSpecialists = specialists.isSuccess && options.length === 0

  return (
    <Stack gap="xs">
      <Group gap="xs" align="flex-end" wrap="nowrap">
        <Select
          label={ticket.assignedTo ? 'Перепризначити спеціаліста' : 'Призначити спеціаліста'}
          placeholder={specialists.isLoading ? 'Завантаження…' : 'Оберіть спеціаліста'}
          data={options}
          value={specialistId}
          onChange={setSpecialistId}
          searchable
          nothingFoundMessage="Спеціалістів не знайдено"
          disabled={specialists.isLoading || noSpecialists}
          error={specialists.isError ? 'Не вдалося завантажити спеціалістів' : undefined}
          style={{ flex: 1 }}
        />
        <Tooltip label="Підібрати спеціаліста з найменшою кількістю активних заявок" withArrow multiline maw={240}>
          <ActionIcon
            variant="light"
            size={36}
            onClick={suggestSpecialist}
            disabled={!workload.data?.length}
            aria-label="Автопідбір спеціаліста"
          >
            <IconWand size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
      {noSpecialists && (
        <Text size="xs" c="dimmed">
          У системі немає спеціалістів. Призначте роль «Спеціаліст» користувачу в розділі «Користувачі».
        </Text>
      )}
      <Button
        leftSection={<IconUserCheck size={16} />}
        onClick={() => specialistId && assign.mutate(specialistId)}
        disabled={!specialistId || unchanged}
        loading={assign.isPending}
        fullWidth
      >
        {ticket.assignedTo ? 'Перепризначити' : 'Призначити'}
      </Button>
    </Stack>
  )
}
