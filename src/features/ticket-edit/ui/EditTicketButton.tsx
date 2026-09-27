import { Alert, Button, Group, Modal } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconAlertCircle, IconPencil } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useCategoryOptions } from '@/entities/category'
import {
  type Ticket,
  ticketApi,
  ticketErrorFields,
  TicketFormFields,
  ticketFormSchema,
  type TicketFormValues,
  type UpdateTicketPayload,
  useSyncTicket,
} from '@/entities/ticket'
import { getErrorMessage } from '@/shared/api'
import { applyApiErrorToForm, notifyInfo, notifySuccess } from '@/shared/lib'

function toFormValues(ticket: Ticket): TicketFormValues {
  return {
    title: ticket.title,
    description: ticket.description,
    categoryId: ticket.category.id,
    priority: ticket.priority,
  }
}

function collectChanges(ticket: Ticket, values: TicketFormValues): UpdateTicketPayload {
  const original = toFormValues(ticket)
  const normalized = { ...values, title: values.title.trim(), description: values.description.trim() }
  return Object.fromEntries(
    (Object.keys(normalized) as (keyof TicketFormValues)[])
      .filter((key) => normalized[key] !== original[key])
      .map((key) => [key, normalized[key]]),
  )
}

function EditTicketForm({ ticket, onDone }: { ticket: Ticket; onDone: () => void }) {
  const categories = useCategoryOptions()
  const syncTicket = useSyncTicket()
  const form = useForm<TicketFormValues>({
    mode: 'uncontrolled',
    initialValues: toFormValues(ticket),
    validate: schemaResolver(ticketFormSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const updateTicket = useMutation({
    mutationFn: (payload: UpdateTicketPayload) => ticketApi.update(ticket.id, payload),
    onSuccess: async (updated) => {
      await syncTicket(updated)
      notifySuccess('Зміни збережено.')
      onDone()
    },
    onError: (error) => applyApiErrorToForm(form, error, ticketErrorFields),
  })

  const handleSubmit = (values: TicketFormValues) => {
    const changes = collectChanges(ticket, values)
    if (Object.keys(changes).length === 0) {
      notifyInfo('Змін не виявлено.')
      onDone()
      return
    }
    updateTicket.mutate(changes)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      {updateTicket.isError && !Object.keys(form.errors).length && (
        <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />} mb="md" role="alert">
          {getErrorMessage(updateTicket.error)}
        </Alert>
      )}
      <TicketFormFields form={form} categoryOptions={categories.options} categoriesLoading={categories.isLoading} />
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onDone} disabled={updateTicket.isPending}>
          Скасувати
        </Button>
        <Button type="submit" loading={updateTicket.isPending}>
          Зберегти зміни
        </Button>
      </Group>
    </form>
  )
}

export function EditTicketButton({ ticket }: { ticket: Ticket }) {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <Button variant="default" leftSection={<IconPencil size={16} />} onClick={open}>
        Редагувати
      </Button>
      <Modal opened={opened} onClose={close} title="Редагування заявки" size="lg" centered>
        {opened && <EditTicketForm ticket={ticket} onDone={close} />}
      </Modal>
    </>
  )
}
