import { Alert, Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle, IconArrowRight } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { commentApi } from '@/entities/comment'
import {
  StatusBadge,
  statusLabels,
  type Ticket,
  ticketApi,
  type TicketStatus,
  useSyncTicket,
} from '@/entities/ticket'
import { getErrorMessage } from '@/shared/api'
import { notifyError, notifySuccess } from '@/shared/lib'
import type { TransitionConfig } from '../model/transition-config'

type StatusTransitionModalProps = {
  ticket: Ticket
  target: TicketStatus | null
  config: TransitionConfig | null
  onClose: () => void
}

const MAX_COMMENT_LENGTH = 5000

function composeComment(prefix: string, text: string) {
  return prefix ? `${prefix}: ${text}` : text
}

type TransitionFormProps = {
  ticket: Ticket
  target: TicketStatus
  config: TransitionConfig
  onClose: () => void
}

function TransitionForm({ ticket, target, config, onClose }: TransitionFormProps) {
  const syncTicket = useSyncTicket()
  const form = useForm({
    initialValues: { comment: '' },
    validate: {
      comment: (value) => {
        const text = value.trim()
        if (config.commentRequired && !text) {
          return 'Це поле є обов’язковим'
        }
        if (composeComment(config.commentPrefix, text).length > MAX_COMMENT_LENGTH) {
          return `Не більше ${MAX_COMMENT_LENGTH} символів`
        }
        return null
      },
    },
  })

  const changeStatus = useMutation({
    mutationFn: async (comment: string) => {
      const updated = await ticketApi.changeStatus(ticket.id, target)
      if (comment) {
        try {
          await commentApi.create(ticket.id, composeComment(config.commentPrefix, comment))
        } catch (error) {
          notifyError(error, 'Статус змінено, але коментар не збережено')
        }
      }
      return updated
    },
    onSuccess: async (updated) => {
      await syncTicket(updated)
      notifySuccess(`Новий статус: «${statusLabels[updated.status]}»`, 'Статус змінено')
      onClose()
    },
  })

  return (
    <form onSubmit={form.onSubmit(({ comment }) => changeStatus.mutate(comment.trim()))} noValidate>
      <Stack gap="md">
        <Group gap="xs">
          <StatusBadge status={ticket.status} size="lg" />
          <IconArrowRight size={16} aria-hidden />
          <StatusBadge status={target} size="lg" />
        </Group>
        {config.description && (
          <Text size="sm" c="dimmed">
            {config.description}
          </Text>
        )}
        {changeStatus.isError && (
          <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />} role="alert">
            {getErrorMessage(changeStatus.error)}
          </Alert>
        )}
        <Textarea
          label={config.commentLabel}
          description={config.commentRequired ? undefined : 'Необов’язково. Буде додано як коментар до заявки.'}
          required={config.commentRequired}
          autosize
          minRows={3}
          maxRows={10}
          data-autofocus
          {...form.getInputProps('comment')}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={changeStatus.isPending}>
            Назад
          </Button>
          <Button type="submit" color={config.color} loading={changeStatus.isPending}>
            {config.confirmLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export function StatusTransitionModal({ ticket, target, config, onClose }: StatusTransitionModalProps) {
  const opened = Boolean(target && config)
  return (
    <Modal opened={opened} onClose={onClose} title={config?.title} centered size="md">
      {target && config && <TransitionForm ticket={ticket} target={target} config={config} onClose={onClose} />}
    </Modal>
  )
}
