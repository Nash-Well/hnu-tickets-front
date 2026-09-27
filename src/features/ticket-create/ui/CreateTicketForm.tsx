import { Alert, Button, Group } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { IconAlertCircle, IconSend } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useCategoryOptions } from '@/entities/category'
import {
  type Ticket,
  ticketApi,
  ticketErrorFields,
  TicketFormFields,
  ticketFormSchema,
  type TicketFormValues,
  useSyncTicket,
} from '@/entities/ticket'
import { getErrorMessage } from '@/shared/api'
import { applyApiErrorToForm, notifySuccess } from '@/shared/lib'

type CreateTicketFormProps = {
  onCreated: (ticket: Ticket) => void
  onCancel: () => void
}

export function CreateTicketForm({ onCreated, onCancel }: CreateTicketFormProps) {
  const categories = useCategoryOptions()
  const syncTicket = useSyncTicket()
  const form = useForm<TicketFormValues>({
    mode: 'uncontrolled',
    initialValues: { title: '', description: '', categoryId: '', priority: 'MEDIUM' },
    validate: schemaResolver(ticketFormSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const createTicket = useMutation({
    mutationFn: ticketApi.create,
    onSuccess: async (ticket) => {
      await syncTicket(ticket)
      notifySuccess('Заявку зареєстровано зі статусом «Нова».', 'Заявку створено')
      onCreated(ticket)
    },
    onError: (error) => applyApiErrorToForm(form, error, ticketErrorFields),
  })

  const handleSubmit = (values: TicketFormValues) =>
    createTicket.mutate({ ...values, title: values.title.trim(), description: values.description.trim() })

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      {createTicket.isError && !Object.keys(form.errors).length && (
        <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />} mb="md" role="alert">
          {getErrorMessage(createTicket.error)}
        </Alert>
      )}
      {categories.isError && (
        <Alert color="orange" variant="light" icon={<IconAlertCircle size={18} />} mb="md">
          Не вдалося завантажити категорії. {getErrorMessage(categories.error)}
        </Alert>
      )}
      <TicketFormFields form={form} categoryOptions={categories.options} categoriesLoading={categories.isLoading} />
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onCancel} disabled={createTicket.isPending}>
          Скасувати
        </Button>
        <Button type="submit" leftSection={<IconSend size={16} />} loading={createTicket.isPending}>
          Створити заявку
        </Button>
      </Group>
    </form>
  )
}
